import { config } from './config';
import { drawEnd } from './drawbox';
import Box from './box';
import Cursor from './cursor';
import Mouse from './mouse';
//import event from 'event-emitter';
const ee = require('event-emitter');
const emitter = new ee();

export default class {
    body: HTMLElement;
    mask: HTMLCanvasElement;
    maskCtx: CanvasRenderingContext2D;
    shootBox: HTMLElement;
    show: Boolean;
    beginMove: Boolean;

    cursorStyle: string;
    clickTime: number; // 点击次数 只在出现box之后计算 用于判断是否确定

    box: Box;
    cursor: Cursor;
    mouse: Mouse;

    constructor(body: HTMLElement = document.body) {
        this.body = body;
        this.mask = document.createElement('canvas');
        this.maskCtx = this.mask.getContext('2d');
        this.shootBox = document.createElement('div');
        this.show = true;
        this.beginMove = false;
        this.cursorStyle = 'crosshair';
        this.clickTime = 0;
        this.box = new Box();
        this.cursor = new Cursor(this.box);
        this.mouse = new Mouse(this.box, emitter);

        this.initBackGround();
        this.initEvent();
        this.hackBody();
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

        this.maskCtx.clearRect(
            this.box.startX,
            this.box.startY,
            this.box.endX - this.box.startX,
            this.box.endY - this.box.startY,
        );
        this.maskCtx.restore();
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
            if (!this.box.hasBox()) {
                this.beginBox(e);
            } else {
                this.mouse.mouseDown(e, this.cursorStyle);
            }
        });
        this.mask.addEventListener('mousemove', e => {
            if (this.beginMove) {
                this.drawBox(e);
                hasTrajectory = true;
            } else if (this.box.hasBox()) {
                this.cursorStyle = this.cursor.getCursor(e);
                this.mask.style.cursor = this.cursorStyle;
                this.mouse.mouseMove(e);
            }
        });
        this.mask.addEventListener('mouseup', e => {
            this.beginMove = false;
            if (hasTrajectory) {
                drawEnd.call(this);
            } else if (!this.box.hasBox()) {
                this.box.initBox();
            }
        });

        emitter.on('draw', () => {
            this.resize();
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

        this.resize();
    }

    screenShots() {
        console.log('begin shots');
        // 开始截图
    }
}
