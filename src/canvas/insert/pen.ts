import { Position } from 'LIB/interface';
import { config } from '../config';
import Mouse from './mouse-pen';
import { pointInLine } from 'LIB/geometric';

interface pen {
    lines: Array<Position>;
    color: string;
    lineWidth: number;
}

export default class {
    id: number;
    ctx: CanvasRenderingContext2D;
    isFocus: boolean;
    mouse: Mouse;

    mouseDown: EventListener;
    mouseMove: EventListener;
    mouseUp: EventListener;
    pen: pen;
    saveArray: Array<pen>;

    constructor(ctx: CanvasRenderingContext2D, color: string) {
        this.ctx = ctx;
        this.id = config.uid++;
        this.isFocus = true;
        this.pen = {
            color,
            lines: [],
            lineWidth: 3,
        };
        this.saveArray = [];
        this.mouse = new Mouse(this);
        this.event();
    }

    save() {
        this.saveArray.push(JSON.parse(JSON.stringify(this.pen)));
    }

    back() {
        if (this.saveArray.length) {
            this.saveArray.pop();
            this.pen = this.saveArray[this.saveArray.length - 1];
        }
        if (!this.pen) {
            this.destroyed();
        }
    }

    destroyed() {
        config.emitter.off('mousedown', this.mouseDown);
        config.emitter.off('mousemove', this.mouseMove);
        config.emitter.off('mouseup', this.mouseUp);
        config.emitter.emit('removeItem', this);
    }

    setColor(color: string) {
        this.pen.color = color;
        this.save();
        config.emitter.emit('draw-all');
    }

    inBoxBorder(x: number, y: number) {
        return pointInLine(this.pen.lines, { x, y }, 10 + this.pen.lineWidth);
    }

    getCursor(e: MouseEvent) {
        let result = 'crosshair';
        if (this.inBoxBorder(e.clientX, e.clientY)) {
            result = 'all-scroll';
        }

        return result;
    }

    hasBox(): boolean {
        return this.pen.lines.length > 1;
    }

    event() {
        this.mouseDown = (e: MouseEvent) => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(this.getCursor(e));
            }
        };
        this.mouseMove = (e: MouseEvent) => {
            if (this.isFocus) {
                this.mouse.mouseMove(e);
            }
        };
        this.mouseUp = (e: MouseEvent) => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseUp();
            }
        };

        config.emitter.on('mousedown', this.mouseDown);
        config.emitter.on('mousemove', this.mouseMove);
        config.emitter.on('mouseup', this.mouseUp);
    }

    addPosition(pos: Position, isDraw = false) {
        this.pen.lines.push(pos);

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    move(x: number, y: number) {
        for (let i of this.pen.lines) {
            i.x += x;
            i.y += y;
        }

        config.emitter.emit('draw-all');
    }

    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.pen.color;
        this.ctx.lineWidth = this.pen.lineWidth;
        // this.ctx.lineJoin = 'round';
        this.ctx.moveTo(this.pen.lines[0].x, this.pen.lines[0].y);

        for (let i = 1; i < this.pen.lines.length; i++) {
            this.ctx.lineTo(this.pen.lines[i].x, this.pen.lines[i].y);
        }

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
}
