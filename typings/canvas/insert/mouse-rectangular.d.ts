import Box from 'INSERT/rectangular';
/**
 * default class
 */
export default class Mouse {
    box: Box;
    private mouseEvent;
    private clickTime;
    constructor(box: Box);
    mouseDown(e: MouseEvent, cursorStyle?: string): void;
    mouseMove(e: MouseEvent): void;
    mouseUp(e: MouseEvent): void;
}
