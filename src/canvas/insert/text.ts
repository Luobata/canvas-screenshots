import { Position } from 'LIB/interface';
import { config, inBox } from '../config';
import { pointInRectangular } from 'LIB/geometric';
import { isChinese } from 'LIB/reg';
import Mouse from './mouse-text';
import Content from './content';

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
    const resultStr = str.substr(begin, end - begin + 1);

    return {
        str: resultStr,
        subLen: getStrLength(resultStr),
    };
};

interface property {
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

export default class extends Content {
    input: HTMLTextAreaElement;
    inputListener: EventListener;
    inputBlurListener: EventListener;
    mouse: Mouse;

    property: property;

    constructor(ctx: CanvasRenderingContext2D, pos: Position) {
        super(ctx);
        this.property = {
            position: pos,
            color: (<any>window).color || 'red',
            borderColor: '#fff',
            borderWidth: 2,
            text: '',
            cols: 1,
            rows: 1,
            txts: [],
            fontSize: '36px',
            // fontFamily:
            //     config.platform !== 'windows' ? 'monospace' : 'Consolas',
            fontFamily: 'monospace',
        };
        this.property.textWidth = Math.floor(this.getTextWidth('1').width);
        this.initTextArea();
        this.event();
        this.mouse = new Mouse(this);
        this.getMaxCols();
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
        this.property.position.x += x;
        this.property.position.y += y;

        config.emitter.emit('draw-all');
    }

    focus() {
        this.property.isEditor = true;
        this.property.text = '';
        this.input.style.left = `${this.property.position.x}px`;
        this.input.style.top = `${this.property.position.y}px`;
        this.input.style.display = 'block';
        // 同时操作display 与input 会触发blur
        setTimeout(() => {
            this.input.value = this.property.txts.join('\n');
            this.getMaxCols();
            this.input.focus();
        }, 0);

        config.emitter.emit('draw-all');
    }

    inBoxBorder(x: number, y: number) {
        const p1 = {
            x: this.property.position.x,
            y: this.property.position.y,
        };
        const p2 = {
            x: this.property.position.x + this.property.width,
            y: this.property.position.y,
        };
        const p3 = {
            x: this.property.position.x,
            y: this.property.position.y + this.property.height,
        };
        const p4 = {
            x: this.property.position.x + this.property.width,
            y: this.property.position.y + this.property.height,
        };
        const p = {
            x,
            y,
        };
        return pointInRectangular(p1, p2, p3, p4, p);
    }

    getSize() {
        setTimeout(() => {
            this.property.width = this.input.offsetWidth;
            this.property.height = this.input.offsetHeight;
        }, 0);
    }

    getMaxCols() {
        setTimeout(() => {
            // 20 = padding-left + paddin-right
            const num =
                (config.boxRect.endX - this.property.position.x - 20) /
                this.property.textWidth;
            this.property.maxCols = Math.floor(num) + 1;
        }, 0);
    }

    getTextInput() {
        const rows = this.property.text.split('\n');
        const cols = [];
        let maxCols = 0;
        for (let i of rows) {
            // 用lenth判断不合适 因为 中文（可能也有其他字符）计算为2个cols长度
            const length = getStrLength(i);
            if (length > maxCols) {
                maxCols =
                    length > this.property.maxCols
                        ? this.property.maxCols
                        : length;
                if (length > this.property.maxCols) {
                    let j = 0;
                    while (j < length) {
                        const strObj = subStr(i, j, this.property.maxCols);
                        // console.log(i, j, this.property.maxCols, strObj);
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
        this.property.txts = cols;
        this.input.style.width =
            maxCols * parseInt(this.property.fontSize, 10) / 2 + 'px';
        this.input.setAttribute('rows', cols.length.toString());
    }

    initTextArea() {
        this.property.isEditor = true;
        this.input = <HTMLTextAreaElement>document.createElement('textArea');
        this.input.className = 'function-text';
        this.input.className += ` ${config.platform}`;
        this.input.style.left = `${this.property.position.x}px`;
        this.input.style.top = `${this.property.position.y}px`;
        this.input.style.color = this.property.color;
        this.input.style.width =
            this.property.cols * parseInt(this.property.fontSize, 10) / 2 +
            'px';
        this.input.setAttribute('rows', this.property.rows.toString());
        setTimeout(() => {
            this.property.width = this.input.offsetWidth;
            this.property.height = this.input.offsetHeight;
            if (this.isFocus) {
                this.input.setAttribute('tabIndex', '1');
                this.input.setAttribute('autofocus', 'true');
                this.input.focus();
            }
        }, 0);
        this.inputListener = (e: KeyboardEvent) => {
            this.property.text = (<HTMLInputElement>e.target).value;
            this.getTextInput();
            this.getSize();
        };
        this.inputBlurListener = (e: KeyboardEvent) => {
            this.property.text = (<HTMLInputElement>e.target).value;
            this.property.width = this.input.offsetWidth;
            this.property.height = this.input.offsetHeight;
            this.input.style.display = 'none';
            this.property.isEditor = false;
            config.emitter.emit('draw-all');

            if (this.property.text === '') {
                this.destroyed();
            }
        };
        this.input.addEventListener('input', this.inputListener);
        this.input.addEventListener('blur', this.inputBlurListener);

        config.wrap.appendChild(this.input);
    }

    hasBox() {
        return !!this.property.text;
    }

    event() {
        this.mouseDown = (e: MouseEvent) => {
            if (this.isFocus && this.hasBox() && inBox(e)) {
                this.mouse.mouseDown(this.getCursor(e));
            }
        };
        this.mouseMove = (e: MouseEvent) => {
            if (this.isFocus && !this.property.isEditor) {
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
        this.ctx.font = `${this.property.fontSize} ${this.property.fontFamily}`;
        const width = this.ctx.measureText(txt);
        this.ctx.restore();
        return width;
    }

    drawText() {
        const getHeight = () => {
            this.ctx.save();
            this.ctx.font = `${this.property.fontSize} ${
                this.property.fontFamily
            }`;
            const height = this.ctx.measureText('w').width * 2;
            return height;
        };
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.property.color;
        this.ctx.font = `${this.property.fontSize} ${this.property.fontFamily}`;
        for (let i = 0; i < this.property.txts.length; i++) {
            this.ctx.fillText(
                this.property.txts[i],
                this.property.position.x + 1 + 10,
                // this.property.position.y - 6 + getHeight() * (i + 1) + 10,
                this.property.position.y - 4 + getHeight() * (i + 1) + 10,
            );
        }
        this.ctx.restore();
    }

    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        if (this.isFocus && this.property.text) {
            this.ctx.lineWidth = this.property.borderWidth;
            this.ctx.strokeStyle = this.property.borderColor;
            this.ctx.strokeRect(
                this.property.position.x,
                this.property.position.y,
                this.property.width,
                this.property.height,
            );
        }

        this.ctx.closePath();
        this.ctx.restore();

        if (!this.property.isEditor) {
            this.drawText();
        }
    }

    keyCodeListener() {
        this.keyUp = (e: KeyboardEvent) => {
            if (e.keyCode === 8) {
                // 删除
                if (this.isFocus && !this.property.isEditor) {
                    this.destroyed();
                    config.emitter.emit('draw-all');
                }
            }
        };
        config.emitter.on('keyup', this.keyUp);
    }

    destroyed() {
        super.destroyed();
        this.input.removeEventListener('input', this.inputListener);
        this.input.removeEventListener('blur', this.inputBlurListener);
    }
}
