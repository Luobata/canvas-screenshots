import { Position } from 'LIB/interface';

export default class Cursor {
    position: Position;
    color: String;
    flashTime: number;
    timer: null | number;

    constructor(pos: Position, color: string) {
        this.position = pos;
        this.color = color;
        this.flashTime = 1000;
    }

    start() {
        this.timer = window.setInterval(() => {
            // draw();
        }, this.flashTime);
    }

    end() {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    }

    setPositin(pos: Position) {
        this.position = pos;
        this.draw();
    }

    draw() {}
}
