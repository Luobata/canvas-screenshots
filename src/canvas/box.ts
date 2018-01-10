import { dragCircle, Rect } from 'LIB/interface';
import Rectangular from 'INSERT/rectangular';
import { config } from './config';
import { getCircleMap } from 'LIB/help';
import Mouse from './mouse';
import Cursor from './cursor';

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
    circles: Array<dragCircle>;
    rect?: Rect;
    //startX: number;
    //startY: number;
    //endX: number;
    //endY: number;
    cursorStyle: string;
    isFocus: Boolean;

    lineWidth: number;
    borderRadious: number;
    circleWidth: number;
    mouse: Mouse;
    cursor: Cursor;

    currentFun?: string;

    constructor(cursorStyle: string) {
        this.cursorStyle = cursorStyle;
        this.isFocus = true;
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
        //new Rectangular();
        // addEventListener 但是不能给当前模块加 canvas元素的event 只能靠穿透 能否从框架层面解决问题
    }

    events() {
        config.emitter.on('end-mousedown', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseDown(e, this.cursorStyle);
            }
        });
        config.emitter.on('end-mousemove', e => {
            if (this.isFocus && this.hasBox()) {
                this.cursorStyle = this.cursor.getCursor(e);
                this.mouse.mouseMove(e);
            }
        });

        config.emitter.on('end-mouseup', e => {
            if (this.isFocus && this.hasBox()) {
                this.mouse.mouseUp(e);
            }
        });

        boxEmitter.on('draw', () => {
            const circleMap = getCircleMap(this.rect, this.lineWidth);
            this.circles = circleMap;
        });
    }

    initBox() {
        this.rect.startX = undefined;
        this.rect.startY = undefined;
        this.rect.endX = undefined;
        this.rect.endY = undefined;
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
        return !!(
            positionX >= this.rect.startX &&
            positionX <= this.rect.endX &&
            positionY >= this.rect.startY &&
            positionY <= this.rect.endY
        );
    }

    //setPosition({ startX = -1, startY = -1, endX = -1, endY = -1 }) {
    //    if (startX !== -1) {
    //        this.startX = startX;
    //    }
    //    if (startY !== -1) {
    //        this.startY = startY;
    //    }
    //    if (endX !== -1) {
    //        this.endX = endX;
    //    }
    //    if (endY !== -1) {
    //        this.endY = endY;
    //    }
    //}
    setPosition(rect: Rect, isDraw = false) {
        this.rect = rect;

        if (isDraw) {
            this.draw();
        }
    }

    listenMouse() {
        let hasTrajectory = false;
        config.emitter.on('mousedown', e => {
            if (this.isFocus) return;
            if (!this.inBox(e.clientX, e.clientY)) return;

            console.log(this.currentFun);
        });
    }

    draw() {}
}
