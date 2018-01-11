import { dragCircle, Rect } from 'LIB/interface';
import { getCircleMap } from 'LIB/help';
import { EventEmitter } from 'events';
import { config } from '../config';
import Mouse from './mouse';
const ee = require('event-emitter');
const rectangularEmitter = new ee();

export default class {
    id: number;
    ctx: CanvasRenderingContext2D;
    circles: Array<dragCircle>;
    rect?: Rect;
    isResize: boolean; // 是否正在绘制中
    isFocus: boolean; // 是否聚焦 聚焦才会展示可拖动点
    isStroke: boolean; // 是否是是空心的
    color: string;
    lineWidth: number;
    borderRadious: number;
    circleWidth: number;
    mouse: Mouse;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.mouse = new Mouse(this, rectangularEmitter);
        this.isFocus = true;
        this.isStroke = true;
        this.color = 'red';
        this.lineWidth = 1;
        this.borderRadious = 1;
        this.circleWidth = 3;
        this.id = config.uid++;
        this.initBox();

        this.event();
    }

    setPosition(rect: Rect, isDraw = false) {
        Object.assign(this.rect, rect);

        if (isDraw) {
            this.draw();
        }
    }

    event() {
        config.emitter.on('mousedown', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(e);
            }
        });
    }

    initBox() {
        this.rect = {
            startX: undefined,
            startY: undefined,
            endX: undefined,
            endY: undefined,
        };
    }

    hasBox() {
        return !!(
            this.rect.startX !== undefined &&
            this.rect.startY !== undefined &&
            this.rect.endX !== undefined &&
            this.rect.endY !== undefined
        );
    }

    draw() {
        const circleMap = getCircleMap(this.rect, this.lineWidth);
        this.circles = circleMap;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        // 画圆角
        this.ctx.moveTo(
            this.rect.startX - this.lineWidth,
            this.rect.startY - this.lineWidth,
        );
        this.ctx.lineTo(
            this.rect.endX + this.lineWidth,
            this.rect.startY - this.lineWidth,
        );
        this.ctx.lineTo(
            this.rect.endX + this.lineWidth,
            this.rect.endY + this.lineWidth,
        );
        this.ctx.lineTo(
            this.rect.startX - this.lineWidth,
            this.rect.endY + this.lineWidth,
        );
        this.ctx.lineTo(
            this.rect.startX - this.lineWidth,
            this.rect.startY - this.lineWidth,
        );
        if (this.isStroke) {
            this.ctx.strokeStyle = this.color;
            this.ctx.stroke();
        } else {
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
        for (let i of circleMap) {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.color;
            this.ctx.arc(i.x, i.y, this.circleWidth, 0, Math.PI * 2, true);
            this.ctx.stroke();
            this.ctx.fillStyle = 'white';
            this.ctx.fill();
        }
        this.ctx.restore();
    }
}
