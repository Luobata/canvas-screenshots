import { dragCircle, Rect } from 'LIB/interface';
import Rectangular from 'INSERT/rectangular';
import Circle from 'INSERT/circle';
import Arrow from 'INSERT/arrow';
import Pen from 'INSERT/pen';
import Text from 'INSERT/text';
import Mosaic from 'INSERT/mosaic';
import { config } from './config';
import { getCircleMap } from 'LIB/help';
import Mouse from './mouse';
import Cursor from './cursor';
import { Readable } from 'stream';
import { domEach } from 'LIB/dom';

// Content 为基础类型集合 sContent为优先渲染的集合
type Content = Rectangular | Circle | Arrow | Pen | Text;
type sContent = Mosaic;

const ee = require('event-emitter');
const boxEmitter = new ee();

let globalMosaic: Mosaic;

// 插入功能
enum insertFunction {
    rectangular,
    circle,
    arrow,
    pen,
    text,
}
export default class Box {
    ctx: CanvasRenderingContext2D;
    transctx: CanvasRenderingContext2D;
    offCtx: CanvasRenderingContext2D; //离屏canvas
    circles: Array<dragCircle>;
    content: Set<Content>;
    sContent: Array<sContent>;
    rect?: Rect;
    cursorStyle: string;
    isFocus: Boolean;
    isShowCircle: Boolean;
    lineWidth: number;
    borderRadious: number;
    circleWidth: number;
    mouse: Mouse;
    cursor: Cursor;
    functionBox: HTMLDivElement;
    childSaveArray: Array<Content | sContent>;

    currentFun?: string;
    colorFun?: string;
    focusItem: Content | null;

    constructor(
        ctx: CanvasRenderingContext2D,
        offCtx: CanvasRenderingContext2D,
        transctx: CanvasRenderingContext2D,
        cursorStyle: string,
        functionBox: HTMLDivElement,
    ) {
        const that = this;
        this.ctx = ctx;
        this.transctx = transctx;
        this.offCtx = offCtx;
        this.cursorStyle = cursorStyle;
        this.isFocus = true;
        this.isShowCircle = false;
        this.initBox();
        this.lineWidth = 1;
        this.borderRadious = 1;
        this.circleWidth = 3;
        this.events();
        this.listenMouse();
        this.mouse = new Mouse(this, boxEmitter);
        this.cursor = new Cursor(this);
        this.content = new Set();
        this.sContent = [];
        this.drawAll();
        this.functionBox = functionBox;
        this.childSaveArray = [];

        const items = this.functionBox.querySelectorAll('.box-item');
        const childWrap = this.functionBox.querySelector(
            '.function-box-child',
        ) as HTMLElement;
        const colorWrap = this.functionBox.querySelector(
            '.color-wrap',
        ) as HTMLElement;
        const colorItem = colorWrap.querySelectorAll('.color-item');
        const childBoxContent = [
            'rectangular',
            'circle',
            'arrow',
            'pen',
            'text',
        ];

        Array.prototype.forEach.call(items, (v: HTMLElement) => {
            v.addEventListener('click', function() {
                that.currentFun = this.getAttribute('type');
                Array.prototype.forEach.call(items, function(
                    v: HTMLElement,
                    i: number,
                ) {
                    items[i].className = items[i].className.replace(
                        'active',
                        '',
                    );
                });
                if (childBoxContent.indexOf(that.currentFun) !== -1) {
                    this.className += ' active';
                    childWrap.style.display = 'inline-block';
                } else {
                    childWrap.style.display = 'none';
                }
                if (that.currentFun === 'back') {
                    that.back();
                }
                if (that.currentFun === 'close') {
                    that.destroyed();
                    config.emitter.emit('destoryed');
                }
                config.emitter.emit('blur');
            });
        });

        Array.prototype.forEach.call(colorItem, (v: HTMLElement) => {
            v.addEventListener('click', function() {
                domEach(colorItem, (v: HTMLElement, i: number) => {
                    colorItem[i].className = colorItem[i].className.replace(
                        'active',
                        '',
                    );
                });
                this.className += ' active';
                that.colorFun = this.getAttribute('color');
                that.focusItem = that.findFocus();
                if (that.focusItem) {
                    that.focusItem.setColor(that.colorFun);
                    that.childSaveArray.push(that.focusItem);
                }
            });
        });
        that.colorFun = colorItem[0].getAttribute('color');
        colorItem[0].className += ' active';
    }

    back() {
        const item = this.childSaveArray.pop();

        if (!item) return;
        item.back();
        config.emitter.emit('draw-all');
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

        config.emitter.on('removeItem', (item: Content) => {
            this.content.delete(item);
            for (let i = 0; i < this.childSaveArray.length; ) {
                const child = this.childSaveArray[i];
                if (child === item) {
                    this.childSaveArray.splice(i, 1);
                } else {
                    i++;
                }
            }
        });

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
            config.emitter.emit('draw-all');
        }
    }

    focusRectangular(e: MouseEvent) {
        let focusItem;
        if (this.inBox(e.clientX, e.clientY)) {
            for (let i of this.content) {
                if (i.inBoxBorder(e.clientX, e.clientY)) {
                    focusItem = i;
                } else {
                }
            }
        }

        return focusItem;
    }

    outFocus(item?: Content) {
        // 把该item的位置放到最后
        let topItem; // 选中item放入最上层
        let blurItem; // 判断是否有原宿blur
        for (let i of this.content) {
            if (!(item && item === i)) {
                if (i.isFocus) {
                    blurItem = i;
                    i.isFocus = false;
                }
            } else {
                i.isFocus = true;
                this.content.delete(i);
                topItem = i;
            }
        }
        if (topItem) this.content.add(topItem);
        config.emitter.emit('draw-all');

        return blurItem;
    }

    findFocus() {
        for (let i of this.content) {
            if (i.isFocus) {
                return i;
            }
        }

        return null;
    }

    cursorChange(e: MouseEvent) {
        let cursor = 'crosshair';
        if (this.inBox(e.clientX, e.clientY)) {
            for (let i of this.content) {
                if (i.inBoxBorder(e.clientX, e.clientY)) {
                    cursor = i.getCursor(e);
                }
            }
        }

        config.emitter.emit('cursor-change', cursor);

        return cursor;
    }

    listenMouse() {
        let newItem: Content | sContent | null;
        let position = {
            startX: -1,
            startY: -1,
        };
        config.emitter.on('mousedown', (e: MouseEvent) => {
            if (this.isFocus) return;
            if (!this.inBox(e.clientX, e.clientY)) {
                return;
            }
            const setPosition = (hasBlur = false) => {
                position = {
                    startX: e.clientX,
                    startY: e.clientY,
                };
                if (!hasBlur) {
                    if (this.currentFun === 'text') {
                        newItem = new Text(this.offCtx, {
                            x: position.startX,
                            y: position.startY,
                        });
                        this.content.add(newItem);
                        config.emitter.emit('draw-all');
                    } else if (this.currentFun === 'mosaic') {
                        if (globalMosaic) {
                            newItem = globalMosaic;
                            newItem.addPosition(
                                {
                                    x: position.startX,
                                    y: position.startY,
                                },
                                true,
                            );
                        } else {
                            // newItem = new Mosaic(this.ctx, this.transctx, {
                            newItem = new Mosaic(this.offCtx, this.transctx, {
                                x: position.startX,
                                y: position.startY,
                            });
                            globalMosaic = newItem;
                            this.sContent.push(newItem);
                            config.emitter.emit('draw-all');
                        }
                    }
                }
            };
            if (!this.content.size) {
                setPosition();
            } else {
                // 鼠标位置是否有选中某个item
                const item = this.focusRectangular(e);
                if (item) {
                    // 有 操作该item
                    newItem = item;
                    this.outFocus(item);
                } else {
                    // 没有让所有item blur 如果有blur的元素 不创建新的 否则创建新的
                    const blurItem = this.outFocus();
                    setPosition(!!blurItem);
                }
            }
        });
        config.emitter.on('mousemove', (e: MouseEvent) => {
            if (this.isFocus) return;
            // if (!this.inBox(e.clientX, e.clientY)) return;
            this.cursorChange(e);
            if (newItem) {
                if (
                    newItem instanceof Rectangular ||
                    newItem instanceof Circle ||
                    newItem instanceof Arrow
                ) {
                    if (position.startX !== -1) {
                        newItem.setPosition(
                            {
                                endX: e.clientX,
                                endY: e.clientY,
                            },
                            true,
                        );
                    }
                } else if (newItem instanceof Pen) {
                    if (position.startX !== -1) {
                        newItem.addPosition(
                            {
                                x: e.clientX,
                                y: e.clientY,
                            },
                            true,
                        );
                    }
                } else if (newItem instanceof Mosaic) {
                    if (position.startX !== -1) {
                        newItem.addPosition(
                            {
                                x: e.clientX,
                                y: e.clientY,
                            },
                            true,
                        );
                    }
                }
            } else if (position.startX !== -1) {
                if (this.currentFun === 'rectangular') {
                    newItem = new Rectangular(this.offCtx, this.colorFun);
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
                } else if (this.currentFun === 'circle') {
                    newItem = new Circle(this.offCtx, this.colorFun);
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
                } else if (this.currentFun === 'arrow') {
                    newItem = new Arrow(this.offCtx, this.colorFun);
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
                } else if (this.currentFun === 'pen') {
                    newItem = new Pen(this.offCtx, this.colorFun);
                    this.content.add(newItem);
                    newItem.addPosition(
                        {
                            x: position.startX,
                            y: position.startY,
                        },
                        true,
                    );
                }
            } else {
                // 不操作 等待元素自己监听mousemove
            }
        });
        config.emitter.on('mouseup', (e: MouseEvent) => {
            if (this.isFocus) return;
            // if (!this.inBox(e.clientX, e.clientY)) return;
            const add = () => {
                newItem.save();
                this.childSaveArray.push(newItem);
            };
            if (newItem) {
                if (newItem instanceof Text) {
                    // 没有即增加
                    if (!newItem.saveArray.length) {
                        add();
                    } else {
                        // 如果有的话 输入内容和上一次不一样的即增加
                        const last =
                            newItem.saveArray[newItem.saveArray.length - 1];
                        if (last.text !== newItem.property.text) {
                            add();
                        }
                    }
                } else {
                    add();
                }
            }
            position.startX = -1;
            newItem = null;
        });
    }

    getData() {
        let data;
        // 要等i.draw之后才会回写ctx 所以ctx还是空的
        if (this.content.size || this.sContent.length) {
            // window.requestAnimationFrame(() => {
            for (let i of this.sContent) {
                i.draw();
            }
            for (let i of this.content) {
                i.draw();
            }
            // });
            data = this.offCtx.getImageData(
                this.rect.startX,
                this.rect.startY,
                this.rect.endX - this.rect.startX,
                this.rect.endY - this.rect.startY,
            );
        }

        return data;
    }

    draw(data?: ImageData) {
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

        if (data) {
            this.ctx.putImageData(data, this.rect.startX, this.rect.startY);
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

    destroyed() {
        this.functionBox.remove();
    }
}
