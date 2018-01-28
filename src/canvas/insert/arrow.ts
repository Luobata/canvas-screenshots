import { Rect } from 'LIB/interface';
import { config } from '../config';

export default class {
    rect: Rect;
    ctx: CanvasRenderingContext2D;
    color: string;
    id: number;
    isFocus: boolean;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.color = (<any>window).color || 'red';
        this.id = config.uid++;
        this.isFocus = false;
    }

    inBoxBorder(positionX: number, positionY: number) {}

    getCursor(e: MouseEvent, type?: string) {
        let result = 'crosshair';

        return result;
    }

    setPosition(rect: Rect, isDraw = false) {
        Object.assign(this.rect, rect);
        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    draw() {
        const lineWid = Math.sqrt(
            Math.pow(this.rect.endX - this.rect.startX, 2) +
                Math.pow(this.rect.endY - this.rect.startY, 2),
        );
        const arrowWid = lineWid / 10; // 箭头位置总长度的十分之一
        const P1 = {
            x: this.rect.endX - arrowWid * Math.sin(Math.PI * 3 / 8),
            y: this.rect.endY - arrowWid * Math.cos(Math.PI * 3 / 8),
        };
        const P2 = {
            x: this.rect.endX - arrowWid * Math.sin(Math.PI * 1 / 8),
            y: this.rect.endY - arrowWid * Math.cos(Math.PI * 1 / 8),
        };
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.lineTo(this.rect.startX, this.rect.startY);
        this.ctx.moveTo(P1.x, P1.y);
        this.ctx.moveTo(this.rect.endX, this.rect.endY);
        this.ctx.moveTo(P2.x, P1.y);
        this.ctx.fill();
        this.ctx.restore();
    }
}
