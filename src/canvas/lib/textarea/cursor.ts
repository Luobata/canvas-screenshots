/**
 * @description cursor
 */
import { Position } from 'LIB/interface';

/**
 * default class Cursor
 */
export default class Cursor {
    public position: Position;
    public color: String;
    public flashTime: number;
    public timer: null | number;

    constructor(pos: Position, color: string) {
        this.position = pos;
        this.color = color;
        this.flashTime = 1000;
    }

    public start(): void {
        this.timer = window.setInterval(() => {
            // draw();
        }, this.flashTime);
    }

    public end(): void {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    }

    public setPositin(pos: Position): void {
        this.position = pos;
        this.draw();
    }

    public draw(): void {
        // TODO
    }
}
