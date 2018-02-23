import { dragCircle, Rect } from 'LIB/interface';
import { getCircleMap } from 'LIB/help';
import { EventEmitter } from 'events';
import { config } from '../config';
import Mouse from './mouse-rectangular';
const ee = require('event-emitter');
const rectangularEmitter = new ee();

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

interface rectangular {
    rect?: Rect;
    circles?: Array<dragCircle>;
    isStroke: boolean; // 是否是是空心的
    color: string;
    lineWidth: number;
    borderRadious: number;
    circleWidth: number;
}

export default class {
    id: number;
    ctx: CanvasRenderingContext2D;
    mouse: Mouse;
    isFocus: boolean; // 是否聚焦 聚焦才会展示可拖动点

    rectangular: rectangular;
    saveArray: Array<rectangular>;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.mouse = new Mouse(this, rectangularEmitter);
        this.id = config.uid++;

        this.isFocus = true;
        this.rectangular = {
            isStroke: true,
            color: (<any>window).color || 'red',
            lineWidth: 3,
            borderRadious: 1,
            circleWidth: 3,
        };
        this.saveArray = [];

        this.initBox();

        this.event();
    }

    save() {
        this.saveArray.push(this.rectangular);
        console.log(this.saveArray);
    }

    back() {
        this.rectangular = this.saveArray.pop();
    }

    setPosition(rect: Rect, isDraw = false) {
        Object.assign(this.rectangular.rect, rect);

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    getCursor(e: MouseEvent, type?: string) {
        let result = 'crosshair'; // 判断鼠标位置结果 默认即crosshair
        for (let i of this.rectangular.circles) {
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

    initBox() {
        this.rectangular.rect = {
            startX: undefined,
            startY: undefined,
            endX: undefined,
            endY: undefined,
        };
    }

    hasBox() {
        return !!(
            this.rectangular.rect.startX !== undefined &&
            this.rectangular.rect.startY !== undefined &&
            this.rectangular.rect.endX !== undefined &&
            this.rectangular.rect.endY !== undefined
        );
    }

    inBoxBorder(positionX: number, positionY: number): boolean {
        const centerX =
            this.rectangular.rect.startX +
            (this.rectangular.rect.endX - this.rectangular.rect.startX) / 2;
        const centerY =
            this.rectangular.rect.startY +
            (this.rectangular.rect.endY - this.rectangular.rect.startY) / 2;
        const inLength = Math.abs(
            (this.rectangular.rect.endY - this.rectangular.rect.startY) / 2,
        );
        const outLength = inLength + this.rectangular.lineWidth;
        const margin = 5;
        const borderWidth = this.rectangular.lineWidth + margin * 2;
        const sX =
            this.rectangular.rect.startX < this.rectangular.rect.endX
                ? this.rectangular.rect.startX
                : this.rectangular.rect.endX + margin;
        const bX =
            this.rectangular.rect.startX >= this.rectangular.rect.endX
                ? this.rectangular.rect.startX
                : this.rectangular.rect.endX - margin;
        const sY =
            this.rectangular.rect.startY < this.rectangular.rect.endY
                ? this.rectangular.rect.startY
                : this.rectangular.rect.endY + margin;
        const bY =
            this.rectangular.rect.startY >= this.rectangular.rect.endY
                ? this.rectangular.rect.startY
                : this.rectangular.rect.endY - margin;
        const inRow = (): boolean => {
            return (
                positionX >= sX - borderWidth &&
                positionX <= bX + borderWidth &&
                ((positionY >= sY - borderWidth && positionY <= sY) ||
                    (positionY >= bY && positionY <= bY + borderWidth))
            );
        };

        const inColumn = (): boolean => {
            return (
                positionY >= sY &&
                positionY <= bY &&
                ((positionX >= sX - borderWidth && positionX <= sX) ||
                    (positionX >= bX && positionX <= bX + borderWidth))
            );
        };

        return inRow() || inColumn();
    }

    inBox(positionX: number, positionY: number, circlePath = 0): boolean {
        const inX = (): boolean => {
            if (this.rectangular.rect.startX < this.rectangular.rect.endX) {
                return (
                    positionX + circlePath >= this.rectangular.rect.startX &&
                    positionX - circlePath <= this.rectangular.rect.endX
                );
            } else {
                return (
                    positionX + circlePath <= this.rectangular.rect.startX &&
                    positionX - circlePath >= this.rectangular.rect.endX
                );
            }
        };
        const inY = (): boolean => {
            if (this.rectangular.rect.startY < this.rectangular.rect.endY) {
                return (
                    positionY + circlePath >= this.rectangular.rect.startY &&
                    positionY - circlePath <= this.rectangular.rect.endY
                );
            } else {
                return (
                    positionY + circlePath <= this.rectangular.rect.startY &&
                    positionY - circlePath >= this.rectangular.rect.endY
                );
            }
        };
        return inX() && inY();
    }

    draw() {
        const circleMap = getCircleMap(
            this.rectangular.rect,
            this.rectangular.lineWidth,
        );
        this.rectangular.circles = circleMap;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.rectangular.lineWidth;
        // 画圆角
        this.ctx.moveTo(
            this.rectangular.rect.startX - this.rectangular.lineWidth,
            this.rectangular.rect.startY - this.rectangular.lineWidth,
        );
        this.ctx.lineTo(
            this.rectangular.rect.endX + this.rectangular.lineWidth,
            this.rectangular.rect.startY - this.rectangular.lineWidth,
        );
        this.ctx.lineTo(
            this.rectangular.rect.endX + this.rectangular.lineWidth,
            this.rectangular.rect.endY + this.rectangular.lineWidth,
        );
        this.ctx.lineTo(
            this.rectangular.rect.startX - this.rectangular.lineWidth,
            this.rectangular.rect.endY + this.rectangular.lineWidth,
        );
        this.ctx.lineTo(
            this.rectangular.rect.startX - this.rectangular.lineWidth,
            this.rectangular.rect.startY - this.rectangular.lineWidth,
        );
        if (this.rectangular.isStroke) {
            this.ctx.strokeStyle = this.rectangular.color;
            this.ctx.stroke();
        } else {
            this.ctx.fillStyle = this.rectangular.color;
            this.ctx.fill();
        }
        if (this.isFocus) {
            for (let i of circleMap) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.rectangular.color;
                this.ctx.arc(
                    i.x,
                    i.y,
                    this.rectangular.circleWidth,
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
