/**
 * @description pen
 */
import { config, inBox } from 'Canvas/config';
import Content from 'INSERT/content';
import Mouse from 'INSERT/mouse-pen';
import { pointInLine } from 'LIB/geometric';
import { Position } from 'LIB/interface';

interface Ipen {
    lines: Position[];
    color: string;
    lineWidth: number;
}

/**
 * default class
 */
export default class SPen extends Content {
    public property: Ipen;
    private mouse: Mouse;

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

    public inBoxBorder(x: number, y: number): boolean {
        return pointInLine(
            this.property.lines,
            { x, y },
            this.property.lineWidth + 10,
        );
    }

    public getCursor(e: MouseEvent): string {
        let result: string = 'crosshair';
        if (this.inBoxBorder(e.clientX, e.clientY)) {
            result = 'all-scroll';
        }

        return result;
    }

    public hasBox(): boolean {
        return this.property.lines.length > 1;
    }

    public event(): void {
        this.mouseDown = (e: MouseEvent): void => {
            if (this.isFocus && this.hasBox() && inBox(e)) {
                this.mouse.mouseDown(this.getCursor(e));
            }
        };
        this.mouseMove = (e: MouseEvent): void => {
            if (this.isFocus) {
                this.mouse.mouseMove(e);
            }
        };
        this.mouseUp = (e: MouseEvent): void => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseUp();
            }
        };

        config.emitter.on('mousedown', this.mouseDown);
        config.emitter.on('mousemove', this.mouseMove);
        config.emitter.on('mouseup', this.mouseUp);
    }

    public addPosition(pos: Position, isDraw: boolean = false): void {
        this.property.lines.push(pos);

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    public move(x: number, y: number): void {
        for (const i of this.property.lines) {
            i.x += x;
            i.y += y;
        }

        config.emitter.emit('draw-all');
    }

    public draw(): void {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.property.color;
        this.ctx.lineWidth = this.property.lineWidth * config.rate;
        // this.ctx.lineJoin = 'round';
        this.ctx.moveTo(
            this.property.lines[0].x * config.rate,
            this.property.lines[0].y * config.rate,
        );

        for (let i: number = 1; i < this.property.lines.length; i = i + 1) {
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
