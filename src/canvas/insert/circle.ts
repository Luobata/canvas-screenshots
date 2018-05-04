/**
 * @description circle
 */
import { config, inBox } from 'Canvas/config';
import Content from 'INSERT/content';
import Mouse from 'INSERT/mouse-circle';
import { pointInRectangular } from 'LIB/geometric';
import { getCircleMap, IcircleMap } from 'LIB/help';
import { Circle, DragCircle, Position, Rect } from 'LIB/interface';

interface Icircle {
    rect?: Rect;
    circles?: DragCircle[];
    color: string;
    borderColor: string;
    auxLineColor: string;
    borderWidth: number;
    circleWidth: number;
}

/**
 * default class
 */
export default class SCircle extends Content {
    public property: Icircle;
    private mouse: Mouse;

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

    public setColor(color: string): void {
        this.property.borderColor = color;
        super.setColor(color);
    }

    public inBoxBorder(positionX: number, positionY: number): boolean {
        const inCircle: Function = (): boolean => {
            const margin: number = 0.1;
            let a: number;
            let b: number;
            const radiusX: number =
                Math.abs(this.property.rect.endX - this.property.rect.startX) /
                2;
            const radiusY: number =
                Math.abs(this.property.rect.endY - this.property.rect.startY) /
                2;
            const centerX: number =
                (this.property.rect.startX + this.property.rect.endX) / 2;
            const centerY: number =
                (this.property.rect.startY + this.property.rect.endY) / 2;
            if (radiusX > radiusY) {
                a = radiusX;
                b = radiusY;
            } else {
                a = radiusY;
                b = radiusX;
            }
            const res: number =
                Math.pow(positionX - centerX, 2) / Math.pow(a, 2) +
                Math.pow(positionY - centerY, 2) / Math.pow(b, 2);

            return Math.abs(res - 1) < margin;
        };

        const inBorder: Function = (): boolean => {
            const margin: number = 3;
            const radiusX: number =
                Math.abs(this.property.rect.endX - this.property.rect.startX) /
                2;
            const radiusY: number =
                Math.abs(this.property.rect.endY - this.property.rect.startY) /
                2;
            const centerX: number =
                (this.property.rect.startX + this.property.rect.endX) / 2;
            const centerY: number =
                (this.property.rect.startY + this.property.rect.endY) / 2;
            const p1: Position = {
                x: centerX - radiusX + margin,
                y: centerY - radiusY + margin,
            };
            const p2: Position = {
                x: centerX + radiusX - margin,
                y: centerY - radiusY + margin,
            };
            const p3: Position = {
                x: centerX - radiusX + margin,
                y: centerY + radiusY - margin,
            };
            const p4: Position = {
                x: centerX + radiusX - margin,
                y: centerY + radiusY - margin,
            };
            const P1: Position = {
                x: centerX - radiusX - this.property.borderWidth - margin,
                y: centerY - radiusY - this.property.borderWidth - margin,
            };
            const P2: Position = {
                x: centerX + radiusX + this.property.borderWidth + margin,
                y: centerY - radiusY - this.property.borderWidth - margin,
            };
            const P3: Position = {
                x: centerX - radiusX - this.property.borderWidth - margin,
                y: centerY + radiusY + this.property.borderWidth + margin,
            };
            const P4: Position = {
                x: centerX + radiusX + this.property.borderWidth + margin,
                y: centerY + radiusY + this.property.borderWidth + margin,
            };
            const p: Position = {
                x: positionX,
                y: positionY,
            };

            return !!(
                !pointInRectangular(p1, p2, p3, p4, p) &&
                pointInRectangular(P1, P2, P3, P4, p)
            );
        };

        return !!(inCircle() || inBorder());
    }

    public event(): void {
        this.mouseDown = (e: MouseEvent): void => {
            if (this.isFocus && this.hasBox() && inBox(e)) {
                this.mouse.mouseDown(e, this.getCursor(e, 'eve'));
            }
        };
        this.mouseMove = (e: MouseEvent): void => {
            if (this.isFocus) {
                this.mouse.mouseMove(e);
            }
        };
        this.mouseUp = (e: MouseEvent): void => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseUp(e);
            }
        };

        config.emitter.on('mousedown', this.mouseDown);
        config.emitter.on('mousemove', this.mouseMove);
        config.emitter.on('mouseup', this.mouseUp);
    }

    public draw(): void {
        const minuX: number = -1;
        const minuY: number = -1;
        const propertyMap: IcircleMap[] = <IcircleMap[]>getCircleMap(
            this.property.rect,
            this.property.borderWidth,
        );
        this.property.circles = propertyMap;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.property.color;
        this.ctx.lineWidth = this.property.borderWidth * config.rate;
        const ellipse: Function = (property: Circle): void => {
            const r: number =
                property.radiusX > property.radiusY
                    ? property.radiusX
                    : property.radiusY;
            const ratioX: number = property.radiusX / r;
            const ratioY: number = property.radiusY / r;
            this.ctx.save();
            this.ctx.strokeStyle = this.property.borderColor;
            this.ctx.lineWidth = this.property.borderWidth * config.rate;
            this.ctx.beginPath();
            this.ctx.scale(ratioX, ratioY);
            this.ctx.arc(
                property.centerX / ratioX,
                property.centerY / ratioY,
                r,
                0,
                Math.PI * 2,
                false,
            );
            this.ctx.stroke();
            this.ctx.restore();
        };

        // 画椭圆
        if (this.isFocus) {
            const startX: number = this.property.rect.startX;
            const startY: number = this.property.rect.startY;
            const endX: number = this.property.rect.endX;
            const endY: number = this.property.rect.endY;

            this.ctx.lineWidth = this.property.borderWidth * config.rate;
            this.ctx.strokeStyle = this.property.auxLineColor;
            this.ctx.strokeRect(
                (startX - this.property.borderWidth) * config.rate,
                (startY - this.property.borderWidth) * config.rate,
                (endX - startX + this.property.borderWidth * 2) * config.rate,
                (endY - startY + this.property.borderWidth * 2) * config.rate,
            );
            this.ctx.stroke();
            this.ctx.restore();
        }
        ellipse({
            centerX:
                (this.property.rect.startX + this.property.rect.endX) /
                2 *
                config.rate,
            centerY:
                (this.property.rect.startY + this.property.rect.endY) /
                2 *
                config.rate,
            radiusX:
                Math.abs(
                    this.property.rect.startX -
                        this.property.rect.endX +
                        this.property.borderWidth * 2 * minuX,
                ) /
                2 *
                config.rate,
            radiusY:
                Math.abs(
                    this.property.rect.startY -
                        this.property.rect.endY +
                        this.property.borderWidth * 2 * minuY,
                ) /
                2 *
                config.rate,
        });

        if (this.isFocus) {
            this.ctx.save();
            for (const i of propertyMap) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.property.color;
                this.ctx.arc(
                    i.x * config.rate,
                    i.y * config.rate,
                    this.property.circleWidth * config.rate,
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
