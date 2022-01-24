/**
 * @description screen
 */
import box from 'Canvas/box';
import { config, setConfig } from 'Canvas/config';
import functionBox from 'Canvas/function-box/function-box';
import log, { hookInstall, setDebuggerData } from 'Canvas/log';
import { Emitter } from 'event-emitter';
import blob from 'LIB/blob';
import { Config, PluginType, Rect } from 'LIB/interface';
import { isString } from 'util';

// tslint:disable
const throttle: Function = require('throttle-debounce/throttle');
const html2canvas: Function = require('html2canvas');
const ee = require('event-emitter');

const emitter: Emitter = new ee();
// tslint:enable

type EventListener = (...args: (Object | string)[]) => void;

setConfig({
    emitter,
});

/**
 * a default class
 */
export default class Screen {
    private config: Config;
    private body: HTMLElement;
    // transMask是带有背景图的，在上面叠加内容
    private transMask: HTMLCanvasElement;
    private transMaskCtx: CanvasRenderingContext2D;
    private mask: HTMLCanvasElement;
    private maskCtx: CanvasRenderingContext2D;
    private offMask: HTMLCanvasElement;
    private offMaskCtx: CanvasRenderingContext2D;
    private shootBox: HTMLElement;
    private show: boolean;
    private beginMove: boolean;
    private functionBox: HTMLDivElement;

    private imageFailListener: EventListener;
    private drawAllListener: EventListener;
    private resizeListener: EventListener;
    private mouseDownListener: EventListener;
    private mouseMoveListener: EventListener;
    private mouseUpListener: EventListener;
    private keyUpListener: EventListener;
    private drawListener: EventListener;
    private destoryedListener: EventListener;
    private shotListener: EventListener;
    private blurListener: EventListener;
    private cursorChangeListener: EventListener;

    private cursorStyle: string;
    private clickTime: number; // 点击次数 只在出现box之后计算 用于判断是否确定

    private box: box;

    constructor(conf: Config) {
        conf.plugins = conf.plugins || [
            'rectangular',
            'circle',
            'arrow',
            'pen',
            'text',
            'mosaic',
            'image',
            'back',
        ];
        // this.config = {...conf, ...plugin};
        this.config = { ...conf };
        this.body = conf.body || document.body;
        setConfig({
            rate: window.devicePixelRatio,
            plugins: conf.plugins,
            debuggerMode: conf.debuggerMode || false,
            outputType: conf.outputType || 'imageData',
            customerDefined: conf.customerDefined || [],
        });
        hookInstall();
        setDebuggerData();
    }

    private platform(): void {
        let platform: string = window.navigator.platform;
        if (platform.indexOf('win') !== -1 || platform.indexOf('Win') !== -1) {
            platform = 'windows';
        } else {
            platform = 'other';
        }
        setConfig({
            platform,
        });
    }

    private hackBody(): void {
        // TODO 浏览器前缀
        this.mask.style.userSelect = 'none';
        this.transMask.style.userSelect = 'none';
    }

    private initBackGround(fn: Function): void {
        // const width: number = this.body.clientWidth;
        // const height: number = this.body.clientHeight;
        const width: number = window.innerWidth;
        const height: number = window.innerHeight;

        this.mask.style.position = 'fixed';
        this.mask.style.top = '0';
        this.mask.style.left = '0';
        this.mask.style.cursor = this.cursorStyle;
        this.mask.style.zIndex = '2147483647';
        this.mask.style.width = `${width}px`;
        this.mask.style.height = `${height}px`;
        this.reset();
        this.resize();

        const innerInit: Function = (
            canvas: HTMLCanvasElement,
            iwidth?: string,
            iheight?: string,
        ): void => {
            log('finished', 1);
            this.transMask = canvas;
            this.transMaskCtx = canvas.getContext('2d');
            this.transMask.style.position = 'fixed';
            this.transMask.style.top = '0';
            this.transMask.style.left = '0';
            this.transMask.style.width = iwidth || `${width}px`;
            this.transMask.style.height = iheight || `${height}px`;
            this.body.appendChild(canvas);
            this.body.appendChild(this.mask);
            fn();
        };

        if (this.config.backgroundData) {
            const tmpC: HTMLCanvasElement = document.createElement('canvas');
            tmpC.width = width * config.rate;
            tmpC.height = height * config.rate;
            if (isString(this.config.backgroundData)) {
                const img: HTMLImageElement = new Image();
                img.onload = (): void => {
                    tmpC.getContext('2d').drawImage(
                        img,
                        0,
                        0,
                        // this.body.clientWidth * config.rate,
                        // this.body.clientHeight * config.rate,
                    );
                    innerInit(tmpC);
                };
                img.src = this.config.backgroundData;
            } else {
                tmpC.getContext('2d').putImageData(
                    this.config.backgroundData,
                    0,
                    0,
                    window.innerWidth * config.rate,
                    window.innerHeight * config.rate,
                    0,
                    0,
                );
                innerInit(tmpC);
            }
        } else if (this.config.noBackground) {
            // nobackground
            // 用一个空canvas减少报错
            innerInit(document.createElement('canvas'), 0, 0);
        } else {
            // tslint:disable
            html2canvas(this.body).then((canvas: HTMLCanvasElement): void => {
                // tslint:enable
                canvas.style.width = `${canvas.width / config.rate}px`;
                canvas.style.height = `${canvas.height / config.rate}px`;
                innerInit(canvas, canvas.style.width, canvas.style.height);
            });
        }
    }

    private reset(): void {
        // const width: number = this.body.clientWidth * config.rate;
        // const height: number = this.body.clientHeight * config.rate;
        const width: number = window.innerWidth * config.rate;
        const height: number = window.innerHeight * config.rate;
        this.mask.width = width;
        this.mask.height = height;

        this.offMask.width = width;
        this.offMask.height = height;
    }

    private resize(): void {
        // TODO 防抖
        // const width: number = this.body.clientWidth * config.rate;
        // const height: number = this.body.clientHeight * config.rate;
        const width: number = window.innerWidth * config.rate;
        const height: number = window.innerHeight * config.rate;

        // this.reset();

        this.maskCtx.save();
        this.maskCtx.beginPath();
        this.maskCtx.globalAlpha = 0.7;
        this.maskCtx.fillStyle = 'gray';
        this.maskCtx.fillRect(0, 0, width, height);
        this.maskCtx.stroke();

        this.maskCtx.restore();
    }

    private functionBoxPos(): void {
        const rightMargin: number = this.body.offsetWidth - this.box.rect.endX;
        const maskWidth: number = this.mask.getBoundingClientRect().width;

        this.functionBox.style.right = `${maskWidth - this.box.rect.endX}px`;
        this.functionBox.style.top = `${this.box.rect.endY + 10}px`;
        this.functionBox.style.display = 'block';
    }

    private initEvent(): void {
        let hasTrajectory: boolean = false; // 移动轨迹 避免只点击没有移动的情况
        // tslint:disable
        this.resizeListener = throttle(50, (): void => {
            // tslint:enable
            if (this.show) {
                // TODO resize box bug
                this.destroyed();
                config.emitter.emit('destoryed');
                // this.resize();
            }
        });

        this.mouseDownListener = (e: MouseEvent): void => {
            hasTrajectory = false;
            if (e.button !== 0) {
                return;
            }
            if (!this.box.hasBox()) {
                this.beginBox(e);
            } else {
                emitter.emit('end-mousedown', e);
            }
            emitter.emit('mousedown', e);
        };

        this.mouseMoveListener = (e: MouseEvent): void => {
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

        this.mouseUpListener = (e: MouseEvent): void => {
            this.beginMove = false;
            if (hasTrajectory && this.box.isFocus) {
                this.box.isShowCircle = true;
                this.box.draw();
                this.functionBoxPos();
                setConfig({
                    boxRect: this.box.rect,
                    width: Math.abs(this.box.rect.endX - this.box.rect.startX),
                    height: Math.abs(this.box.rect.endY - this.box.rect.startY),
                });
            } else if (!this.box.hasBox()) {
                this.box.initBox();
            } else {
                emitter.emit('end-mouseup', e);
            }
            emitter.emit('mouseup', e);
        };

        this.keyUpListener = (e: KeyboardEvent): void => {
            if (e.keyCode === 27) {
                this.destroyed();
                config.emitter.emit('destoryed');
            }
            emitter.emit('keyup', e);
        };

        this.drawListener = (): void => {
            this.resize();
        };

        this.destoryedListener = (): void => {
            this.destroyed();
        };

        this.shotListener = (data?: Function): void => {
            this.screenShots(data);
        };

        this.blurListener = (): void => {
            this.blur();
        };

        this.cursorChangeListener = (cursorStyle: string): void => {
            this.cursorStyle = cursorStyle;
        };

        this.imageFailListener = (error: object): void => {
            if (this.config.imageFail) {
                this.config.imageFail(error);
            }
        };

        window.addEventListener('resize', this.resizeListener);
        this.mask.addEventListener('mousedown', this.mouseDownListener);
        this.mask.addEventListener('mousemove', this.mouseMoveListener);
        document.addEventListener('mouseup', this.mouseUpListener);
        document.addEventListener('keyup', this.keyUpListener);
        emitter.on('image-fail', this.imageFailListener);
        emitter.on('draw', this.drawListener);
        emitter.on('destoryed', this.destoryedListener);
        emitter.on('shot', this.shotListener);
        emitter.on('cursor-change', this.cursorChangeListener);
        emitter.once('blur', this.blurListener);
    }

    private beginBox(e: MouseEvent): void {
        this.box.initBox();
        this.box.setPosition({
            startX: e.clientX,
            startY: e.clientY,
        });
        this.beginMove = true;
    }

    private drawBox(e: MouseEvent): void {
        if (!this.beginMove) {
            return;
        }

        this.box.setPosition({
            endX: e.clientX,
            endY: e.clientY,
        });

        this.globaldraw();
    }

    private screenShots(cb?: Function): void {
        const fn: Function = cb || this.config.download;
        // 开始截图
        log('begin shots');

        let { startX, startY, endX, endY } = config.boxRect;
        // tslint:disable
        if (startX > endX) {
            startX ^= endX;
            endX ^= startX;
            startX ^= endX;
        }
        if (startY > endY) {
            startY ^= endY;
            endY ^= startY;
            startY ^= endY;
        }
        // tslint:enable
        const width: number = endX - startX;
        const height: number = endY - startY;
        const cvsWidth: number = width * config.rate;
        const cvsHeight: number = height * config.rate;

        this.box.allBlur();
        const rect: Rect = this.box.rect;
        if (this.config.noBackground) {
            fn.call(
                null,
                {
                    x: startX,
                    y: startY,
                    width: cvsWidth,
                    height: cvsHeight,
                    actionCtx: this.offMaskCtx,
                },
                rect,
            );
        } else {
            const bData: ImageData = this.transMaskCtx.getImageData(
                startX * config.rate,
                startY * config.rate,
                cvsWidth,
                cvsHeight,
            );
            this.offMaskCtx.putImageData(
                bData,
                startX * config.rate,
                startY * config.rate,
            );
            this.box.getData();
            const data: ImageData = this.offMaskCtx.getImageData(
                startX * config.rate,
                startY * config.rate,
                cvsWidth,
                cvsHeight,
            );
            const tmpCanvas: HTMLCanvasElement =
                document.createElement('canvas');
            tmpCanvas.style.width = `${width}px`;
            tmpCanvas.style.height = `${height}px`;
            tmpCanvas.width = cvsWidth;
            tmpCanvas.height = cvsHeight;
            tmpCanvas.getContext('2d').putImageData(data, 0, 0);
            if (config.outputType === 'imageData') {
                fn.call(null, data, rect);
            } else if (config.outputType === 'png') {
                const image: HTMLImageElement = new Image();
                image.width = width;
                image.height = height;
                image.src = tmpCanvas.toDataURL('image/png');
                fn.call(null, image, rect);
            } else if (config.outputType === 'file') {
                fn.call(null, blob(tmpCanvas.toDataURL('image/png')), rect);
            } else if (config.outputType === 'base64') {
                const base64Data: string = tmpCanvas.toDataURL();
                fn.call(null, base64Data, rect);
            }
        }
        config.emitter.emit('destoryed');
        // this.maskCtx.putImageData(data, 0, 0);
    }

    private start(): void {
        this.mask = document.createElement('canvas');
        this.maskCtx = this.mask.getContext('2d');
        this.offMask = document.createElement('canvas');
        this.offMaskCtx = this.offMask.getContext('2d');
        this.shootBox = document.createElement('div');
        this.show = true;
        this.beginMove = false;
        this.cursorStyle = 'crosshair';
        this.clickTime = 0;
        this.mask.id = 'screenshots-mask';
        this.initBackGround(() => {
            this.functionBox = functionBox(this.body);
            this.box = new box(
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

    private destroyed(): void {
        this.mask.remove();
        this.offMask.remove();
        this.transMask.remove();
        this.show = false;

        config.emitter.off('draw-all', this.drawAllListener);
        this.mask.removeEventListener('mousedown', this.mouseDownListener);
        this.mask.removeEventListener('mousemove', this.mouseMoveListener);
        document.removeEventListener('mouseup', this.mouseUpListener);
        document.removeEventListener('keyup', this.keyUpListener);
        emitter.off('image-fail', this.imageFailListener);
        emitter.off('draw', this.drawListener);
        emitter.off('destoryed', this.destoryedListener);
        emitter.off('shot', this.shotListener);
        emitter.off('cursor-change', this.cursorChangeListener);
        emitter.off('blur', this.blurListener);

        if (this.config.onClose) {
            this.config.onClose();
        }
    }

    private blur(): void {
        this.box.isFocus = false;
        this.cursorStyle = 'crosshair';
        this.globaldraw();
    }

    private globaldraw(): void {
        this.reset();
        const data: HTMLCanvasElement = this.box.getData();
        this.resize();
        this.box.draw(data);
    }

    private drawAll(): void {
        this.drawAllListener = (): void => {
            this.globaldraw();
        };
        config.emitter.on('draw-all', this.drawAllListener);
    }
}
