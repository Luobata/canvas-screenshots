import { dragCircle, Circle, Rect } from 'LIB/interface';
import { config, inBox } from '../config';
import { getCircleMap } from 'LIB/help';
import Mouse from './mouse-circle';
import { pointInRectangular } from 'LIB/geometric';
import Content from './content';

interface circle {
    rect?: Rect;
    circles?: Array<dragCircle>;
    color: string;
    borderColor: string;
    auxLineColor: string;
    borderWidth: number;
    circleWidth: number;
}

export default class extends Content {
    mouse: Mouse;
    property: circle;

    constructor(ctx: CanvasRenderingContext2D, color: string) {
        super(ctx);
        this.property = {
            borderColor: color,
            borderWidth: 3,
            color,
            auxLineColor: 'gray',
            circleWidth: 3,
        };
        this.mouse = new Mouse(this);

        this.init();
        this.event();
    }

    setColor(color: string) {
        this.property.borderColor = color;
        super.setColor(color);
    }

    inBoxBorder(positionX: number, positionY: number) {
        const inCircle = () => {
            const margin = 0.1;
            let a;
            let b;
            const radiusX =
                Math.abs(this.property.rect.endX - this.property.rect.startX) /
                2;
            const radiusY =
                Math.abs(this.property.rect.endY - this.property.rect.startY) /
                2;
            const centerX =
                (this.property.rect.startX + this.property.rect.endX) / 2;
            const centerY =
                (this.property.rect.startY + this.property.rect.endY) / 2;
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
            const radiusX =
                Math.abs(this.property.rect.endX - this.property.rect.startX) /
                2;
            const radiusY =
                Math.abs(this.property.rect.endY - this.property.rect.startY) /
                2;
            const centerX =
                (this.property.rect.startX + this.property.rect.endX) / 2;
            const centerY =
                (this.property.rect.startY + this.property.rect.endY) / 2;
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
                x: centerX - radiusX - this.property.borderWidth - margin,
                y: centerY - radiusY - this.property.borderWidth - margin,
            };
            const P2 = {
                x: centerX + radiusX + this.property.borderWidth + margin,
                y: centerY - radiusY - this.property.borderWidth - margin,
            };
            const P3 = {
                x: centerX - radiusX - this.property.borderWidth - margin,
                y: centerY + radiusY + this.property.borderWidth + margin,
            };
            const P4 = {
                x: centerX + radiusX + this.property.borderWidth + margin,
                y: centerY + radiusY + this.property.borderWidth + margin,
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

    draw() {
        const propertyMap = getCircleMap(
            this.property.rect,
            this.property.borderWidth,
        );
        this.property.circles = propertyMap;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.property.color;
        this.ctx.lineWidth = this.property.borderWidth;
        const ellipse = (property: Circle) => {
            const r =
                property.radiusX > property.radiusY
                    ? property.radiusX
                    : property.radiusY;
            var ratioX = property.radiusX / r;
            var ratioY = property.radiusY / r;
            this.ctx.save();
            this.ctx.strokeStyle = this.property.borderColor;
            this.ctx.lineWidth = this.property.borderWidth;
            this.ctx.beginPath();
            this.ctx.scale(ratioX, ratioY);
            this.ctx.arc(
                property.centerX / ratioX,
                property.centerY / ratioY,
                r,
                0,
                2 * Math.PI,
                false,
            );
            this.ctx.stroke();
            this.ctx.restore();
        };

        // 画椭圆
        if (this.isFocus) {
            const startX = this.property.rect.startX;
            const startY = this.property.rect.startY;
            const endX = this.property.rect.endX;
            const endY = this.property.rect.endY;

            this.ctx.lineWidth = this.property.borderWidth;
            this.ctx.strokeStyle = this.property.auxLineColor;
            this.ctx.strokeRect(
                startX - this.property.borderWidth,
                startY - this.property.borderWidth,
                endX - startX + this.property.borderWidth * 2,
                endY - startY + this.property.borderWidth * 2,
            );
            this.ctx.stroke();
            this.ctx.restore();
        }
        ellipse({
            centerX: (this.property.rect.startX + this.property.rect.endX) / 2,
            centerY: (this.property.rect.startY + this.property.rect.endY) / 2,
            radiusX:
                Math.abs(this.property.rect.startX - this.property.rect.endX) /
                2,
            radiusY:
                Math.abs(this.property.rect.startY - this.property.rect.endY) /
                2,
        });

        if (this.isFocus) {
            this.ctx.save();
            for (let i of propertyMap) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.property.color;
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
            this.ctx.restore();
        }
    }
}
