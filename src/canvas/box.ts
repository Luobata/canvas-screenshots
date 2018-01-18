import { dragCircle, Rect } from 'LIB/interface';
import Rectangular from 'INSERT/rectangular';
import { config } from './config';
import { getCircleMap } from 'LIB/help';
import Mouse from './mouse';
import Cursor from './cursor';
import { Readable } from 'stream';

const ee = require('event-emitter');
const boxEmitter = new ee();

// 插入功能
enum insertFunction {
    rectangular,
    circle,
    arrow,
    text,
}
export default class Box {
    ctx: CanvasRenderingContext2D;
    circles: Array<dragCircle>;
    content: Set<Rectangular>;
    rect?: Rect;
    cursorStyle: string;
    isFocus: Boolean;
    isShowCircle: Boolean;
    lineWidth: number;
    borderRadious: number;
    circleWidth: number;
    mouse: Mouse;
    cursor: Cursor;

    currentFun?: string;

    constructor(ctx: CanvasRenderingContext2D, cursorStyle: string) {
        this.ctx = ctx;
        this.cursorStyle = cursorStyle;
        this.isFocus = true;
        this.isShowCircle = false;
        this.initBox();
        this.lineWidth = 1;
        this.borderRadious = 1;
        this.circleWidth = 3;
        // 测试设定默认值
        this.currentFun = insertFunction[0];
        this.events();
        this.listenMouse();
        this.mouse = new Mouse(this, boxEmitter);
        this.cursor = new Cursor(this);
        this.content = new Set();
        this.drawAll();
    }

    events() {
        config.emitter.on('end-mousedown', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(e, this.cursor.getCursor(e, 'eve'));
            }
        });
        config.emitter.on('end-mousemove', e => {
            if (this.isFocus && this.hasBox()) {
                this.cursorStyle = this.cursor.getCursor(e);
                config.emitter.emit('cursor-change', this.cursorStyle);
                this.mouse.mouseMove(e);
            }
        });

        config.emitter.on('end-mouseup', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseUp(e);
            }
        });

        boxEmitter.on('draw', () => {});
        boxEmitter.on('shot', () => {
            config.emitter.emit('shot');
        });
    }

    initBox() {
        this.rect = {
            startX: undefined,
            startY: undefined,
            endX: undefined,
            endY: undefined,
        };
    }

    hasBox() {
        return !!(
            this.rect.startX !== undefined &&
            this.rect.startY !== undefined &&
            this.rect.endX !== undefined &&
            this.rect.endY !== undefined
        );
    }

    inBox(positionX: number, positionY: number): boolean {
        const inX = (): boolean => {
            if (this.rect.startX < this.rect.endX) {
                return (
                    positionX >= this.rect.startX && positionX <= this.rect.endX
                );
            } else {
                return (
                    positionX <= this.rect.startX && positionX >= this.rect.endX
                );
            }
        };
        const inY = (): boolean => {
            if (this.rect.startY < this.rect.endY) {
                return (
                    positionY >= this.rect.startY && positionY <= this.rect.endY
                );
            } else {
                return (
                    positionY <= this.rect.startY && positionY >= this.rect.endY
                );
            }
        };
        return inX() && inY();
    }

    setPosition(rect: Rect, isDraw = false) {
        Object.assign(this.rect, rect);

        if (isDraw) {
            //this.draw();
            config.emitter.emit('draw-all');
        }
    }

    focusRectangular(e: MouseEvent) {
        let focusItem;
        for (let i of this.content) {
            //if (i.inBox(e.clientX, e.clientY, 10)) {
            if (i.inBoxBorder(e.clientX, e.clientY)) {
                //i.isFocus = true;
                focusItem = i;
            } else {
                //i.isFocus = false;
            }
        }

        return focusItem;
    }

    outFocus(item?: Rectangular) {
        for (let i of this.content) {
            if (!(item && item === i)) {
                i.isFocus = false;
            } else {
                i.isFocus = true;
            }
        }
        config.emitter.emit('draw-all');
    }

    listenMouse() {
        switch (this.currentFun) {
            case 'rectangular':
                let newItem: Rectangular | null;
                let position = {
                    startX: -1,
                    startY: -1,
                };
                config.emitter.on('mousedown', e => {
                    if (this.isFocus) return;
                    if (!this.inBox(e.clientX, e.clientY)) return;
                    if (!this.content.size) {
                        position = {
                            startX: e.clientX,
                            startY: e.clientY,
                        };
                    } else {
                        const item = this.focusRectangular(e);
                        if (item) {
                            newItem = item;
                            this.outFocus(item);
                        } else {
                            this.outFocus();
                            position = { startX: e.clientX, startY: e.clientY };
                        }
                    }
                });
                config.emitter.on('mousemove', e => {
                    if (this.isFocus) return;
                    if (!this.inBox(e.clientX, e.clientY)) return;
                    if (newItem) {
                        if (position.startX !== -1) {
                            newItem.setPosition(
                                {
                                    endX: e.clientX,
                                    endY: e.clientY,
                                },
                                true,
                            );
                        }
                    } else if (position.startX !== -1) {
                        newItem = new Rectangular(this.ctx);
                        this.content.add(newItem);
                        newItem.setPosition(
                            {
                                startX: position.startX,
                                startY: position.startY,
                                endX: e.clientX,
                                endY: e.clientY,
                            },
                            true,
                        );
                    } else {
                        // 不操作 等待元素自己监听mousemove
                    }
                });
                config.emitter.on('mouseup', e => {
                    if (this.isFocus) return;
                    if (!this.inBox(e.clientX, e.clientY)) return;
                    position.startX = -1;
                    newItem = null;
                });
                break;
            default:
                break;
        }
    }

    draw() {
        if (this.hasBox()) {
            this.ctx.clearRect(
                this.rect.startX,
                this.rect.startY,
                this.rect.endX - this.rect.startX,
                this.rect.endY - this.rect.startY,
            );
        }

        if (this.isFocus && this.isShowCircle) {
            this.drawCircle();
        }

        for (let i of this.content) {
            i.draw();
        }
    }
    drawAll() {
        config.emitter.on('draw-all', () => {
            this.draw();
        });
    }

    drawCircle() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = 'black';
        // boder
        this.ctx.moveTo(
            this.rect.startX - this.lineWidth,
            this.rect.startY - this.lineWidth,
        );
        this.ctx.lineTo(
            this.rect.endX + this.lineWidth,
            this.rect.startY - this.lineWidth,
        );
        this.ctx.lineTo(
            this.rect.endX + this.lineWidth,
            this.rect.endY + this.lineWidth,
        );
        this.ctx.lineTo(
            this.rect.startX - this.lineWidth,
            this.rect.endY + this.lineWidth,
        );
        this.ctx.lineTo(
            this.rect.startX - this.lineWidth,
            this.rect.startY - this.lineWidth,
        );
        this.ctx.restore();
        this.ctx.stroke();

        const circleMap = getCircleMap(this.rect, this.lineWidth);
        this.circles = circleMap;

        for (let i of circleMap) {
            this.ctx.beginPath();
            this.ctx.fillStyle = 'black';
            this.ctx.arc(i.x, i.y, this.circleWidth, 0, Math.PI * 2, true);
            this.ctx.stroke();
            this.ctx.fillStyle = 'white';
            this.ctx.fill();
        }
    }
}
