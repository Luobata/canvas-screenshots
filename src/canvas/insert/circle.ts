import { dragCircle, Circle, Rect } from 'LIB/interface';
import { config } from '../config';
import { getCircleMap } from 'LIB/help';
import Mouse from './mouse-circle';
import { pointInRectangular } from 'LIB/geometric';
const ee = require('event-emitter');
const circleEmitter = new ee();

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
    // circle: Circle;
    rect: Rect;
    circles: Array<dragCircle>;
    ctx: CanvasRenderingContext2D;
    isFocus: boolean;
    color: string;
    borderColor: string;
    auxLineColor: string;
    borderWidth: number;
    circleWidth: number;
    mouse: Mouse;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.isFocus = true;
        this.borderColor = 'black';
        this.borderWidth = 1;
        this.color = (<any>window).color || 'red';
        this.auxLineColor = 'gray';
        this.circleWidth = 3;
        this.id = config.uid++;
        this.mouse = new Mouse(this);

        this.initCircle();
        this.event();
        this.drawAll();
    }

    initCircle() {
        this.rect = {
            startX: undefined,
            startY: undefined,
            endX: undefined,
            endY: undefined,
        };
    }

    setPosition(rect: Rect, isDraw = false) {
        Object.assign(this.rect, rect);

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    getCursor(e: MouseEvent, type?: string) {
        let result = 'crosshair'; // 判断鼠标位置结果 默认即crosshair
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

    inBoxBorder(positionX: number, positionY: number) {
        const inCircle = () => {
            const margin = 0.1;
            let a;
            let b;
            const radiusX = Math.abs(this.rect.endX - this.rect.startX) / 2;
            const radiusY = Math.abs(this.rect.endY - this.rect.startY) / 2;
            const centerX = (this.rect.startX + this.rect.endX) / 2;
            const centerY = (this.rect.startY + this.rect.endY) / 2;
            if (radiusX > radiusY) {
                a = radiusX;
                b = radiusY;
            } else {
                a = radiusY;
                b = radiusX;
            }
            const res =
                Math.pow(positionX - centerX, 2) / Math.pow(a, 2) +
                Math.pow(positionY - centerY, 2) / Math.pow(b, 2);
            return Math.abs(res - 1) < margin;
        };

        const inBorder = () => {
            const margin = 3;
            const radiusX = Math.abs(this.rect.endX - this.rect.startX) / 2;
            const radiusY = Math.abs(this.rect.endY - this.rect.startY) / 2;
            const centerX = (this.rect.startX + this.rect.endX) / 2;
            const centerY = (this.rect.startY + this.rect.endY) / 2;
            const p1 = {
                x: centerX - radiusX + margin,
                y: centerY - radiusY + margin,
            };
            const p2 = {
                x: centerX + radiusX - margin,
                y: centerY - radiusY + margin,
            };
            const p3 = {
                x: centerX - radiusX + margin,
                y: centerY + radiusY - margin,
            };
            const p4 = {
                x: centerX + radiusX - margin,
                y: centerY + radiusY - margin,
            };
            const P1 = {
                x: centerX - radiusX - this.borderWidth - margin,
                y: centerY - radiusY - this.borderWidth - margin,
            };
            const P2 = {
                x: centerX + radiusX + this.borderWidth + margin,
                y: centerY - radiusY - this.borderWidth - margin,
            };
            const P3 = {
                x: centerX - radiusX - this.borderWidth - margin,
                y: centerY + radiusY + this.borderWidth + margin,
            };
            const P4 = {
                x: centerX + radiusX + this.borderWidth + margin,
                y: centerY + radiusY + this.borderWidth + margin,
            };
            const p = {
                x: positionX,
                y: positionY,
            };
            return (
                !pointInRectangular(p1, p2, p3, p4, p) &&
                pointInRectangular(P1, P2, P3, P4, p)
            );
        };

        return inCircle() || inBorder();
    }

    inCircle() {}
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

    draw() {
        const circleMap = getCircleMap(this.rect, this.borderWidth);
        this.circles = circleMap;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.borderColor;
        this.ctx.lineWidth = this.borderWidth;
        this.ctx.stroke();
        const ellipse = (circle: Circle) => {
            const r =
                circle.radiusX > circle.radiusY
                    ? circle.radiusX
                    : circle.radiusY;
            var ratioX = circle.radiusX / r;
            var ratioY = circle.radiusY / r;
            this.ctx.scale(ratioX, ratioY);
            this.ctx.beginPath();
            this.ctx.fillStyle = this.borderColor;
            this.ctx.lineWidth = this.borderWidth;
            this.ctx.arc(
                circle.centerX / ratioX,
                circle.centerY / ratioY,
                r,
                0,
                2 * Math.PI,
                false,
            );
            this.ctx.closePath();
            this.ctx.restore();
            this.ctx.stroke();
        };

        ellipse({
            centerX: (this.rect.startX + this.rect.endX) / 2,
            centerY: (this.rect.startY + this.rect.endY) / 2,
            radiusX: Math.abs(this.rect.startX - this.rect.endX) / 2,
            radiusY: Math.abs(this.rect.startY - this.rect.endY) / 2,
        });
        // 画椭圆
        if (this.isFocus) {
            const startX = this.rect.startX;
            const startY = this.rect.startY;
            const endX = this.rect.endX;
            const endY = this.rect.endY;

            this.ctx.moveTo(
                startX - this.borderWidth,
                startY - this.borderWidth,
            );
            this.ctx.lineTo(endX + this.borderWidth, startY - this.borderWidth);
            this.ctx.lineTo(endX + this.borderWidth, endY + this.borderWidth);
            this.ctx.lineTo(startX - this.borderWidth, endY + this.borderWidth);
            this.ctx.lineTo(
                startX - this.borderWidth,
                startY - this.borderWidth,
            );
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = this.auxLineColor;
            this.ctx.stroke();
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
        config.emitter.on('draw-all', () => {});
    }
}
