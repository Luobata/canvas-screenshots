import { Circle } from "LIB/interface";
import { Emitter } from "event-emitter";

export default class {
    circle: Circle
    mouseEvent: string;
    emitter: Emitter

    constructor(circle: Circle, emitter: Emitter) {
        this.circle = circle;
        this.emitter = emitter;
    }
}: