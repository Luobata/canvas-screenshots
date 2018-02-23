import { Position, dragCircle, Rect } from 'LIB/interface';
import { config } from '../config';
import { getArrowCircleMap } from 'LIB/help';
import Mouse from './mouse-arrow';
import { pointInArea } from 'LIB/geometric';

const circlePath = 10; // 手势范围 认为这个范围内就是可以使用新手势
const inCircle = (
    x: number,
    y: number,
    positionX: number,
    positinY: number,
): boolean => {
    return !!(
        Math.pow(x - positionX, 2) + Math.pow(y - positinY, 2) <=
        Math.pow(circlePath, 2)
    );
};
interface arrow {
    rect?: Rect;
    circles: Array<dragCircle>;
    lines: Array<Position>;
    color: string;
    circleWidth: number;
}

export default class {
    id: number;
    ctx: CanvasRenderingContext2D;
    isFocus: boolean;
    mouse: Mouse;

    arrow: arrow;
    saveArray: Array<arrow>;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.id = config.uid++;
        this.isFocus = true;
        this.arrow = {
            color: (<any>window).color || 'red',
            lines: [],
            circles: [],
            circleWidth: 3,
        };
        this.mouse = new Mouse(this);
        this.init();
        this.event();
    }

    save() {}

    init() {
        this.arrow.rect = {
            startX: undefined,
            startY: undefined,
            endX: undefined,
            endY: undefined,
        };
    }

    hasBox() {
        return !!(
            this.arrow.rect.startX !== undefined &&
            this.arrow.rect.startY !== undefined &&
            this.arrow.rect.endX !== undefined &&
            this.arrow.rect.endY !== undefined
        );
    }

    event() {
        config.emitter.on('mousedown', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(e, this.getCursor(e, 'eve'));
            }
        });
        config.emitter.on('mousemove', e => {
            if (this.isFocus) {
                this.mouse.mouseMove(e);
            }
        });
        config.emitter.on('mouseup', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseUp(e);
            }
        });
    }

    inBoxBorder(x: number, y: number) {
        return pointInArea(this.arrow.lines, { x, y });
    }

    getCursor(e: MouseEvent, type?: string) {
        let result = 'crosshair';
        for (let i of this.arrow.circles) {
            if (inCircle(i.x, i.y, e.clientX, e.clientY)) {
                // 在这个范围内 对应的手势图标
                //result = `${i.cssPosition}-resize`;
                if (type === 'eve') {
                    result = `${i.cssPositionEve}-resize`;
                } else {
                    result = `${i.cssPosition}-resize`;
                }
            }
        }
        if (result === 'crosshair') {
            // 如果还是十字 如果在边上 则可以拖动
            if (this.inBoxBorder(e.clientX, e.clientY)) {
                result = 'all-scroll';
            }
        }

        return result;
    }

    setPosition(rect: Rect, isDraw = false) {
        Object.assign(this.arrow.rect, rect);
        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    draw() {
        const circleMap = getArrowCircleMap(this.arrow.rect);
        this.arrow.circles = circleMap;

        const lineWid = Math.sqrt(
            Math.pow(this.arrow.rect.endX - this.arrow.rect.startX, 2) +
                Math.pow(this.arrow.rect.endY - this.arrow.rect.startY, 2),
        );
        const arrowWid = lineWid * 0.2; // 箭头位置总长度的十分之一
        const arrowInWid = arrowWid * 0.7;
        let rec = Math.atan(
            Math.abs(this.arrow.rect.endY - this.arrow.rect.startY) /
                Math.abs(this.arrow.rect.endX - this.arrow.rect.startX),
        );
        let margin = Math.PI / 4;
        const min = margin - rec;
        let minuX: number = 1;
        let minuY: number = 1;

        if (this.arrow.rect.endX > this.arrow.rect.startX) {
            minuX = 1;
        } else {
            minuX = -1;
        }
        if (this.arrow.rect.endY > this.arrow.rect.startY) {
            minuY = 1;
        } else {
            minuY = -1;
        }

        const P1 = {
            x: this.arrow.rect.endX - arrowWid * Math.cos(margin - rec) * minuX,
            y: this.arrow.rect.endY + arrowWid * Math.sin(margin - rec) * minuY,
        };
        const P2 = {
            x: this.arrow.rect.endX - arrowWid * Math.cos(margin + rec) * minuX,
            y: this.arrow.rect.endY - arrowWid * Math.sin(margin + rec) * minuY,
        };
        const P3 = {
            x:
                this.arrow.rect.endX -
                arrowInWid * Math.cos(margin - rec - margin / 2) * minuX,
            y:
                this.arrow.rect.endY +
                arrowInWid * Math.sin(margin - rec - margin / 2) * minuY,
        };
        const P4 = {
            x:
                this.arrow.rect.endX -
                arrowInWid * Math.cos(margin + rec - margin / 2) * minuX,
            y:
                this.arrow.rect.endY -
                arrowInWid * Math.sin(margin + rec - margin / 2) * minuY,
        };
        this.arrow.lines = [
            {
                x: this.arrow.rect.startX - circlePath * minuX,
                y: this.arrow.rect.startY - circlePath * minuY,
            },
            // P3,
            P1,
            {
                x: this.arrow.rect.endX + circlePath * minuX,
                y: this.arrow.rect.endY + circlePath * minuY,
            },
            P2,
            // P4,
        ];
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.arrow.color;
        this.ctx.moveTo(this.arrow.rect.startX, this.arrow.rect.startY);
        this.ctx.lineTo(P3.x, P3.y);
        this.ctx.lineTo(P1.x, P1.y);
        this.ctx.lineTo(this.arrow.rect.endX, this.arrow.rect.endY);
        this.ctx.lineTo(P2.x, P2.y);
        this.ctx.lineTo(P4.x, P4.y);
        this.ctx.fill();

        if (this.isFocus) {
            for (let i of circleMap) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.arrow.color;
                this.ctx.arc(
                    i.x,
                    i.y,
                    this.arrow.circleWidth,
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
