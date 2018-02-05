import { Position } from 'LIB/interface';
import { config } from '../config';
import { pointInRectangular } from 'LIB/geometric';
import Mouse from './mouse-text';

export default class {
    position: Position;
    ctx: CanvasRenderingContext2D;
    input: HTMLElement;
    text: string;
    width: number;
    height: number;
    cols: number;
    rows: number;
    color: string;
    borderColor: string;
    fontSize: string;
    fontFamily: string;
    id: number;
    isFocus: boolean;
    isEditor: boolean;
    inputListener: EventListener;
    inputBlurListener: EventListener;
    mouse: Mouse;

    constructor(ctx: CanvasRenderingContext2D, pos: Position) {
        this.position = pos;
        this.ctx = ctx;
        this.color = (<any>window).color || 'red';
        this.borderColor = 'white';
        this.id = config.uid++;
        this.text = '';
        this.isFocus = true;
        // this.width = 100;
        // this.height = 40;
        this.cols = 10;
        this.rows = 2;
        this.fontSize = '35px';
        this.fontFamily = 'monospace';
        this.initTextArea();
        this.event();
        this.mouse = new Mouse(this);
    }

    getCursor(e: MouseEvent) {
        let result = 'crosshair';
        if (this.inBoxBorder(e.clientX, e.clientY)) {
            result = 'all-scroll';
        }

        return result;
    }

    move(x: number, y: number) {
        this.position.x += x;
        this.position.y += y;

        config.emitter.emit('draw-all');
    }

    focus() {
        console.log(this.isFocus);
        this.isEditor = true;
        this.text = '';
        this.input.style.left = `${this.position.x}px`;
        this.input.style.top = `${this.position.y}px`;
        this.input.style.display = 'block';

        config.emitter.emit('draw-all');
        // this.input.focus();
    }

    inBoxBorder(x: number, y: number) {
        const p1 = {
            x: this.position.x,
            y: this.position.y,
        };
        const p2 = {
            x: this.position.x + this.width,
            y: this.position.y,
        };
        const p3 = {
            x: this.position.x,
            y: this.position.y + this.height,
        };
        const p4 = {
            x: this.position.x + this.width,
            y: this.position.y + this.height,
        };
        const p = {
            x,
            y,
        };
        return pointInRectangular(p1, p2, p3, p4, p);
    }

    setPosition(pos: Position, isDraw = false) {
        this.position = pos;

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    initTextArea() {
        this.isEditor = true;
        this.input = document.createElement('textArea');
        this.input.className = 'function-text';
        this.input.style.left = `${this.position.x}px`;
        this.input.style.top = `${this.position.y}px`;
        this.input.style.color = this.color;
        this.input.setAttribute('cols', this.cols.toString());
        this.input.setAttribute('rows', this.rows.toString());
        if (this.isFocus) {
            this.input.setAttribute('tabIndex', '1');
            this.input.setAttribute('autofocus', 'true');
            this.input.focus();
        }
        this.inputListener = (e: KeyboardEvent) => {
            this.text = (<HTMLInputElement>e.target).value;
            const length = this.text.length;
            const row = length / (this.cols - 1);
            const left = length % (this.cols - 1);
            const rows = left ? row + 1 : row;
            const realRow = rows > 2 ? rows : 2;
            this.input.setAttribute('rows', realRow.toString());
        };
        this.inputBlurListener = (e: KeyboardEvent) => {
            this.text = (<HTMLInputElement>e.target).value;
            this.drawText();
            this.width = this.input.offsetWidth;
            this.height = this.input.offsetHeight;
            console.log(1);
            this.input.style.display = 'none';
            this.isEditor = false;
        };
        this.input.addEventListener('input', this.inputListener);
        this.input.addEventListener('blur', this.inputBlurListener);

        config.wrap.appendChild(this.input);
    }

    hasBox() {
        return !!this.text;
    }

    event() {
        config.emitter.on('mousedown', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(this.getCursor(e));
            }
        });

        config.emitter.on('mousemove', e => {
            if (this.isFocus && !this.isEditor) {
                this.mouse.mouseMove(e);
            }
        });

        config.emitter.on('mouseup', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseUp();
            }
        });
    }

    getTextWidth(txt: string) {
        this.ctx.save();
        this.ctx.font = `${this.fontSize} ${this.fontFamily}`;
        const width = this.ctx.measureText(txt);
        this.ctx.restore();
        return width;
    }

    drawText() {
        const getHeight = () => {
            this.ctx.save();
            this.ctx.font = `${this.fontSize} ${this.fontFamily}`;
            const height = this.ctx.measureText('w');
            return 35;
        };
        let txts = [];
        const len =
            this.text.length % (this.cols - 1)
                ? parseInt((this.text.length / (this.cols - 1)).toFixed(), 10) +
                  1
                : this.text.length / (this.cols - 1);
        for (let i = 0; i < len; i++) {
            txts.push(
                this.text.substring(
                    i * this.cols,
                    // this.cols,
                    (i + 1) * this.cols,
                ),
            );
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.font = `${this.fontSize} ${this.fontFamily}`;
        for (let i = 0; i < txts.length; i++) {
            this.ctx.fillText(
                txts[i],
                this.position.x + 1 + 10,
                this.position.y - 6 + getHeight() * (i + 1) + 10,
            );
        }
        this.ctx.restore();
    }

    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.borderColor;
        // this.ctx.moveTo(this.position.x, this.position.y);
        // this.ctx.lineTo(this.position.x + this.width, this.position.y);
        // this.ctx.lineTo(
        //     this.position.x + this.width,
        //     this.position.y + this.height,
        // );
        // this.ctx.lineTo(this.position.x, this.position.y + this.height);
        // this.ctx.lineTo(this.position.x, this.position.y);
        // TODO draw text

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();

        this.drawText();
    }
}
