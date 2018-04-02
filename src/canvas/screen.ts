import { setConfig, config } from './config';
import Box from './box';
import { plugins } from 'LIB/interface';
import functionBox from './function-box/function-box';
const html2canvas = require('html2canvas');
const ee = require('event-emitter');
const emitter = new ee();

setConfig({
    emitter,
});
interface Config {
    plugins?: Array<plugins>;
    download: Function;
}

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

    cursorStyle: string;
    clickTime: number; // 点击次数 只在出现box之后计算 用于判断是否确定

    box: Box;

    constructor(config: Config) {
        const plugin = config.plugins || [
            plugins['rectangular'],
            plugins['circle'],
            plugins['arrow'],
            plugins['pen'],
            plugins['text'],
            plugins['mosaic'],
            plugins['image'],
            plugins['back'],
        ];
        this.config = Object.assign(config, plugin);
        this.body = document.body;
        this.mask = document.createElement('canvas');
        this.maskCtx = this.mask.getContext('2d');
        this.offMask = document.createElement('canvas');
        this.offMaskCtx = this.offMask.getContext('2d');
        this.shootBox = document.createElement('div');
        this.show = true;
        this.beginMove = false;
        this.cursorStyle = 'crosshair';
        this.clickTime = 0;
        setConfig({
            rate: window.devicePixelRatio,
            plugins: plugin,
        });
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

        html2canvas(document.body).then((canvas: HTMLCanvasElement) => {
            console.log('finished');
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
        let left = 100;
        const rightMargin = this.body.offsetWidth - this.box.rect.endX;
        const min = 350;
        const maskWidth = this.mask.getBoundingClientRect().width;
        if (rightMargin < min) {
            left += min - rightMargin;
        }
        // this.functionBox.style.left = this.box.rect.endX - left + 'px';
        this.functionBox.style.right = maskWidth - this.box.rect.endX + 'px';
        this.functionBox.style.top = this.box.rect.endY + 10 + 'px';
        this.functionBox.style.display = 'block';
    }

    initEvent() {
        let hasTrajectory = false; // 移动轨迹 避免只点击没有移动的情况
        window.addEventListener('resize', e => {
            if (this.show) {
                // TODO resize box bug
                // this.resize();
            }
        });
        this.mask.addEventListener('mousedown', e => {
            hasTrajectory = false;
            if (e.button !== 0) return;
            if (!this.box.hasBox()) {
                this.beginBox(e);
            } else {
                emitter.emit('end-mousedown', e);
            }
            emitter.emit('mousedown', e);
        });
        this.mask.addEventListener('mousemove', e => {
            if (this.beginMove) {
                this.drawBox(e);
                hasTrajectory = true;
            } else if (this.box.hasBox()) {
                //this.cursorStyle = this.cursor.getCursor(e);
                this.mask.style.cursor = this.cursorStyle;
                emitter.emit('end-mousemove', e);
                this.functionBoxPos();
            }
            emitter.emit('mousemove', e);
        });
        this.mask.addEventListener('mouseup', e => {
            this.beginMove = false;
            if (hasTrajectory) {
                this.box.isShowCircle = true;
                this.box.draw();
                this.functionBoxPos();
                setConfig({
                    boxRect: this.box.rect,
                });
            } else if (!this.box.hasBox()) {
                this.box.initBox();
            } else {
                emitter.emit('end-mouseup', e);
            }
            emitter.emit('mouseup', e);
        });
        document.addEventListener('keyup', e => {
            emitter.emit('keyup', e);
        });

        emitter.on('draw', () => {
            this.resize();
        });

        emitter.on('destoryed', () => {
            this.destroyed();
        });

        emitter.on('shot', () => {
            this.screenShots();
        });

        emitter.once('blur', () => {
            this.blur();
        });

        emitter.on('cursor-change', (cursorStyle: string) => {
            this.cursorStyle = cursorStyle;
        });
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
        console.log('begin shots');
        this.box.allBlur();
        const data = this.offMaskCtx.getImageData(
            config.boxRect.startX,
            config.boxRect.startY,
            config.boxRect.endX - config.boxRect.startX,
            config.boxRect.endY - config.boxRect.startY,
        );
        this.config.download.call(null, data);
        // this.maskCtx.putImageData(data, 0, 0);
        // 开始截图
    }

    destroyed() {
        // TODO 事件移除
        this.mask.remove();
        this.transMask.remove();
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
        config.emitter.on('draw-all', () => {
            this.globaldraw();
        });
    }
}
