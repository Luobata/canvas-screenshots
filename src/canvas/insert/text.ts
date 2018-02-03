import { Position } from 'LIB/interface';
import { config } from '../config';

export default class {
    position: Position;
    ctx: CanvasRenderingContext2D;
    input: HTMLElement;
    text: string;
    width: number;
    height: number;
    color: string;
    borderColor: string;
    fontSize: string;
    fontFamily: string;
    id: number;
    isFocus: boolean;
    inputListener: EventListener;

    constructor(ctx: CanvasRenderingContext2D, pos: Position) {
        this.position = pos;
        this.ctx = ctx;
        this.color = (<any>window).color || 'red';
        this.borderColor = 'white';
        this.id = config.uid++;
        this.text = '';
        this.isFocus = true;
        this.width = 100;
        this.height = 40;
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
        this.input = document.createElement('input');
        this.input.className = 'function-text';
        // this.input.style.visibility = 'hidden';
        this.input.style.opacity = '0';
        this.input.style.left = `${this.position.x}px`;
        this.input.style.top = `${this.position.y}px`;
        this.input.style.color = this.color;
        if (this.isFocus) {
            this.input.setAttribute('tabIndex', '1');
            this.input.setAttribute('autofocus', 'true');
            this.input.focus();
        }
        this.inputListener = (e: KeyboardEvent) => {
            this.text = (<HTMLInputElement>e.target).value;
        };

        this.input.addEventListener('input', this.inputListener);

        config.wrap.appendChild(this.input);
    }

    event() {}

    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.borderColor;
        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.lineTo(this.position.x + this.width, this.position.y);
        this.ctx.lineTo(
            this.position.x + this.width,
            this.position.y + this.height,
        );
        this.ctx.lineTo(this.position.x, this.position.y + this.height);
        this.ctx.lineTo(this.position.x, this.position.y);
        // TODO draw text

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
}
