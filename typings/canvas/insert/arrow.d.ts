import Content from 'INSERT/content';
import { DragCircle, Position, Rect } from 'LIB/interface';
interface Iarrow {
    rect?: Rect;
    circles: DragCircle[];
    lines: Position[];
    color: string;
    circleWidth: number;
}
/**
 * default class
 */
export default class SArrow extends Content {
    property: Iarrow;
    private mouse;
    constructor(ctx: CanvasRenderingContext2D, color: string);
    event(): void;
    inBoxBorder(x: number, y: number): boolean;
    draw(): void;
}
export {};
