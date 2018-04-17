import { setConfig, config } from './config';
import Box from './box';
import { PluginType, Config } from 'LIB/interface';
import functionBox from './function-box/function-box';
import logger from './log';
const throttle = require('throttle-debounce/throttle');
const html2canvas = require('html2canvas');
const ee = require('event-emitter');
const emitter = new ee();
type EventListener = (...args: any[]) => void;

setConfig({
    emitter,
});

export default class {
    config: Config;
    body: HTMLElement;
    transMask: HTMLCanvasElement;
    transMaskCtx: CanvasRenderingContext2D;
    mask: HTMLCanvasElement;
    maskCtx: CanvasRenderingContext2D;
    offMask: HTMLCanvasElement;
    offMaskCtx: CanvasRenderingContext2D;
    shootBox: HTMLElement;
    show: Boolean;
    beginMove: Boolean;
    functionBox: HTMLDivElement;

    imageFailListener: EventListener;
    drawAllListener: EventListener;
    resizeListener: EventListener;
    mouseDownListener: EventListener;
    mouseMoveListener: EventListener;
    mouseUpListener: EventListener;
    keyUpListener: EventListener;
    drawListener: EventListener;
    destoryedListener: EventListener;
    shotListener: EventListener;
    blurListener: EventListener;
    cursorChangeListener: EventListener;

    cursorStyle: string;
    clickTime: number; // 点击次数 只在出现box之后计算 用于判断是否确定

    box: Box;

    constructor(config: Config) {
        const plugin = config.plugins || [
            'rectangular',
            'circle',
            'arrow',
            'pen',
            'text',
            'mosaic',
            'image',
            'back',
        ];
        this.config = Object.assign(config, plugin);
        this.body = document.body;
        setConfig({
            rate: window.devicePixelRatio,
            plugins: plugin,
            debuggerMode: config.debuggerMode || false,
            type: config.type || 'imageData',
        });
    }

    platform() {
        let platform = window.navigator.platform;
        if (platform.indexOf('win') !== -1 || platform.indexOf('Win') !== -1) {
            platform = 'windows';
        } else {
            platform = 'other';
        }
        setConfig({
            platform,
        });
    }

    hackBody() {
        // TODO 浏览器前缀
        this.mask.style['userSelect'] = 'none';
        this.transMask.style['userSelect'] = 'none';
    }

    initBackGround(fn: Function) {
        const width = this.body.clientWidth;
        const height = this.body.clientHeight;

        this.mask.style.position = 'fixed';
        this.mask.style.top = '0';
        this.mask.style.left = '0';
        this.mask.style.cursor = this.cursorStyle;
        this.mask.style.zIndex = '100';
        this.mask.style.width = width + 'px';
        this.mask.style.height = height + 'px';
        this.reset();
        this.resize();

        html2canvas(this.body).then((canvas: HTMLCanvasElement) => {
            logger('finished', 1);
            this.transMask = canvas;
            this.transMaskCtx = canvas.getContext('2d');
            this.transMask.style.position = 'fixed';
            this.transMask.style.top = '0';
            this.transMask.style.left = '0';
            this.body.appendChild(canvas);
            this.body.appendChild(this.mask);
            fn();
        });
    }

    reset() {
        const width = this.body.clientWidth * config.rate;
        const height = this.body.clientHeight * config.rate;
        this.mask.width = width;
        this.mask.height = height;

        this.offMask.width = width;
        this.offMask.height = height;
    }

    resize() {
        // TODO 防抖
        const width = this.body.clientWidth * config.rate;
        const height = this.body.clientHeight * config.rate;

        // this.reset();

        this.maskCtx.save();
        this.maskCtx.beginPath();
        this.maskCtx.globalAlpha = 0.7;
        this.maskCtx.fillStyle = 'gray';
        this.maskCtx.fillRect(0, 0, width, height);
        this.maskCtx.stroke();

        this.maskCtx.restore();
    }

    functionBoxPos() {
        const rightMargin = this.body.offsetWidth - this.box.rect.endX;
        const maskWidth = this.mask.getBoundingClientRect().width;

        this.functionBox.style.right = maskWidth - this.box.rect.endX + 'px';
        this.functionBox.style.top = this.box.rect.endY + 10 + 'px';
        this.functionBox.style.display = 'block';
    }

    initEvent() {
        let hasTrajectory = false; // 移动轨迹 避免只点击没有移动的情况
        this.resizeListener = throttle(50, () => {
            if (this.show) {
                this.destroyed();
                // TODO resize box bug
                // this.resize();
            }
        });

        this.mouseDownListener = (e: MouseEvent) => {
            hasTrajectory = false;
            if (e.button !== 0) return;
            if (!this.box.hasBox()) {
                this.beginBox(e);
            } else {
                emitter.emit('end-mousedown', e);
            }
            emitter.emit('mousedown', e);
        };

        this.mouseMoveListener = (e: MouseEvent) => {
            if (this.beginMove) {
                this.drawBox(e);
                hasTrajectory = true;
            } else if (this.box.hasBox()) {
                this.mask.style.cursor = this.cursorStyle;
                emitter.emit('end-mousemove', e);
                this.functionBoxPos();
            }
            emitter.emit('mousemove', e);
        };

        this.mouseUpListener = (e: MouseEvent) => {
            this.beginMove = false;
            if (hasTrajectory && this.box.isFocus) {
                this.box.isShowCircle = true;
                this.box.draw();
                this.functionBoxPos();
                setConfig({
                    boxRect: this.box.rect,
                    width: this.box.rect.endX - this.box.rect.startX,
                    height: this.box.rect.endY - this.box.rect.startY,
                });
            } else if (!this.box.hasBox()) {
                this.box.initBox();
            } else {
                emitter.emit('end-mouseup', e);
            }
            emitter.emit('mouseup', e);
        };

        this.keyUpListener = e => {
            emitter.emit('keyup', e);
        };

        this.drawListener = () => {
            this.resize();
        };

        this.destoryedListener = () => {
            this.destroyed();
        };

        this.shotListener = () => {
            this.screenShots();
        };

        this.blurListener = () => {
            this.blur();
        };

        this.cursorChangeListener = (cursorStyle: string) => {
            this.cursorStyle = cursorStyle;
        };

        this.imageFailListener = (error: object) => {
            this.config.imageFail && this.config.imageFail(error);
        };

        window.addEventListener('resize', this.resizeListener);
        this.mask.addEventListener('mousedown', this.mouseDownListener);
        this.mask.addEventListener('mousemove', this.mouseMoveListener);
        this.mask.addEventListener('mouseup', this.mouseUpListener);
        document.addEventListener('keyup', this.keyUpListener);
        emitter.on('image-fail', this.imageFailListener);
        emitter.on('draw', this.drawListener);
        emitter.on('destoryed', this.destoryedListener);
        emitter.on('shot', this.shotListener);
        emitter.on('cursor-change', this.cursorChangeListener);
        emitter.once('blur', this.blurListener);
    }

    beginBox(e: MouseEvent) {
        this.box.initBox();
        this.box.setPosition({
            startX: e.clientX,
            startY: e.clientY,
        });
        this.beginMove = true;
    }

    drawBox(e: MouseEvent) {
        if (!this.beginMove) return;

        this.box.setPosition({
            endX: e.clientX,
            endY: e.clientY,
        });

        this.globaldraw();
    }

    screenShots() {
        // 开始截图
        logger('begin shots');
        this.box.allBlur();
        const data = this.offMaskCtx.getImageData(
            config.boxRect.startX,
            config.boxRect.startY,
            config.boxRect.endX - config.boxRect.startX,
            config.boxRect.endY - config.boxRect.startY,
        );
        if (config.type === 'imageData') {
            this.config.download.call(null, data);
        } else if (config.type === 'png') {
            const image = new Image();
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = config.boxRect.endX - config.boxRect.startX;
            tmpCanvas.height = config.boxRect.endY - config.boxRect.startY;
            tmpCanvas.getContext('2d').putImageData(data, 0, 0);
            image.src = tmpCanvas.toDataURL('image/png');
            this.config.download.call(null, image);
        }
        config.emitter.emit('destoryed');
        // this.maskCtx.putImageData(data, 0, 0);
    }

    start() {
        this.mask = document.createElement('canvas');
        this.maskCtx = this.mask.getContext('2d');
        this.offMask = document.createElement('canvas');
        this.offMaskCtx = this.offMask.getContext('2d');
        this.shootBox = document.createElement('div');
        this.show = true;
        this.beginMove = false;
        this.cursorStyle = 'crosshair';
        this.clickTime = 0;
        this.initBackGround(() => {
            this.functionBox = functionBox(this.body);
            this.box = new Box(
                this.maskCtx,
                this.offMask,
                this.offMaskCtx,
                this.transMaskCtx,
                this.cursorStyle,
                this.functionBox,
            );
            setConfig({
                wrap: this.body,
            });

            this.initEvent();
            this.platform();
            this.hackBody();
            this.drawAll();
        });
    }

    destroyed() {
        this.mask.remove();
        this.offMask.remove();
        this.transMask.remove();

        config.emitter.off('draw-all', this.drawAllListener);
        this.mask.removeEventListener('mousedown', this.mouseDownListener);
        this.mask.removeEventListener('mousemove', this.mouseMoveListener);
        this.mask.removeEventListener('mouseup', this.mouseUpListener);
        document.removeEventListener('keyup', this.keyUpListener);
        emitter.off('image-fail', this.imageFailListener);
        emitter.off('draw', this.drawListener);
        emitter.off('destoryed', this.destoryedListener);
        emitter.off('shot', this.shotListener);
        emitter.off('cursor-change', this.cursorChangeListener);
        emitter.off('blur', this.blurListener);
    }

    blur() {
        this.box.isFocus = false;
        this.cursorStyle = 'crosshair';
        this.globaldraw();
    }

    globaldraw() {
        this.reset();
        const data = this.box.getData();
        this.resize();
        this.box.draw(data);
    }

    drawAll() {
        this.drawAllListener = () => {
            this.globaldraw();
        };
        config.emitter.on('draw-all', this.drawAllListener);
    }
}
