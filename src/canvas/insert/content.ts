/**
 * @description content
 */
import { config, inBox } from 'Canvas/config';
import logger from 'Canvas/log';
import { EventEmitter } from 'events';
import { getCircleMap } from 'LIB/help';
import { DragCircle, Rect } from 'LIB/interface';

const circlePath: number = 10; // 手势范围 认为这个范围内就是可以使用新手势
const inCircle: Function = (
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

export default class Content {
    public id: number;
    public name: string;
    public isFocus: boolean; // 是否聚焦 聚焦才会展示可拖动点
    public property: any;
    public saveArray: any[];
    // mouse: Mouse;
    public ctx: CanvasRenderingContext2D;
    public mouseDown: EventListener;
    public mouseMove: EventListener;
    public mouseUp: EventListener;
    public keyUp: EventListener;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.id = config.uid++;

        this.isFocus = true;
        this.saveArray = [];

        this.keyCodeListener();
        this.getName();
    }
    public getName(): void {
        this.name = `${this.constructor.name}_${this.id}`;
    }

    public save(): void {
        logger('save');
        this.saveArray.push(JSON.parse(JSON.stringify(this.property)));
    }

    public back(): void {
        if (this.saveArray.length) {
            this.saveArray.pop();
            this.property = this.saveArray[this.saveArray.length - 1];
        }
        if (!this.property) {
            this.destroyed();
        }
    }

    public destroyed(): void {
        config.emitter.off('mousedown', this.mouseDown);
        config.emitter.off('mousemove', this.mouseMove);
        config.emitter.off('mouseup', this.mouseUp);
        config.emitter.off('keyup', this.keyUp);
        config.emitter.emit('removeItem', this);
    }

    public keyCodeListener(): void {
        this.keyUp = (e: KeyboardEvent): void => {
            if (e.keyCode === 8) {
                // 删除
                if (this.isFocus) {
                    this.destroyed();
                    config.emitter.emit('draw-all');
                }
            }
        };
        config.emitter.on('keyup', this.keyUp);
    }

    public setColor(color: string): void {
        this.property.color = color;
        this.save();
        config.emitter.emit('draw-all');
    }

    public setPosition(rect: Rect, isDraw = false): void {
        Object.assign(this.property.rect, rect);

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    public getCursor(e: MouseEvent, cursorType?: string): string {
        let result: string = 'crosshair'; // 判断鼠标位置结果 默认即crosshair
        for (const i of this.property.circles) {
            if (inCircle(i.x, i.y, e.clientX, e.clientY)) {
                // 在这个范围内 对应的手势图标
                //result = `${i.cssPosition}-resize`;
                if (cursorType === 'eve') {
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

    public init(): void {
        this.property.rect = {
            startX: undefined,
            startY: undefined,
            endX: undefined,
            endY: undefined,
        };
    }

    public event(): void {
        // TODO
    }

    public initBox(): void {
        // TODO
    }

    public hasBox(): boolean {
        return !!(
            this.property.rect.startX !== undefined &&
            this.property.rect.startY !== undefined &&
            this.property.rect.endX !== undefined &&
            this.property.rect.endY !== undefined
        );
    }

    public inBoxBorder(positionX: number, positionY: number): void {
        // TODO
    }

    public inBox(
        positionX: number,
        positionY: number,
        circlePaths: number = 0,
    ): void {
        // TODO
    }

    public draw(): void {
        // TODO
    }
}
