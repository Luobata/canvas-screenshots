import { Position, dragCircle, Rect } from 'LIB/interface';
import { config, inBox } from '../config';
import { getArrowCircleMap } from 'LIB/help';
import Mouse from './mouse-arrow';
import { pointInArea } from 'LIB/geometric';
import Content from './content';

const circlePath = 10; // 手势范围 认为这个范围内就是可以使用新手势

interface arrow {
    rect?: Rect;
    circles: Array<dragCircle>;
    lines: Array<Position>;
    color: string;
    circleWidth: number;
}

export default class extends Content {
    mouse: Mouse;
    property: arrow;

    constructor(ctx: CanvasRenderingContext2D, color: string) {
        super(ctx);
        this.property = {
            color,
            lines: [],
            circles: [],
            circleWidth: 3,
        };
        this.mouse = new Mouse(this);
        this.init();
        this.event();
    }

    init() {
        this.property.rect = {
            startX: undefined,
            startY: undefined,
            endX: undefined,
            endY: undefined,
        };
    }

    hasBox() {
        return !!(
            this.property.rect.startX !== undefined &&
            this.property.rect.startY !== undefined &&
            this.property.rect.endX !== undefined &&
            this.property.rect.endY !== undefined
        );
    }

    event() {
        this.mouseDown = (e: MouseEvent) => {
            if (this.isFocus && this.hasBox() && inBox(e)) {
                this.mouse.mouseDown(e, this.getCursor(e, 'eve'));
            }
        };
        this.mouseMove = (e: MouseEvent) => {
            if (this.isFocus) {
                this.mouse.mouseMove(e);
            }
        };
        this.mouseUp = (e: MouseEvent) => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseUp(e);
            }
        };

        config.emitter.on('mousedown', this.mouseDown);
        config.emitter.on('mousemove', this.mouseMove);
        config.emitter.on('mouseup', this.mouseUp);
    }

    inBoxBorder(x: number, y: number) {
        return pointInArea(this.property.lines, { x, y });
    }

    draw() {
        const circleMap = getArrowCircleMap(this.property.rect);
        this.property.circles = circleMap;

        const lineWid = Math.sqrt(
            Math.pow(this.property.rect.endX - this.property.rect.startX, 2) +
                Math.pow(
                    this.property.rect.endY - this.property.rect.startY,
                    2,
                ),
        );
        const propertyWid = lineWid * 0.2; // 箭头位置总长度的十分之一
        const propertyInWid = propertyWid * 0.7;
        let rec = Math.atan(
            Math.abs(this.property.rect.endY - this.property.rect.startY) /
                Math.abs(this.property.rect.endX - this.property.rect.startX),
        );
        let margin = Math.PI / 4;
        const min = margin - rec;
        let minuX: number = 1;
        let minuY: number = 1;

        if (this.property.rect.endX > this.property.rect.startX) {
            minuX = 1;
        } else {
            minuX = -1;
        }
        if (this.property.rect.endY > this.property.rect.startY) {
            minuY = 1;
        } else {
            minuY = -1;
        }

        const P1 = {
            x:
                this.property.rect.endX -
                propertyWid * Math.cos(margin - rec) * minuX,
            y:
                this.property.rect.endY +
                propertyWid * Math.sin(margin - rec) * minuY,
        };
        const P2 = {
            x:
                this.property.rect.endX -
                propertyWid * Math.cos(margin + rec) * minuX,
            y:
                this.property.rect.endY -
                propertyWid * Math.sin(margin + rec) * minuY,
        };
        const P3 = {
            x:
                this.property.rect.endX -
                propertyInWid * Math.cos(margin - rec - margin / 2) * minuX,
            y:
                this.property.rect.endY +
                propertyInWid * Math.sin(margin - rec - margin / 2) * minuY,
        };
        const P4 = {
            x:
                this.property.rect.endX -
                propertyInWid * Math.cos(margin + rec - margin / 2) * minuX,
            y:
                this.property.rect.endY -
                propertyInWid * Math.sin(margin + rec - margin / 2) * minuY,
        };
        this.property.lines = [
            {
                x: this.property.rect.startX - circlePath * minuX,
                y: this.property.rect.startY - circlePath * minuY,
            },
            // P3,
            P1,
            {
                x: this.property.rect.endX + circlePath * minuX,
                y: this.property.rect.endY + circlePath * minuY,
            },
            P2,
            // P4,
        ];
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.property.color;
        this.ctx.moveTo(this.property.rect.startX, this.property.rect.startY);
        this.ctx.lineTo(P3.x, P3.y);
        this.ctx.lineTo(P1.x, P1.y);
        this.ctx.lineTo(this.property.rect.endX, this.property.rect.endY);
        this.ctx.lineTo(P2.x, P2.y);
        this.ctx.lineTo(P4.x, P4.y);
        this.ctx.fill();

        if (this.isFocus) {
            for (let i of circleMap) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.property.color;
                this.ctx.arc(
                    i.x,
                    i.y,
                    this.property.circleWidth,
                    0,
                    Math.PI * 2,
                    true,
                );
                this.ctx.stroke();
                this.ctx.fillStyle = 'white';
                this.ctx.fill();
            }
        }

        this.ctx.restore();
    }
}
