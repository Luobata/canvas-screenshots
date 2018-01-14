import { setConfig } from '../util/config';

export default class Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
    }

    resize(size: { width?: number; height?: number }) {
        Object.assign(this, size);
    }
    draw() {}
}
