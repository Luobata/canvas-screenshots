import { Rect, Events } from '../util/interface';
import { config } from '../util/config';

export default class Rectangular {
    id: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    rect: Rect; // 坐标点
    isStroke: boolean; // 是否空心 即只有border
    backgroundColor: string; // background-color
    borderWidth: number;
    borderRadious: number;
    borderColor: string;

    constructor(canvas: HTMLCanvasElement) {
        this.id = config.uid++;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.isStroke = false;
        this.backgroundColor = 'black';
        this.borderColor = 'black';
        this.borderWidth = 1;
        this.borderRadious = 0;
    }

    inArea() {}

    draw() {
        this.ctx.save();

        this.ctx.beginPath();

        if (!this.isStroke) {
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(
                this.rect.startX,
                this.rect.startY,
                this.rect.endX - this.rect.startX,
                this.rect.endY - this.rect.startY,
            );
        }
        if (this.borderWidth > 0) {
            // 画border
            this.ctx.lineWidth = this.borderWidth;
            this.ctx.moveTo(
                this.rect.startX - this.borderWidth,
                this.rect.startY - this.borderWidth,
            );
            this.ctx.lineTo(
                this.rect.endX + this.borderWidth,
                this.rect.startY - this.borderWidth,
            );
            this.ctx.lineTo(
                this.rect.endX + this.borderWidth,
                this.rect.endY + this.borderWidth,
            );
            this.ctx.lineTo(
                this.rect.startX - this.borderWidth,
                this.rect.endY + this.borderWidth,
            );
            this.ctx.lineTo(
                this.rect.startX - this.borderWidth,
                this.rect.startY - this.borderWidth,
            );
            this.ctx.strokeStyle = this.borderColor;
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    eventListener(events: Array<Events>) {
        for (let i of events) {
            this.canvas.addEventListener(i.type, (...rest: any[]) => {
                if (this.inArea()) {
                    i.callback(...rest);
                }
            });
        }
    }
}
