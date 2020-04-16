/**
 * @description mouse
 */
import Box from 'Canvas/box';
import { Emitter } from 'event-emitter';
/**
 * default class
 */
export default class Mouse {
    box: Box;
    private mouseEvent;
    private clickTime;
    private emitter;
    constructor(box: Box, emitter: Emitter);
    mouseDown(e: MouseEvent, cursorStyle: string): void;
    mouseMove(e: MouseEvent): void;
    mouseUp(e: MouseEvent): void;
}
