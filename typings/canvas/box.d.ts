import { Content, DragCircle, Rect, sContent } from 'LIB/interface';
/**
 * default class Box
 */
export default class Box {
    circles: DragCircle[];
    rect?: Rect;
    isFocus: Boolean;
    isShowCircle: Boolean;
    colorFun?: string;
    focusItem: Content | null;
    currentFun?: string;
    childSaveArray: (Content | sContent)[];
    private ctx;
    private transctx;
    private offCanvas;
    private offCtx;
    private content;
    private sContent;
    private cursorStyle;
    private lineWidth;
    private borderRadious;
    private circleWidth;
    private mouse;
    private cursor;
    private functionBox;
    private paintList;
    constructor(ctx: CanvasRenderingContext2D, offCanvas: HTMLCanvasElement, offCtx: CanvasRenderingContext2D, transctx: CanvasRenderingContext2D, cursorStyle: string, functionBox: HTMLDivElement);
    allBlur(): void;
    destroyed(): void;
    back(): void;
    initBox(): void;
    hasBox(): boolean;
    inBox(positionX: number, positionY: number): boolean;
    setPosition(rect: Rect, isDraw?: boolean): void;
    findFocus(): Content | null;
    uploadImage(e: Event): void;
    getData(): HTMLCanvasElement;
    draw(data?: HTMLCanvasElement): void;
    private events;
    private focusRectangular;
    private outFocus;
    private cursorChange;
    private listenMouse;
    private painter;
    private drawCircle;
}
