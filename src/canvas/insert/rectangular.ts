// 周围点
import { dragCircle, Rect } from 'LIB/interface';
import { getCircleMap } from 'LIB/help';
import { EventEmitter } from 'events';
import { config } from '../config';
import Mouse from './mouse';
const ee = require('event-emitter');
const rectangularEmitter = new ee();

export default class {
    ctx: CanvasRenderingContext2D;
    rect?: Rect;
    isFocus: Boolean; // 是否聚焦 聚焦才会展示可拖动点
    isStroke: Boolean; // 是否是是空心的
    color: string;
    lineWidth: number;
    borderRadious: number;
    circleWidth: number;
    mouse: Mouse;

    circles: Array<dragCircle>;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.mouse = new Mouse(this, rectangularEmitter);
        this.isFocus = true;
        this.isStroke = true;
        this.color = 'red';
        this.lineWidth = 1;
        this.borderRadious = 1;
        this.circleWidth = 3;

        this.event();
    }

    setPosition(rect: Rect, isDraw = false) {
        this.rect = rect;

        if (isDraw) {
            this.draw();
        }
    }

    event() {
        config.emitter.on('mousedown', e => {
            console.log(e);
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(e);
            }
        });
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
        this.ctx.fillStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        // 画圆角
        this.ctx.fillRect(
            this.rect.startX,
            this.rect.startY,
            this.rect.endX,
            this.rect.endY,
        );
        if (this.isStroke) {
            this.ctx.stroke();
        } else {
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
