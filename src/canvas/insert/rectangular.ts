import { dragCircle, Rect } from 'LIB/interface';
import { config, inBox } from '../config';
import { getCircleMap } from 'LIB/help';
import Content from './content';
import Mouse from './mouse-rectangular';

interface rectangular {
    rect?: Rect;
    circles?: Array<dragCircle>;
    isStroke: boolean; // 是否是是空心的
    color: string;
    lineWidth: number;
    borderRadious: number;
    circleWidth: number;
}

export default class extends Content {
    property: rectangular;
    mouse: Mouse;

    constructor(ctx: CanvasRenderingContext2D, color: string) {
        super(ctx);
        this.property = {
            isStroke: true,
            color,
            lineWidth: 3,
            borderRadious: 1,
            circleWidth: 3,
        };
        this.mouse = new Mouse(this);

        this.init();
        this.event();
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

    inBoxBorder(positionX: number, positionY: number): boolean {
        const centerX =
            this.property.rect.startX +
            (this.property.rect.endX - this.property.rect.startX) / 2;
        const centerY =
            this.property.rect.startY +
            (this.property.rect.endY - this.property.rect.startY) / 2;
        const inLength = Math.abs(
            (this.property.rect.endY - this.property.rect.startY) / 2,
        );
        const outLength = inLength + this.property.lineWidth;
        const margin = 5;
        const borderWidth = this.property.lineWidth + margin * 2;
        const sX =
            this.property.rect.startX < this.property.rect.endX
                ? this.property.rect.startX
                : this.property.rect.endX + margin;
        const bX =
            this.property.rect.startX >= this.property.rect.endX
                ? this.property.rect.startX
                : this.property.rect.endX - margin;
        const sY =
            this.property.rect.startY < this.property.rect.endY
                ? this.property.rect.startY
                : this.property.rect.endY + margin;
        const bY =
            this.property.rect.startY >= this.property.rect.endY
                ? this.property.rect.startY
                : this.property.rect.endY - margin;
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
            if (this.property.rect.startX < this.property.rect.endX) {
                return (
                    positionX + circlePath >= this.property.rect.startX &&
                    positionX - circlePath <= this.property.rect.endX
                );
            } else {
                return (
                    positionX + circlePath <= this.property.rect.startX &&
                    positionX - circlePath >= this.property.rect.endX
                );
            }
        };
        const inY = (): boolean => {
            if (this.property.rect.startY < this.property.rect.endY) {
                return (
                    positionY + circlePath >= this.property.rect.startY &&
                    positionY - circlePath <= this.property.rect.endY
                );
            } else {
                return (
                    positionY + circlePath <= this.property.rect.startY &&
                    positionY - circlePath >= this.property.rect.endY
                );
            }
        };
        return inX() && inY();
    }

    draw() {
        const circleMap = getCircleMap(
            this.property.rect,
            this.property.lineWidth,
        );
        this.property.circles = circleMap;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.property.lineWidth;
        this.ctx.strokeStyle = this.property.color;
        // 画圆角
        this.ctx.strokeRect(
            this.property.rect.startX - this.property.lineWidth,
            this.property.rect.startY - this.property.lineWidth,
            this.property.rect.endX -
                this.property.rect.startX +
                this.property.lineWidth * 2,
            this.property.rect.endY -
                this.property.rect.startY +
                this.property.lineWidth * 2,
        );
        if (this.property.isStroke) {
            this.ctx.strokeStyle = this.property.color;
            this.ctx.stroke();
        } else {
            this.ctx.fillStyle = this.property.color;
            this.ctx.fill();
        }
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
