import { Position } from 'LIB/interface';
import { config, inBox } from '../config';
import Mouse from './mouse-pen';
import { pointInLine } from 'LIB/geometric';
import Content from './content';

interface pen {
    lines: Array<Position>;
    color: string;
    lineWidth: number;
}

export default class extends Content {
    mouse: Mouse;
    property: pen;

    constructor(ctx: CanvasRenderingContext2D, color: string) {
        super(ctx);
        this.property = {
            color,
            lines: [],
            lineWidth: 3,
        };
        this.mouse = new Mouse(this);
        this.event();
    }

    inBoxBorder(x: number, y: number) {
        return pointInLine(
            this.property.lines,
            { x, y },
            10 + this.property.lineWidth,
        );
    }

    getCursor(e: MouseEvent) {
        let result = 'crosshair';
        if (this.inBoxBorder(e.clientX, e.clientY)) {
            result = 'all-scroll';
        }

        return result;
    }

    hasBox(): boolean {
        return this.property.lines.length > 1;
    }

    event() {
        this.mouseDown = (e: MouseEvent) => {
            if (this.isFocus && this.hasBox() && inBox(e)) {
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
        this.property.lines.push(pos);

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    move(x: number, y: number) {
        for (let i of this.property.lines) {
            i.x += x;
            i.y += y;
        }

        config.emitter.emit('draw-all');
    }

    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.property.color;
        this.ctx.lineWidth = this.property.lineWidth * config.rate;
        // this.ctx.lineJoin = 'round';
        this.ctx.moveTo(
            this.property.lines[0].x * config.rate,
            this.property.lines[0].y * config.rate,
        );

        for (let i = 1; i < this.property.lines.length; i++) {
            this.ctx.lineTo(
                this.property.lines[i].x * config.rate,
                this.property.lines[i].y * config.rate,
            );
        }

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
}
