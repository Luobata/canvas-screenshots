import { Rect } from 'LIB/interface';
/**
 * default class Content
 */
export default class Content {
    id: number;
    name: string;
    isFocus: boolean;
    property: any;
    saveArray: any[];
    ctx: CanvasRenderingContext2D;
    mouseDown: EventListener;
    mouseMove: EventListener;
    mouseUp: EventListener;
    keyUp: EventListener;
    constructor(ctx: CanvasRenderingContext2D);
    getName(): void;
    save(): void;
    back(): void;
    destroyed(): void;
    keyCodeListener(): void;
    setColor(color: string): void;
    setPosition(rect: Rect, isDraw?: boolean): void;
    getCursor(e: MouseEvent, cursorType?: string): string;
    init(): void;
    event(): void;
    initBox(): void;
    hasBox(): boolean;
    inBoxBorder(positionX: number, positionY: number): boolean;
    inBox(positionX: number, positionY: number, circlePaths?: number): void;
    draw(): void;
}
