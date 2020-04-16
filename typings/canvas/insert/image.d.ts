import Content from 'INSERT/content';
import { DragCircle, Position, Size } from 'LIB/interface';
interface Iimage {
    position: Position;
    circles?: DragCircle[];
    lineWidth: number;
    circleWidth: number;
    width: number;
    height: number;
    color: string;
}
/**
 * default class
 */
export default class SImage extends Content {
    property: Iimage;
    private file;
    private mouse;
    constructor(ctx: CanvasRenderingContext2D, file: HTMLImageElement, width: number, height: number);
    event(): void;
    setSize(pos: Position, size?: Size): void;
    inBoxBorder(x: number, y: number): boolean;
    draw(): void;
}
export {};
