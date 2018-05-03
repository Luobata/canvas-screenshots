/**
 * @description arrow
 */
import { config, inBox } from 'Canvas/config';
import Content from 'INSERT/content';
import Mouse from 'INSERT/mouse-arrow';
import { pointInArea } from 'LIB/geometric';
import { getArrowCircleMap, IcircleMap } from 'LIB/help';
import { DragCircle, Position, Rect } from 'LIB/interface';

const circlePath: number = 10; // 手势范围 认为这个范围内就是可以使用新手势

interface arrow {
    rect?: Rect;
    circles: DragCircle[];
    lines: Position[];
    color: string;
    circleWidth: number;
}

/**
 * default class
 */
export default class SArrow extends Content {
    public property: arrow;
    private mouse: Mouse;

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

    public inBoxBorder(x: number, y: number): boolean {
        return pointInArea(this.property.lines, { x, y });
    }

    public draw(): void {
        const circleMap: IcircleMap[] = getArrowCircleMap(this.property.rect);
        this.property.circles = circleMap;

        const lineWid: number = Math.sqrt(
            Math.pow(this.property.rect.endX - this.property.rect.startX, 2) +
                Math.pow(
                    this.property.rect.endY - this.property.rect.startY,
                    2,
                ),
        );
        const propertyWid: number = lineWid * 0.2; // 箭头位置总长度的十分之一
        const propertyInWid: number = propertyWid * 0.7;
        const rec: number = Math.atan(
            Math.abs(this.property.rect.endY - this.property.rect.startY) /
                Math.abs(this.property.rect.endX - this.property.rect.startX),
        );
        const margin: number = Math.PI / 4;
        const min: number = margin - rec;
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

        const P1: Position = {
            x:
                this.property.rect.endX -
                propertyWid * Math.cos(margin - rec) * minuX,
            y:
                this.property.rect.endY +
                propertyWid * Math.sin(margin - rec) * minuY,
        };
        const P2: Position = {
            x:
                this.property.rect.endX -
                propertyWid * Math.cos(margin + rec) * minuX,
            y:
                this.property.rect.endY -
                propertyWid * Math.sin(margin + rec) * minuY,
        };
        const P3: Position = {
            x:
                this.property.rect.endX -
                propertyInWid * Math.cos(margin - rec - margin / 2) * minuX,
            y:
                this.property.rect.endY +
                propertyInWid * Math.sin(margin - rec - margin / 2) * minuY,
        };
        const P4: Position = {
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
        this.ctx.moveTo(
            this.property.rect.startX * config.rate,
            this.property.rect.startY * config.rate,
        );
        this.ctx.lineTo(P3.x * config.rate, P3.y * config.rate);
        this.ctx.lineTo(P1.x * config.rate, P1.y * config.rate);
        this.ctx.lineTo(
            this.property.rect.endX * config.rate,
            this.property.rect.endY * config.rate,
        );
        this.ctx.lineTo(P2.x * config.rate, P2.y * config.rate);
        this.ctx.lineTo(P4.x * config.rate, P4.y * config.rate);
        this.ctx.fill();

        if (this.isFocus) {
            for (const i of circleMap) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.property.color;
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
        }

        this.ctx.restore();
    }
}
