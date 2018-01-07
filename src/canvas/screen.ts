import { config } from './config';

interface Box {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export default class {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    offCanvas: HTMLCanvasElement;
    offCtx: CanvasRenderingContext2D;
    body: HTMLElement;
    mask: HTMLCanvasElement;
    maskCtx: CanvasRenderingContext2D;
    shootBox: HTMLElement;
    show: Boolean;
    beginMove: Boolean;
    box: Box;

    constructor(selector: string) {
        this.canvas = document.querySelector(selector);

        if (!this.canvas) {
            throw new Error(`The canvas dom ${selector} isn'nt exists!`);
        }

        this.ctx = this.canvas.getContext('2d');
        this.offCanvas = document.createElement('canvas');
        this.offCtx = this.offCanvas.getContext('2d');
        this.body = document.body;
        this.mask = document.createElement('canvas');
        this.maskCtx = this.mask.getContext('2d');
        this.shootBox = document.createElement('div');
        this.show = true;
        this.beginMove = false;
        this.box = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
        };

        this.initBackGround();
        this.initEvent();
    }

    initBackGround() {
        const width = this.body.clientWidth;
        const height = this.body.clientHeight;

        this.mask.style.position = 'fixed';
        this.mask.style.top = '0';
        this.mask.style.left = '0';
        this.mask.style.cursor = 'crosshair';
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
        this.maskCtx.clearRect(
            this.box.startX,
            this.box.startY,
            this.box.endX - this.box.startX,
            this.box.endY - this.box.startY,
        );
    }

    initEvent() {
        window.addEventListener('resize', e => {
            if (this.show) {
                this.resize();
            }
        });
        this.mask.addEventListener('mousedown', e => {
            this.beginBox(e);
        });
        this.mask.addEventListener('mousemove', e => {
            this.drawBox(e);
        });
        this.mask.addEventListener('mouseup', e => {
            this.beginMove = false;
        });
    }

    beginBox(e: MouseEvent) {
        this.box.startX = e.clientX;
        this.box.startY = e.clientY;
        this.beginMove = true;
        console.log(e);
    }

    drawBox(e: MouseEvent) {
        if (!this.beginMove) return;
        console.log(e);

        this.box.endX = e.clientX;
        this.box.endY = e.clientY;

        //if (e.clientX > this.box.startX) {
        //    this.box.endX = this.box.startX;
        //    this.box.startX = e.clientX;
        //} else {
        //    this.box.endX = e.clientX;
        //}

        //if (e.clientY > this.box.startY) {
        //    this.box.endY = this.box.startY;
        //    this.box.startY = e.clientY;
        //} else {
        //    this.box.endY = e.clientY;
        //}

        this.resize();
    }
}
