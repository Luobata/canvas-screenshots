import Content from 'INSERT/content';
import { DragCircle, Rect } from 'LIB/interface';
interface Irectangular {
    rect?: Rect;
    circles?: DragCircle[];
    isStroke: boolean;
    color: string;
    lineWidth: number;
    borderRadious: number;
    circleWidth: number;
}
/**
 * default class
 */
export default class SRectangular extends Content {
    property: Irectangular;
    private mouse;
    constructor(ctx: CanvasRenderingContext2D, color: string);
    event(): void;
    inBoxBorder(positionX: number, positionY: number): boolean;
    draw(): void;
}
export {};
