/**
 * @description cursor
 */
import Box from 'Canvas/box';
interface ICircle {
    x: number;
    y: number;
    cssPosition: string;
}
export default class {
    maskCircles: ICircle[];
    box: Box;
    constructor(box: Box);
    getCursor(e: MouseEvent, itype?: string): string;
}
export {};
