import { Position } from 'LIB/interface';
import { config, inBox } from '../config';
import { pointInRectangular } from 'LIB/geometric';
import { isChinese } from 'LIB/reg';
import Mouse from './mouse-text';

const getStrLength = (str: string) => {
    let len = 0;
    for (let i of str) {
        len += isChinese(i) ? 2 : 1;
    }

    return len;
};

const subStr = (str: string, index: number, length: number) => {
    let len = 0;
    let begin = -1;
    let end = -1; // -1 用来标志是没有位移过
    for (let i = 0; i < str.length; i++) {
        len += getStrLength(str[i]);
        // length += len;
        if (len - 1 >= index && begin === -1) {
            begin = i;
            len = getStrLength(str[i]);
        }

        if (begin !== -1) {
            if (len === length) {
                end = i;
                break;
            } else if (len > length) {
                end = i === 0 ? 0 : i - 1;
                break;
            }
        }
    }
    if (end === -1) end = str.length - 1;

    return {
        str: str.substr(begin, end - begin + 1),
        subLen: end - begin + 1,
    };
};

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
    input: HTMLTextAreaElement;
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
            fontFamily:
                config.platform !== 'windows' ? 'monospace' : 'Consolas',
            // fontFamily: 'monospace',
        };
        this.saveArray = [];
        this.Text.textWidth = Math.floor(this.getTextWidth('1').width);
        this.initTextArea();
        this.event();
        this.mouse = new Mouse(this);
        this.getMaxCols();
    }

    save() {
        this.saveArray.push(JSON.parse(JSON.stringify(this.Text)));
    }

    back() {
        if (this.saveArray.length) {
            this.saveArray.pop();
            this.Text = this.saveArray[this.saveArray.length - 1];
        }
        if (!this.Text) {
            this.destroyed();
        }
    }

    setColor(color: string) {}

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
            this.input.value = this.Text.txts.join('\n');
            this.getMaxCols();
            // this.input.setAttribute('value', this.Text.txts.join('\n'));
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
            // 20 = padding-left + paddin-right
            const num =
                (config.boxRect.endX - this.Text.position.x - 20) /
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
            // 用lenth判断不合适 因为 中文（可能也有其他字符）计算为2个cols长度
            // if (i.length > maxCols) {
            //     maxCols =
            //         i.length > this.Text.maxCols ? this.Text.maxCols : i.length;
            //     if (i.length > this.Text.maxCols) {
            //         let j = 0;
            //         while (j < i.length) {
            //             cols.push(i.substr(j, this.Text.maxCols));
            //             j += this.Text.maxCols;
            //         }
            //     } else {
            //         cols.push(i);
            //     }
            // } else {
            //     cols.push(i);
            // }
            const length = getStrLength(i);
            console.log(length);
            if (length > maxCols) {
                maxCols =
                    length > this.Text.maxCols ? this.Text.maxCols : length;
                if (length > this.Text.maxCols) {
                    let j = 0;
                    while (j < length) {
                        // debugger;
                        const strObj = subStr(i, j, this.Text.maxCols);
                        console.log(i, j, this.Text.maxCols, strObj);
                        cols.push(strObj.str);
                        j += strObj.subLen;
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
        console.log(cols);
    }

    initTextArea() {
        this.Text.isEditor = true;
        this.input = <HTMLTextAreaElement>document.createElement('textArea');
        this.input.className = 'function-text';
        this.input.className += ` ${config.platform}`;
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
            this.getTextInput();
            this.getSize();
        };
        this.inputBlurListener = (e: KeyboardEvent) => {
            this.Text.text = (<HTMLInputElement>e.target).value;
            this.Text.width = this.input.offsetWidth;
            this.Text.height = this.input.offsetHeight;
            this.input.style.display = 'none';
            this.Text.isEditor = false;
            config.emitter.emit('draw-all');

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
            if (this.isFocus && this.hasBox() && inBox(e)) {
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

        if (!this.Text.isEditor) {
            this.drawText();
        }
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
