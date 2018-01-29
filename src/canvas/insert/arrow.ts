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

export default class {
    rect: Rect;
    circles: Array<dragCircle>;
    lines: Array<Position>;
    ctx: CanvasRenderingContext2D;
    color: string;
    id: number;
    isFocus: boolean;
    mouse: Mouse;
    circleWidth: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.color = (<any>window).color || 'red';
        this.id = config.uid++;
        this.isFocus = true;
        this.lines = [];
        this.circleWidth = 3;
        this.mouse = new Mouse(this);
        this.init();
        this.event();
    }

    init() {
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
        return pointInArea(this.lines, { x, y });
    }

    getCursor(e: MouseEvent, type?: string) {
        let result = 'crosshair';
        for (let i of this.circles) {
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
        Object.assign(this.rect, rect);
        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    draw() {
        const circleMap = getArrowCircleMap(this.rect);
        this.circles = circleMap;

        const lineWid = Math.sqrt(
            Math.pow(this.rect.endX - this.rect.startX, 2) +
                Math.pow(this.rect.endY - this.rect.startY, 2),
        );
        const arrowWid = lineWid * 0.2; // 箭头位置总长度的十分之一
        const arrowInWid = arrowWid * 0.7;
        const rec = Math.atan(
            Math.abs(this.rect.endY - this.rect.startY) /
                Math.abs(this.rect.endX - this.rect.startX),
        );
        const P1 = {
            x: this.rect.endX - arrowWid * Math.cos(rec / 2 * 3),
            y: this.rect.endY - arrowWid * Math.sin(rec / 2 * 3),
        };
        const P2 = {
            x: this.rect.endX - arrowWid * Math.cos(rec / 2 * 1),
            y: this.rect.endY - arrowWid * Math.sin(rec / 2 * 1),
        };
        const P3 = {
            x: this.rect.endX - arrowInWid * Math.cos(rec / 2 * 3 - rec / 4),
            y: this.rect.endY - arrowInWid * Math.sin(rec / 2 * 3 - rec / 4),
        };
        const P4 = {
            x: this.rect.endX - arrowInWid * Math.cos(rec / 2 * 1 + rec / 4),
            y: this.rect.endY - arrowInWid * Math.sin(rec / 2 * 1 + rec / 4),
        };
        this.lines = [
            {
                x: this.rect.startX - circlePath,
                y: this.rect.startY - circlePath,
            },
            // P3,
            P1,
            {
                x: this.rect.endX + circlePath,
                y: this.rect.endY + circlePath,
            },
            P2,
            // P4,
        ];
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.moveTo(this.rect.startX, this.rect.startY);
        this.ctx.lineTo(P3.x, P3.y);
        this.ctx.lineTo(P1.x, P1.y);
        this.ctx.lineTo(this.rect.endX, this.rect.endY);
        this.ctx.lineTo(P2.x, P2.y);
        this.ctx.lineTo(P4.x, P4.y);
        this.ctx.fill();

        if (this.isFocus) {
            for (let i of circleMap) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.arc(i.x, i.y, this.circleWidth, 0, Math.PI * 2, true);
                this.ctx.stroke();
                this.ctx.fillStyle = 'white';
                this.ctx.fill();
            }
        }

        this.ctx.restore();
    }
}
