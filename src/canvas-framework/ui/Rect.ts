import { Rect, Events } from '../util/interface';
import { config } from '../util/config';

export default class Rectangular {
    id: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    rect: Rect; // 坐标点
    focus: boolean; // 当前元素获取焦点中
    isStroke: boolean; // 是否空心 即只有border
    backgroundColor: string; // background-color
    borderWidth: number;
    borderRadious: number;
    borderColor: string;

    constructor(canvas: HTMLCanvasElement) {
        this.id = config.uid++;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.focus = false;
        this.isStroke = false;
        this.backgroundColor = 'black';
        this.borderColor = 'black';
        this.borderWidth = 1;
        this.borderRadious = 0;
    }

    draw() {
        this.ctx.save();

        this.ctx.beginPath();

        if (!this.isStroke) {
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(
                this.rect.startX,
                this.rect.startY,
                this.rect.endX - this.rect.startX,
                this.rect.endY - this.rect.startY,
            );
        }
        if (this.borderWidth > 0) {
            // 画border
            this.ctx.lineWidth = this.borderWidth;
            this.ctx.moveTo(
                this.rect.startX - this.borderWidth,
                this.rect.startY - this.borderWidth,
            );
            this.ctx.lineTo(
                this.rect.endX + this.borderWidth,
                this.rect.startY - this.borderWidth,
            );
            this.ctx.lineTo(
                this.rect.endX + this.borderWidth,
                this.rect.endY + this.borderWidth,
            );
            this.ctx.lineTo(
                this.rect.startX - this.borderWidth,
                this.rect.endY + this.borderWidth,
            );
            this.ctx.lineTo(
                this.rect.startX - this.borderWidth,
                this.rect.startY - this.borderWidth,
            );
            this.ctx.strokeStyle = this.borderColor;
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    isShow() {
        return !!(
            this.rect.startX !== undefined &&
            this.rect.startY !== undefined &&
            this.rect.endX !== undefined &&
            this.rect.endY !== undefined
        );
    }

    eventListener(events: Array<Events>) {
        // 事件分发 分为鼠标事件 键盘事件 touch事件
        // https://developer.mozilla.org/zh-CN/docs/Web/API/CompositionEvent realted pages for dom events
        for (let i of events) {
            if (i.type.match(/^mouse.*?$/)) {
                this.canvas.addEventListener(
                    i.type,
                    (e: MouseEvent, ...rest: any[]) => {
                        if (this.inMouseArea(e)) {
                            i.callback(e, ...rest);
                        }
                    },
                );
            }

            if (i.type.match(/^key/)) {
                this.canvas.addEventListener(i.type, (...rest: any[]) => {
                    if (this.focus) {
                        i.callback(...rest);
                    }
                });
            }
        }
    }

    inMouseArea(e: MouseEvent): boolean {
        if (!this.isShow()) return false;

        return !!(
            e.clientX >= this.rect.startX &&
            e.clientX <= this.rect.endX &&
            e.clientY >= this.rect.startY &&
            e.clientY <= this.rect.endY
        );
    }
}
