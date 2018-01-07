export default class {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    offCanvas: HTMLCanvasElement;
    offCtx: CanvasRenderingContext2D;

    constructor(selector: string) {
        this.canvas = document.querySelector(selector);
        this.ctx = this.canvas.getContext('2d');
        this.offCanvas = document.createElement('canvas');
        this.offCtx = this.offCanvas.getContext('2d');

        if (!this.canvas) {
            throw new Error(`The canvas dom ${selector} isn'nt exists!`);
        }

        this.initBackground();
    }

    initBackground() {}
}
