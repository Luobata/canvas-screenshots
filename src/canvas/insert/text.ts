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
    maxCols: number;
    maxRows: number;
    color: string;
    borderColor: string;
    borderWidth: number;
    fontSize: string;
    fontFamily: string;
    id: number;
    isFocus: boolean;
    isEditor: boolean;
    textWidth: number;
    mouseDown: EventListener;
    mouseMove: EventListener;
    mouseUp: EventListener;
    inputListener: EventListener;
    inputBlurListener: EventListener;
    mouse: Mouse;

    constructor(ctx: CanvasRenderingContext2D, pos: Position) {
        this.position = pos;
        this.ctx = ctx;
        this.color = (<any>window).color || 'red';
        this.borderColor = '#fff';
        this.borderWidth = 1;
        this.id = config.uid++;
        this.text = '';
        this.isFocus = true;
        // this.width = 100;
        // this.height = 40;
        this.cols = 1;
        this.cols = 2;
        this.rows = 1;
        this.textWidth = Math.floor(this.getTextWidth('1').width);
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
        this.isEditor = true;
        this.text = '';
        this.input.style.left = `${this.position.x}px`;
        this.input.style.top = `${this.position.y}px`;
        this.input.style.display = 'block';
        // 同时操作display 与input 会触发blur
        setTimeout(() => {
            this.input.focus();
        }, 0);

        config.emitter.emit('draw-all');
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
        setTimeout(() => {
            this.width = this.input.offsetWidth;
            this.height = this.input.offsetHeight;
            if (this.isFocus) {
                this.input.setAttribute('tabIndex', '1');
                this.input.setAttribute('autofocus', 'true');
                this.input.focus();
            }
        }, 0);
        this.inputListener = (e: KeyboardEvent) => {
            this.text = (<HTMLInputElement>e.target).value;
            const length = this.text.length;
            const row = length / (this.cols - 1);
            const left = length % (this.cols - 1);
            const rows = left ? row + 1 : row;
            const realRow = rows > this.rows ? rows : this.rows;
            this.input.setAttribute('rows', realRow.toString());
            // 输入cols 增加，遇到边界换行
            // 观察发现每增加一列的宽度增加21
            // this.input.setAttribute('cols', length.toString());
        };
        this.inputBlurListener = (e: KeyboardEvent) => {
            this.text = (<HTMLInputElement>e.target).value;
            this.drawText();
            this.width = this.input.offsetWidth;
            this.height = this.input.offsetHeight;
            this.input.style.display = 'none';
            this.isEditor = false;

            if (this.text === '') {
                this.destroyed();
            }
        };
        this.input.addEventListener('input', this.inputListener);
        this.input.addEventListener('blur', this.inputBlurListener);

        config.wrap.appendChild(this.input);
    }

    hasBox() {
        return !!this.text;
    }

    event() {
        this.mouseDown = (e: MouseEvent) => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(this.getCursor(e));
            }
        };
        this.mouseMove = (e: MouseEvent) => {
            if (this.isFocus && !this.isEditor) {
                this.mouse.mouseMove(e);
            }
        };
        this.mouseUp = e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseUp();
            }
        };

        config.emitter.on('mousedown', this.mouseDown);
        config.emitter.on('mousemove', this.mouseMove);
        config.emitter.on('mouseup', this.mouseUp);
        // config.emitter.on('mousedown', e => {
        //     if (this.isFocus && this.hasBox()) {
        //         this.mouse.mouseDown(this.getCursor(e));
        //     }
        // });

        // config.emitter.on('mousemove', e => {
        //     if (this.isFocus && !this.isEditor) {
        //         this.mouse.mouseMove(e);
        //     }
        // });

        // config.emitter.on('mouseup', e => {
        //     if (this.isFocus && this.hasBox()) {
        //         this.mouse.mouseUp();
        //     }
        // });
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
        if (this.isFocus && this.text) {
            this.ctx.strokeStyle = this.borderColor;
            this.ctx.lineWidth = this.borderWidth;
            this.ctx.strokeRect(
                this.position.x,
                this.position.y,
                this.width,
                this.height,
            );
        }

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();

        this.drawText();
    }

    destroyed() {
        this.input.removeEventListener('input', this.inputListener);
        this.input.removeEventListener('blur', this.inputBlurListener);
        config.emitter.off('mousedown', this.mouseDown);
        config.emitter.off('mousemove', this.mouseMove);
        config.emitter.off('mouseup', this.mouseUp);

        config.emitter.emit('removeItem', this);
    }
}
