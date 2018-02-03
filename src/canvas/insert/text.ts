import { Position } from 'LIB/interface';
import { config } from '../config';

export default class {
    position: Position;
    ctx: CanvasRenderingContext2D;
    textArea: HTMLElement;
    text: string;
    color: string;
    fontSize: string;
    fontFamily: string;
    id: number;
    isFocus: boolean;

    constructor(ctx: CanvasRenderingContext2D, pos: Position) {
        this.position = pos;
        this.ctx = ctx;
        this.color = (<any>window).color || 'red';
        this.id = config.uid++;
        this.text = '';
        this.isFocus = true;
        this.initTextArea();
        this.event();
    }

    getCursor(e: MouseEvent) {
        let result = 'crosshair';
        if (this.inBoxBorder(e.clientX, e.clientY)) {
            result = 'all-scroll';
        }

        return result;
    }

    inBoxBorder(X: number, y: number) {}

    setPosition(pos: Position, isDraw = false) {
        this.position = pos;

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    initTextArea() {
        this.textArea = document.createElement('textArea');
        this.textArea.className = 'function-text';
        // this.textArea.style.display = 'none';
        this.textArea.style.left = `${this.position.x}px`;
        this.textArea.style.top = `${this.position.y}px`;
        this.textArea.style.color = this.color;
        if (this.isFocus) {
            this.textArea.setAttribute('tabIndex', '1');
            this.textArea.setAttribute('autofocus', 'true');
        }

        config.wrap.appendChild(this.textArea);
    }

    event() {}

    draw() {}
}
