import { setConfig, config } from './config';
import Box from './box';
import functionBox from './function-box/function-box';
const ee = require('event-emitter');
const emitter = new ee();

setConfig({
    emitter,
});

export default class {
    body: HTMLElement;
    mask: HTMLCanvasElement;
    maskCtx: CanvasRenderingContext2D;
    shootBox: HTMLElement;
    show: Boolean;
    beginMove: Boolean;
    functionBox: HTMLDivElement;

    cursorStyle: string;
    clickTime: number; // 点击次数 只在出现box之后计算 用于判断是否确定

    box: Box;

    constructor(body: HTMLElement = document.body) {
        this.body = body;
        this.mask = document.createElement('canvas');
        this.maskCtx = this.mask.getContext('2d');
        this.shootBox = document.createElement('div');
        this.show = true;
        this.beginMove = false;
        this.cursorStyle = 'crosshair';
        this.clickTime = 0;
        this.initBackGround();
        this.functionBox = functionBox(this.body);
        this.box = new Box(this.maskCtx, this.cursorStyle, this.functionBox);
        setConfig({
            wrap: this.body,
        });

        this.initEvent();
        this.platform();
        this.hackBody();
        this.drawAll();
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
    }

    initBackGround() {
        const width = this.body.clientWidth;
        const height = this.body.clientHeight;

        this.mask.style.position = 'fixed';
        this.mask.style.top = '0';
        this.mask.style.left = '0';
        this.mask.style.cursor = this.cursorStyle;
        this.mask.style.zIndex = '100';
        this.resize();

        this.body.appendChild(this.mask);
    }

    resize() {
        // TODO 防抖
        const width = this.body.clientWidth;
        const height = this.body.clientHeight;

        this.mask.width = width;
        this.mask.height = height;
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
        const min = 250;
        if (rightMargin < min) {
            left += min - rightMargin;
        }
        this.functionBox.style.left = this.box.rect.endX - left + 'px';
        this.functionBox.style.top = this.box.rect.endY + 10 + 'px';
        this.functionBox.style.display = 'block';
    }

    initEvent() {
        let hasTrajectory = false; // 移动轨迹 避免只点击没有移动的情况
        window.addEventListener('resize', e => {
            if (this.show) {
                // TODO resize box bug
                this.resize();
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

        emitter.on('draw', () => {
            this.resize();
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
        // 开始截图
    }

    blur() {
        this.box.isFocus = false;
        this.cursorStyle = 'crosshair';
        this.globaldraw();
    }

    globaldraw() {
        this.resize();
        this.box.draw();
    }

    drawAll() {
        config.emitter.on('draw-all', () => {
            this.globaldraw();
        });
    }
}
