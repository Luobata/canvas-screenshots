import { dragCircle, Rect } from 'LIB/interface';
import FunctionBox from './function-box/';
import Rectangular from 'INSERT/rectangular';
import Circle from 'INSERT/circle';
import Arrow from 'INSERT/arrow';
import Pen from 'INSERT/pen';
import Text from 'INSERT/text';
import Mosaic from 'INSERT/mosaic';
import ImageInsert from 'INSERT/image';
import { config } from './config';
import { getCircleMap } from 'LIB/help';
import Mouse from './mouse';
import Cursor from './cursor';
import upload from 'LIB/upload';

// Content 为基础类型集合 sContent为优先渲染的集合
type Content = Rectangular | Circle | Arrow | Pen | Text | ImageInsert;
type sContent = Mosaic;

const ee = require('event-emitter');
const boxEmitter = new ee();

let globalMosaic: Mosaic;

export default class Box {
    ctx: CanvasRenderingContext2D;
    transctx: CanvasRenderingContext2D;
    offCanvas: HTMLCanvasElement;
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
    // functionBox: HTMLDivElement;
    functionBox: FunctionBox;
    childSaveArray: Array<Content | sContent>;
    paintList: Array<HTMLCanvasElement>;

    currentFun?: string;
    colorFun?: string;
    focusItem: Content | null;

    constructor(
        ctx: CanvasRenderingContext2D,
        offCanvas: HTMLCanvasElement,
        offCtx: CanvasRenderingContext2D,
        transctx: CanvasRenderingContext2D,
        cursorStyle: string,
        functionBox: HTMLDivElement,
    ) {
        this.ctx = ctx;
        this.transctx = transctx;
        this.offCanvas = offCanvas;
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
        // this.drawAll();
        this.functionBox = new FunctionBox(functionBox, this);
        this.childSaveArray = [];
        this.paintList = [];
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
            if (item instanceof Mosaic) {
                this.sContent.pop();
            } else {
                this.content.delete(item);
            }
            for (let i = 0; i < this.childSaveArray.length; ) {
                const child = this.childSaveArray[i];
                if (child === item) {
                    this.childSaveArray.splice(i, 1);
                } else {
                    i++;
                }
            }
        });

        config.emitter.on('addSave', (item: Content) => {
            this.childSaveArray.push(item);
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
                    if (
                        focusItem instanceof Rectangular ||
                        focusItem instanceof Circle ||
                        focusItem instanceof Arrow ||
                        focusItem instanceof Pen ||
                        focusItem instanceof Text
                    ) {
                        this.colorFun = i.property.color;
                        this.functionBox.setColor(this.colorFun);
                    }
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
                        // newItem = new Text(this.offCtx, {
                        const item = new Text(
                            this.offCtx,
                            {
                                x: position.startX,
                                y: position.startY,
                            },
                            this.colorFun,
                        );
                        position.startX = -1;
                        this.content.add(item);
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
                } else if (
                    newItem instanceof Pen ||
                    newItem instanceof Mosaic
                ) {
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
                const list = ['rectangular', 'circle', 'arrow'];
                if (list.indexOf(this.currentFun) !== -1) {
                    // 统一setPosition
                    if (this.currentFun === 'rectangular') {
                        newItem = new Rectangular(this.offCtx, this.colorFun);
                    } else if (this.currentFun === 'circle') {
                        newItem = new Circle(this.offCtx, this.colorFun);
                    } else if (this.currentFun === 'arrow') {
                        newItem = new Arrow(this.offCtx, this.colorFun);
                    }
                    this.content.add(<Content>newItem);
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
                    // addPosition
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
            const add = () => {
                newItem.save();
                this.childSaveArray.push(newItem);
            };
            if (newItem) {
                if (!(newItem instanceof Text)) {
                    add();
                }
            }
            position.startX = -1;
            newItem = null;
        });
    }

    uploadImage(e: Event) {
        const file = upload(e);
        if (file instanceof File) {
            const imageObj = new Image();
            const reader = new FileReader();
            const URL = window.URL;
            const maxWidth = config.width / 4 * 3;
            const maxHeight = config.height / 4 * 3;
            let width: number;
            let height: number;
            reader.onload = () => {
                const data = reader.result;

                imageObj.onload = () => {
                    width = imageObj.width;
                    height = imageObj.height;
                    if (width / height >= config.width / config.height) {
                        // 宽度 截断
                        if (width >= maxWidth) {
                            height = height / (width / maxWidth);
                            width = maxWidth;
                        }
                    } else {
                        if (height >= maxHeight) {
                            width = width / (height / maxHeight);
                            height = maxHeight;
                        }
                    }
                    URL.revokeObjectURL(imageObj.src);
                    const image = new ImageInsert(
                        this.offCtx,
                        imageObj,
                        // data,
                        width,
                        height,
                    );
                    this.content.add(image);
                    this.childSaveArray.push(image);
                    config.emitter.emit('draw-all');
                };
                imageObj.src = data;
            };
            reader.readAsDataURL(file);
        } else {
            config.emitter.emit('image-fail', file);
        }
    }

    getData() {
        let data;
        // 要等i.draw之后才会回写ctx 所以ctx还是空的
        if (this.content.size || this.sContent.length) {
            for (let i of this.sContent) {
                i.draw();
            }
            for (let i of this.content) {
                i.draw();
            }
            data = this.offCanvas;
        }

        return data;
    }

    painter(data?: HTMLCanvasElement) {
        let frame: HTMLCanvasElement;
        if (data) this.paintList.push(data);

        if (this.paintList.length > 1) return;
        window.requestAnimationFrame(() => {
            // 先paint 然后再出队列
            frame = this.paintList.slice(0, 1)[0];
            this.ctx.drawImage(
                frame,
                this.rect.startX,
                this.rect.startY,
                this.rect.endX - this.rect.startX,
                this.rect.endY - this.rect.startY,
                this.rect.startX,
                this.rect.startY,
                this.rect.endX - this.rect.startX,
                this.rect.endY - this.rect.startY,
            );
            this.paintList.shift();
            if (this.paintList.length) {
                this.painter();
            }
        });
    }

    draw(data?: HTMLCanvasElement) {
        if (this.hasBox()) {
            this.ctx.clearRect(
                this.rect.startX * config.rate,
                this.rect.startY * config.rate,
                (this.rect.endX - this.rect.startX) * config.rate,
                (this.rect.endY - this.rect.startY) * config.rate,
            );
        }

        if (this.isFocus && this.isShowCircle) {
            this.drawCircle();
        }

        if (data) {
            this.painter(data);
        }
    }
    drawAll() {
        // config.emitter.on('draw-all', () => {
        //     this.draw();
        // });
    }

    drawCircle() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = 'black';
        // boder
        this.ctx.strokeRect(
            (this.rect.startX - this.lineWidth) * config.rate,
            (this.rect.startY - this.lineWidth) * config.rate,
            (this.rect.endX - this.rect.startX + this.lineWidth * 2) *
                config.rate,
            (this.rect.endY - this.rect.startY + this.lineWidth * 2) *
                config.rate,
        );

        const circleMap = getCircleMap(this.rect, this.lineWidth);
        this.circles = circleMap;

        for (let i of circleMap) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'black';
            this.ctx.arc(
                i.x * config.rate,
                i.y * config.rate,
                this.circleWidth * config.rate,
                0,
                Math.PI * 2,
                true,
            );
            this.ctx.stroke();
            this.ctx.fillStyle = 'white';
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    allBlur() {
        for (let i of this.content) {
            i.isFocus = false;
        }
        config.emitter.emit('draw-all');
    }

    destroyed() {
        this.functionBox.remove();
    }
}
