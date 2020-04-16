/**
 * @description textare
 */
import { Position } from 'LIB/interface';
import Cursor from 'LIB/textarea/cursor';
interface IText {
    position: Position;
    width: number;
    height: number;
    padding: number;
    fontSize: string;
    fontFamily: string;
    color: string;
    background: string;
    borderColor: string;
    borderWidth: string;
    disable: boolean;
    focus: boolean;
    text?: string | number;
}
/**
 * default class TextArea
 */
export default class TextArea {
    property: IText;
    cursor: Cursor;
    textarea: HTMLElement;
    private ctx;
    constructor(ctx: CanvasRenderingContext2D);
    draw(): void;
}
export {};
