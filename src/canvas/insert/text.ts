import { Position } from 'LIB/interface';
import { config } from '../config';
import { pointInRectangular } from 'LIB/geometric';
import Mouse from './mouse-text';

interface Text {
    position: Position;
    text: string;
    txts: Array<string>;
    width?: number;
    height?: number;
    cols: number;
    rows: number;
    maxCols?: number;
    maxRows?: number;
    color: string;
    borderColor: string;
    borderWidth: number;
    fontSize: string;
    fontFamily: string;
    isEditor?: boolean;
    textWidth?: number;
}

export default class {
    id: number;
    ctx: CanvasRenderingContext2D;
    input: HTMLElement;
    mouseDown: EventListener;
    mouseMove: EventListener;
    mouseUp: EventListener;
    inputListener: EventListener;
    inputBlurListener: EventListener;
    isFocus: boolean;
    mouse: Mouse;

    Text: Text;
    saveArray: Array<Text>;

    constructor(ctx: CanvasRenderingContext2D, pos: Position) {
        this.ctx = ctx;
        this.isFocus = true;
        this.id = config.uid++;

        this.Text = {
            position: pos,
            color: (<any>window).color || 'red',
            borderColor: '#fff',
            borderWidth: 1,
            text: '',
            cols: 2,
            rows: 1,
            txts: [],
            fontSize: '35px',
            fontFamily: 'monospace',
        };
        this.Text.textWidth = Math.floor(this.getTextWidth('1').width);
        this.initTextArea();
        this.event();
        this.mouse = new Mouse(this);
        this.getMaxCols();
    }

    getCursor(e: MouseEvent) {
        let result = 'crosshair';
        if (this.inBoxBorder(e.clientX, e.clientY)) {
            result = 'all-scroll';
        }

        return result;
    }

    move(x: number, y: number) {
        this.Text.position.x += x;
        this.Text.position.y += y;

        config.emitter.emit('draw-all');
    }

    focus() {
        this.Text.isEditor = true;
        this.Text.text = '';
        this.input.style.left = `${this.Text.position.x}px`;
        this.input.style.top = `${this.Text.position.y}px`;
        this.input.style.display = 'block';
        // 同时操作display 与input 会触发blur
        setTimeout(() => {
            this.input.focus();
        }, 0);

        config.emitter.emit('draw-all');
    }

    inBoxBorder(x: number, y: number) {
        const p1 = {
            x: this.Text.position.x,
            y: this.Text.position.y,
        };
        const p2 = {
            x: this.Text.position.x + this.Text.width,
            y: this.Text.position.y,
        };
        const p3 = {
            x: this.Text.position.x,
            y: this.Text.position.y + this.Text.height,
        };
        const p4 = {
            x: this.Text.position.x + this.Text.width,
            y: this.Text.position.y + this.Text.height,
        };
        const p = {
            x,
            y,
        };
        return pointInRectangular(p1, p2, p3, p4, p);
    }

    setPosition(pos: Position, isDraw = false) {
        this.Text.position = pos;

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    getSize() {
        setTimeout(() => {
            this.Text.width = this.input.offsetWidth;
            this.Text.height = this.input.offsetHeight;
        }, 0);
    }

    getMaxCols() {
        setTimeout(() => {
            const num =
                (config.boxRect.endX - this.Text.position.x - this.Text.width) /
                this.Text.textWidth;
            this.Text.maxCols = Math.floor(num) + 1;
        }, 0);
    }

    getMaxRows() {}

    getTextInput() {
        const rows = this.Text.text.split('\n');
        const cols = [];
        let maxCols = 0;
        for (let i of rows) {
            if (i.length > maxCols) {
                maxCols =
                    i.length > this.Text.maxCols ? this.Text.maxCols : i.length;
                if (i.length > this.Text.maxCols) {
                    let j = 0;
                    while (j < i.length) {
                        cols.push(i.substr(j, this.Text.maxCols));
                        j += this.Text.maxCols;
                    }
                } else {
                    cols.push(i);
                }
            } else {
                cols.push(i);
            }
        }
        this.Text.txts = cols;
        this.input.setAttribute('cols', maxCols.toString());
        this.input.setAttribute('rows', cols.length.toString());
    }

    initTextArea() {
        this.Text.isEditor = true;
        this.input = document.createElement('textArea');
        this.input.className = 'function-text';
        this.input.style.left = `${this.Text.position.x}px`;
        this.input.style.top = `${this.Text.position.y}px`;
        this.input.style.color = this.Text.color;
        this.input.setAttribute('cols', this.Text.cols.toString());
        this.input.setAttribute('rows', this.Text.rows.toString());
        setTimeout(() => {
            this.Text.width = this.input.offsetWidth;
            this.Text.height = this.input.offsetHeight;
            if (this.isFocus) {
                this.input.setAttribute('tabIndex', '1');
                this.input.setAttribute('autofocus', 'true');
                this.input.focus();
            }
        }, 0);
        this.inputListener = (e: KeyboardEvent) => {
            this.Text.text = (<HTMLInputElement>e.target).value;
            const length = this.Text.text.length;
            const row = length / (this.Text.cols - 1);
            const left = length % (this.Text.cols - 1);
            const rows = left ? row + 1 : row;
            const realRow = rows > this.Text.rows ? rows : this.Text.rows;
            this.getTextInput();
            this.getSize();
        };
        this.inputBlurListener = (e: KeyboardEvent) => {
            this.Text.text = (<HTMLInputElement>e.target).value;
            this.drawText();
            this.Text.width = this.input.offsetWidth;
            this.Text.height = this.input.offsetHeight;
            this.input.style.display = 'none';
            this.Text.isEditor = false;

            if (this.Text.text === '') {
                this.destroyed();
            }
        };
        this.input.addEventListener('input', this.inputListener);
        this.input.addEventListener('blur', this.inputBlurListener);

        config.wrap.appendChild(this.input);
    }

    hasBox() {
        return !!this.Text.text;
    }

    event() {
        this.mouseDown = (e: MouseEvent) => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(this.getCursor(e));
            }
        };
        this.mouseMove = (e: MouseEvent) => {
            if (this.isFocus && !this.Text.isEditor) {
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
        this.ctx.font = `${this.Text.fontSize} ${this.Text.fontFamily}`;
        const width = this.ctx.measureText(txt);
        this.ctx.restore();
        return width;
    }

    drawText() {
        const getHeight = () => {
            this.ctx.save();
            this.ctx.font = `${this.Text.fontSize} ${this.Text.fontFamily}`;
            const height = this.ctx.measureText('w');
            return 35;
        };
        let txts = [];
        const len =
            this.Text.text.length % (this.Text.cols - 1)
                ? parseInt(
                      (this.Text.text.length / (this.Text.cols - 1)).toFixed(),
                      10,
                  ) + 1
                : this.Text.text.length / (this.Text.cols - 1);
        for (let i = 0; i < len; i++) {
            txts.push(
                this.Text.text.substring(
                    i * this.Text.cols,
                    // this.Text.cols,
                    (i + 1) * this.Text.cols,
                ),
            );
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.Text.color;
        this.ctx.font = `${this.Text.fontSize} ${this.Text.fontFamily}`;
        for (let i = 0; i < this.Text.txts.length; i++) {
            this.ctx.fillText(
                this.Text.txts[i],
                this.Text.position.x + 1 + 10,
                this.Text.position.y - 6 + getHeight() * (i + 1) + 10,
            );
        }
        this.ctx.restore();
    }

    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        if (this.isFocus && this.Text.text) {
            this.ctx.strokeStyle = this.Text.borderColor;
            this.ctx.lineWidth = this.Text.borderWidth;
            this.ctx.strokeRect(
                this.Text.position.x,
                this.Text.position.y,
                this.Text.width,
                this.Text.height,
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
