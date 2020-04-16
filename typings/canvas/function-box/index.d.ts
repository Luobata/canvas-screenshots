/**
 * @description function box
 */
import Box from 'Canvas/box';
/**
 * default class
 */
export default class FunctionBox {
    box: HTMLDivElement;
    wrapBox: Box;
    items: HTMLElement[];
    colorItems: HTMLElement[];
    activeFun: string;
    activeColor: string;
    constructor(box: HTMLDivElement, wrapBox: Box);
    event(): void;
    setColor(color: string): void;
    remove(): void;
}
