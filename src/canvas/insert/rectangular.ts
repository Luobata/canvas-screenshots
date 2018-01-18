import { dragCircle, Rect } from 'LIB/interface';
import { getCircleMap } from 'LIB/help';
import { EventEmitter } from 'events';
import { config } from '../config';
import Mouse from './mouse';
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

export default class {
    id: number;
    ctx: CanvasRenderingContext2D;
    circles: Array<dragCircle>;
    rect?: Rect;
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
        this.drawAll();
    }

    setPosition(rect: Rect, isDraw = false) {
        Object.assign(this.rect, rect);

        if (isDraw) {
            //this.draw();
            config.emitter.emit('draw-all');
        }
    }

    getCursor(e: MouseEvent, type?: string) {
        let result = 'crosshair'; // 判断鼠标位置结果 默认即corsshair
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

    event() {
        const that = this;
        config.emitter.on('mousedown', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(e, this.getCursor(e, 'eve'));
            }
        });
        config.emitter.on('mousemove', e => {
            if (this.hasBox()) {
                config.emitter.emit('cursor-change', this.getCursor(e));
            }
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

    inBoxBorder(positionX: number, positionY: number): boolean {
        const centerX =
            this.rect.startX + (this.rect.endX - this.rect.startX) / 2;
        const centerY =
            this.rect.startY + (this.rect.endY - this.rect.startY) / 2;
        const inLength = Math.abs((this.rect.endY - this.rect.startY) / 2);
        const outLength = inLength + this.lineWidth;
        // const inX = () => {
        //     const angle =Math.acos(
        //         Math.abs(positinX - centerX) /
        //         Math.sqrt(
        //             Math.pow(positinX - centerX, 2) +
        //                 Math.pow(positinY - centerY, 2),
        //         ));
        //     // const minL = Math.sin()
        // };
        // margin 扩大可点击区域
        const margin = 5;
        const borderWidth = this.lineWidth + margin * 2;
        const sX =
            this.rect.startX < this.rect.endX
                ? this.rect.startX
                : this.rect.endX + margin;
        const bX =
            this.rect.startX >= this.rect.endX
                ? this.rect.startX
                : this.rect.endX - margin;
        const sY =
            this.rect.startY < this.rect.endY
                ? this.rect.startY
                : this.rect.endY + margin;
        const bY =
            this.rect.startY >= this.rect.endY
                ? this.rect.startY
                : this.rect.endY - margin;
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
            if (this.rect.startX < this.rect.endX) {
                return (
                    positionX + circlePath >= this.rect.startX &&
                    positionX - circlePath <= this.rect.endX
                );
            } else {
                return (
                    positionX + circlePath <= this.rect.startX &&
                    positionX - circlePath >= this.rect.endX
                );
            }
        };
        const inY = (): boolean => {
            if (this.rect.startY < this.rect.endY) {
                return (
                    positionY + circlePath >= this.rect.startY &&
                    positionY - circlePath <= this.rect.endY
                );
            } else {
                return (
                    positionY + circlePath <= this.rect.startY &&
                    positionY - circlePath >= this.rect.endY
                );
            }
        };
        return inX() && inY();
        // return !!(
        //     positionX + circlePath >= this.rect.startX &&
        //     positionX - circlePath <= this.rect.endX &&
        //     positionY + circlePath >= this.rect.startY &&
        //     positionY - circlePath <= this.rect.endY
        // );
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
    drawAll() {
        config.emitter.on('draw-all', () => {
            this.draw();
        });
    }
}
