import { dragCircle, Rect } from 'LIB/interface';
import { config, inBox } from '../config';
import { getCircleMap } from 'LIB/help';
import { EventEmitter } from 'events';

const circlePath = 10; // 手势范围 认为这个范围内就是可以使用新手势
const inCircle = (
    x: number,
    y: number,
    positionX: number,
    positinY: number,
): boolean => {
    return !!(
        Math.pow(x - positionX, 2) + Math.pow(y - positinY, 2) <=
        Math.pow(circlePath, 2)
    );
};

export default class {
    id: number;
    ctx: CanvasRenderingContext2D;
    // mouse: Mouse;
    isFocus: boolean; // 是否聚焦 聚焦才会展示可拖动点
    mouseDown: EventListener;
    mouseMove: EventListener;
    mouseUp: EventListener;

    property: any;
    saveArray: Array<any>;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.id = config.uid++;

        this.isFocus = true;
        this.saveArray = [];
    }

    save() {
        this.saveArray.push(JSON.parse(JSON.stringify(this.property)));
    }

    back() {
        if (this.saveArray.length) {
            this.saveArray.pop();
            this.property = this.saveArray[this.saveArray.length - 1];
        }
        if (!this.property) {
            this.destroyed();
        }
    }

    destroyed() {
        config.emitter.off('mousedown', this.mouseDown);
        config.emitter.off('mousemove', this.mouseMove);
        config.emitter.off('mouseup', this.mouseUp);
        config.emitter.emit('removeItem', this);
    }

    setColor(color: string) {
        this.property.color = color;
        this.save();
        config.emitter.emit('draw-all');
    }

    setPosition(rect: Rect, isDraw = false) {
        // Rectangular circle arrow
        Object.assign(this.property.rect, rect);

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    getCursor(e: MouseEvent, type?: string) {
        let result = 'crosshair'; // 判断鼠标位置结果 默认即crosshair
        for (let i of this.property.circles) {
            if (inCircle(i.x, i.y, e.clientX, e.clientY)) {
                // 在这个范围内 对应的手势图标
                //result = `${i.cssPosition}-resize`;
                if (type === 'eve') {
                    result = `${i.cssPositionEve}-resize`;
                } else {
                    result = `${i.cssPosition}-resize`;
                }
            }
        }
        if (result === 'crosshair') {
            // 如果还是十字 如果在边上 则可以拖动
            if (this.inBoxBorder(e.clientX, e.clientY)) {
                result = 'all-scroll';
            }
        }

        return result;
    }

    init() {}

    event() {}

    initBox() {}

    hasBox() {}

    inBoxBorder(positionX: number, positionY: number) {}

    inBox(positionX: number, positionY: number, circlePath = 0) {}

    draw() {}
}
