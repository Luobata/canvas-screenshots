import { Position } from 'LIB/interface';
import { config } from '../config';
import Mouse from './mouse-pen';
import { pointInLine } from 'LIB/geometric';

export default class {
    lines: Array<Position>;
    ctx: CanvasRenderingContext2D;
    color: string;
    id: number;
    lineWidth: number;
    isFocus: boolean;
    mouse: Mouse;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.color = (<any>window).color || 'red';
        this.id = config.uid++;
        this.isFocus = true;
        this.lines = [];
        this.lineWidth = 1;
        this.mouse = new Mouse(this);
        this.event();
    }

    inBoxBorder(x: number, y: number) {
        return pointInLine(this.lines, { x, y }, 3);
    }

    getCursor(e: MouseEvent) {
        let result = 'crosshair';
        if (this.inBoxBorder(e.clientX, e.clientY)) {
            result = 'all-scroll';
        }

        return result;
    }

    hasBox(): boolean {
        return this.lines.length > 1;
    }

    event() {
        config.emitter.on('mousedown', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(this.getCursor(e));
            }
        });

        config.emitter.on('mosemove', e => {
            if (this.isFocus) {
                this.mouse.mouseMove(e);
            }
        });

        config.emitter.on('mouseup', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseUp();
            }
        });
    }

    addPosition(pos: Position, isDraw = false) {
        this.lines.push(pos);

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    move(x: number, y: number) {
        for (let i of this.lines) {
            i.x += x;
            i.y += y;
        }

        config.emitter.emit('draw-all');
    }

    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineJoin = 'round';
        this.ctx.moveTo(this.lines[0].x, this.lines[0].y);

        for (let i = 1; i < this.lines.length; i++) {
            this.ctx.lineTo(this.lines[i].x, this.lines[i].y);
        }

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
}
