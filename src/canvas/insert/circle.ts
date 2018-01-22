import { dragCircle, Circle } from 'LIB/interface';
import { config } from '../config';
import { getCircleMapWithCircle } from 'LIB/help';
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
    circle: Circle;
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
        this.circle = {
            centerX: -1,
            centerY: -1,
            radiusX: -1,
            radiusY: -1,
        };
    }

    setPosition(circle: Circle, isDraw = false) {
        Object.assign(this.circle, circle);

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
            if (this.circle.radiusX > this.circle.radiusY) {
                a = this.circle.radiusX;
                b = this.circle.radiusY;
            } else {
                a = this.circle.radiusY;
                b = this.circle.radiusX;
            }
            const res =
                Math.pow(positionX - this.circle.centerX, 2) / Math.pow(a, 2) +
                Math.pow(positionY - this.circle.centerY, 2) / Math.pow(b, 2);
            return Math.abs(res - 1) < margin;
        };

        const inBorder = () => {
            const margin = 3;
            const p1 = {
                x: this.circle.centerX - this.circle.radiusX + margin,
                y: this.circle.centerY - this.circle.radiusY + margin,
            };
            const p2 = {
                x: this.circle.centerX + this.circle.radiusX - margin,
                y: this.circle.centerY - this.circle.radiusY + margin,
            };
            const p3 = {
                x: this.circle.centerX - this.circle.radiusX + margin,
                y: this.circle.centerY + this.circle.radiusY - margin,
            };
            const p4 = {
                x: this.circle.centerX + this.circle.radiusX - margin,
                y: this.circle.centerY + this.circle.radiusY - margin,
            };
            const P1 = {
                x:
                    this.circle.centerX -
                    this.circle.radiusX -
                    this.borderWidth -
                    margin,
                y:
                    this.circle.centerY -
                    this.circle.radiusY -
                    this.borderWidth -
                    margin,
            };
            const P2 = {
                x:
                    this.circle.centerX +
                    this.circle.radiusX +
                    this.borderWidth +
                    margin,
                y:
                    this.circle.centerY -
                    this.circle.radiusY -
                    this.borderWidth -
                    margin,
            };
            const P3 = {
                x:
                    this.circle.centerX -
                    this.circle.radiusX -
                    this.borderWidth -
                    margin,
                y:
                    this.circle.centerY +
                    this.circle.radiusY +
                    this.borderWidth +
                    margin,
            };
            const P4 = {
                x:
                    this.circle.centerX +
                    this.circle.radiusX +
                    this.borderWidth +
                    margin,
                y:
                    this.circle.centerY +
                    this.circle.radiusY +
                    this.borderWidth +
                    margin,
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
            this.circle.centerX !== undefined &&
            this.circle.centerY !== undefined &&
            this.circle.radiusX !== undefined &&
            this.circle.radiusY !== undefined
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
        const circleMap = getCircleMapWithCircle(this.circle, this.borderWidth);
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

        ellipse(this.circle);
        // 画椭圆
        if (this.isFocus) {
            const startX = this.circle.centerX - this.circle.radiusX;
            const startY = this.circle.centerY - this.circle.radiusY;
            const endX = this.circle.centerX + this.circle.radiusX;
            const endY = this.circle.centerY + this.circle.radiusY;

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
