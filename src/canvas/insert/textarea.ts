/**
 * @description text
 */
import { config, inBox } from 'Canvas/config';
import logger from 'Canvas/log';
import Content from 'INSERT/content';
import Mouse from 'INSERT/mouse-text';
import { pointInRectangular } from 'LIB/geometric';
import { Position } from 'LIB/interface';
import { isChinese } from 'LIB/reg';
let inputDiv: HTMLDivElement;

const getStrLength: Function = (str: string): number => {
    // tslint:disable no-inner-html
    // inputDiv.innerHTML = <string>new String(str.replace(/[ ]/g, '&nbsp;'));
    inputDiv.innerHTML = str.replace(/[ ]/g, '&nbsp;');
    // tslint:enable no-inner-html
    let len: number = 0;
    for (const i of str) {
        len += isChinese(i) ? 2 : 1;
    }

    return inputDiv.getBoundingClientRect().width;
};

const getMaxStrIndex: Function = (
    str: string,
    begin: number,
    max: number,
): number => {
    let num: number = 0;
    for (let i: number = begin; i <= str.length; i = i + 1) {
        if (getStrLength(str.slice(begin, i)) <= max) {
            num = i - begin;
        } else {
            break;
        }
    }

    return num;
};

interface Iproperty {
    position: Position;
    text: string;
    txts: string[];
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
}

/**
 * default class
 */
export default class SText extends Content {
    public property: Iproperty;

    private input: HTMLTextAreaElement;
    private inputListener: EventListener;
    private inputBlurListener: EventListener;
    private mouse: Mouse;

    constructor(ctx: CanvasRenderingContext2D, pos: Position, color: string) {
        super(ctx);
        this.property = {
            position: pos,
            color: color || 'red',
            borderColor: '#fff',
            borderWidth: 2,
            text: '',
            cols: 1,
            rows: 1,
            txts: [],
            fontSize: '20px',
            fontFamily: 'monospace',
        };
        this.initTextArea();
        this.event();
        this.mouse = new Mouse(this);
        this.getMaxCols();
    }

    public setColor(color: string): void {
        this.input.style.color = color;
        super.setColor(color);
    }

    public getCursor(e: MouseEvent): string {
        let result: string = 'crosshair';
        if (this.inBoxBorder(e.clientX, e.clientY)) {
            result = 'all-scroll';
        }

        return result;
    }

    public move(x: number, y: number): void {
        this.property.position.x += x;
        this.property.position.y += y;

        config.emitter.emit('draw-all');
    }

    public focus(): void {
        this.property.isEditor = true;
        this.input.style.left = `${this.property.position.x}px`;
        this.input.style.top = `${this.property.position.y}px`;
        this.input.style.display = 'block';
        // 同时操作display 与input 会触发blur
        setTimeout(() => {
            this.input.value = this.property.text;
            this.getMaxCols();
            this.input.focus();
        }, 0);

        config.emitter.emit('draw-all');
    }

    public inBoxBorder(x: number, y: number): boolean {
        const p1: Position = {
            x: this.property.position.x,
            y: this.property.position.y,
        };
        const p2: Position = {
            x: this.property.position.x + this.property.width,
            y: this.property.position.y,
        };
        const p3: Position = {
            x: this.property.position.x,
            y: this.property.position.y + this.property.height,
        };
        const p4: Position = {
            x: this.property.position.x + this.property.width,
            y: this.property.position.y + this.property.height,
        };
        const p: Position = {
            x,
            y,
        };

        return !!pointInRectangular(p1, p2, p3, p4, p);
    }

    public getMaxCols(): void {
        setTimeout(() => {
            // 20 = padding-left + paddin-right
            const num: number =
                config.boxRect.endX - this.property.position.x - 20;
            this.property.maxCols = num;
        }, 0);
    }

    public hasBox(): boolean {
        return !!this.property.text;
    }

    public event(): void {
        this.mouseDown = (e: MouseEvent): void => {
            if (this.isFocus && this.hasBox() && inBox(e)) {
                this.mouse.mouseDown(this.getCursor(e));
            }
        };
        this.mouseMove = (e: MouseEvent): void => {
            if (this.isFocus && !this.property.isEditor) {
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

    public draw(): void {
        this.ctx.save();
        this.ctx.beginPath();
        if (this.isFocus && !this.property.isEditor) {
            this.ctx.lineWidth = this.property.borderWidth * config.rate;
            this.ctx.strokeStyle = this.property.borderColor;
            this.ctx.strokeRect(
                config.rate * this.property.position.x,
                config.rate * this.property.position.y,
                config.rate * this.property.width,
                config.rate * this.property.height,
            );
        }

        this.ctx.closePath();
        this.ctx.restore();

        if (!this.property.isEditor) {
            this.drawText();
        }
    }

    public keyCodeListener(): void {
        this.keyUp = (e: KeyboardEvent): void => {
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

    public destroyed(): void {
        super.destroyed();
        this.input.removeEventListener('input', this.inputListener);
        this.input.removeEventListener('blur', this.inputBlurListener);
        this.input.remove();
    }

    private getSize(): void {
        setTimeout(() => {
            this.property.width = this.input.offsetWidth;
            this.property.height = this.input.offsetHeight;
        }, 0);
    }

    private getTextInput(): void {
        const rows: string[] = this.property.text.split('\n');
        const cols: string[] = [];
        let maxCols: number = 0;
        for (const i of rows) {
            const length: number = getStrLength(i);
            // logger(length);
            if (length > maxCols) {
                maxCols =
                    length > this.property.maxCols
                        ? this.property.maxCols
                        : length;
                if (length > this.property.maxCols) {
                    // 当前行超过最大宽度
                    let k: number = 0;
                    let j: number = 0;
                    while (k < i.length) {
                        j = getMaxStrIndex(i, k, this.property.maxCols);
                        const strObj: string = i.substr(k, j);
                        cols.push(strObj);
                        k += j;
                        // logger(k, j);
                    }
                } else {
                    cols.push(i);
                }
            } else {
                cols.push(i);
            }
        }
        this.property.txts = cols;
        this.input.style.width = `${maxCols.toString()}px`;
        this.input.setAttribute('rows', cols.length.toString());
    }

    private initTextArea(): void {
        this.property.isEditor = true;
        this.input = <HTMLTextAreaElement>document.createElement('textArea');
        if (!inputDiv) {
            inputDiv = document.createElement('div');
            inputDiv.style.position = 'absolute';
            inputDiv.style.display = 'inline-block';
            inputDiv.style.visibility = 'hidden';
            inputDiv.style.fontSize = this.property.fontSize;
            inputDiv.style.fontFamily = this.property.fontFamily;
            config.wrap.appendChild(inputDiv);
        }
        this.input.className = 'function-text';
        this.input.className += ` ${config.platform}`;
        this.input.style.left = `${this.property.position.x}px`;
        this.input.style.top = `${this.property.position.y}px`;
        this.input.style.color = this.property.color;
        this.input.style.fontSize = this.property.fontSize;
        this.input.style.fontFamily = this.property.fontFamily;
        this.input.style.border = `${this.property.borderWidth} solid ${
            this.property.borderColor
        }`;
        this.input.style.width = `${(
            this.property.cols *
            parseInt(this.property.fontSize, 10) /
            2
        ).toString()}px`;
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
        this.inputListener = (e: KeyboardEvent): void => {
            this.property.text = (<HTMLInputElement>e.target).value;
            this.getTextInput();
            this.getSize();
        };
        this.inputBlurListener = (e: KeyboardEvent): void => {
            logger('blur');
            this.property.text = (<HTMLInputElement>e.target).value;
            this.property.width = this.input.offsetWidth;
            this.property.height = this.input.offsetHeight;
            this.input.style.display = 'none';
            this.property.isEditor = false;
            config.emitter.emit('draw-all');

            if (this.property.text === '') {
                this.destroyed();
            } else {
                if (
                    !this.saveArray.length ||
                    this.property.text !==
                        this.saveArray[this.saveArray.length - 1].text
                ) {
                    this.save();
                    config.emitter.emit('addSave', this);
                }
            }
        };
        this.input.addEventListener('input', this.inputListener);
        this.input.addEventListener('blur', this.inputBlurListener);

        config.wrap.appendChild(this.input);
    }

    private drawText(): void {
        const getLineHeight: Function = (): number => {
            this.ctx.save();
            this.ctx.font = `${this.property.fontSize} ${
                this.property.fontFamily
            }`;
            // const height: number = this.ctx.measureText('w').width * 1.7;

            return parseInt(this.property.fontSize, 10);
        };
        const size: string = `${(
            parseInt(this.property.fontSize, 10) * config.rate
        ).toString()}px`;
        const lineHeight: number = getLineHeight();
        // const fixMargin = config.platform === 'windows' ? 1 : -1;
        const fixMargin: number = 1;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.property.color;
        this.ctx.font = `${size} ${this.property.fontFamily}`;
        this.ctx.textBaseline = 'top';
        this.ctx.textBaseline = 'middle';
        for (let i: number = 0; i < this.property.txts.length; i = i + 1) {
            this.ctx.fillText(
                this.property.txts[i],
                config.rate * (this.property.position.x + 1 + 10),
                config.rate *
                    (this.property.position.y +
                        lineHeight * i +
                        lineHeight / 2 +
                        10 +
                        fixMargin),
            );
        }
        this.ctx.restore();
    }
}
