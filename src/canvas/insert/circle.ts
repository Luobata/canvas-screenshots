import { dragCircle, Circle } from 'LIB/interface';
import { config } from '../config';
import { getCircleMapWithCircle } from 'LIB/help';

export default class {
    id: number;
    circle: Circle;
    circles: Array<dragCircle>;
    ctx: CanvasRenderingContext2D;
    isFocus: boolean;
    color: string;
    borderColor: string;
    borderWidth: number;
    circleWidth: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.isFocus = true;
        this.borderColor = 'black';
        this.color = 'black';
        this.circleWidth = 3;
        this.id = config.uid++;

        this.event();
        this.drawAll();
    }

    inCircle() {}

    event() {}

    draw() {
        const circleMap = getCircleMapWithCircle(this.circle, this.borderWidth);
        this.circles = circleMap;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.borderColor;
        this.ctx.lineWidth = this.borderWidth;
        this.ctx.stroke();
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
            this.drawAll();
        });
    }
}
