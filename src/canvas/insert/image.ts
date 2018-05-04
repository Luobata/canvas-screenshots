/**
 * @description image
 */
import { config, inBox } from 'Canvas/config';
import Content from 'INSERT/content';
import Mouse from 'INSERT/mouse-image';
import { pointInRectangular } from 'LIB/geometric';
import { getCircleMap, IcircleMap } from 'LIB/help';
import { DragCircle, Position, Rect, Size } from 'LIB/interface';

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
    public property: Iimage;
    // file: ImageData;
    private file: HTMLImageElement;
    private mouse: Mouse;

    constructor(
        ctx: CanvasRenderingContext2D,
        file: HTMLImageElement,
        width: number,
        height: number,
    ) {
        super(ctx);
        this.property = {
            lineWidth: 0,
            circleWidth: 3,
            position: {
                x: config.boxRect.startX,
                y: config.boxRect.startY,
            },
            width,
            height,
            color: 'black',
        };
        const offCanvas: HTMLCanvasElement = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        const offCtx: CanvasRenderingContext2D = offCanvas.getContext('2d');
        offCtx.drawImage(file, 0, 0);
        this.file = file;
        // this.file = offCtx.getImageData(0, 0, width, height);
        this.mouse = new Mouse(this);
        this.event();
    }

    public event(): void {
        this.mouseDown = (e: MouseEvent): void => {
            if (this.isFocus && inBox(e)) {
                this.mouse.mouseDown(e, this.getCursor(e, 'eve'));
            }
        };
        this.mouseMove = (e: MouseEvent): void => {
            if (this.isFocus) {
                this.mouse.mouseMove(e);
            }
        };
        this.mouseUp = (e: MouseEvent): void => {
            if (this.isFocus) {
                this.mouse.mouseUp(e);
            }
        };

        config.emitter.on('mousedown', this.mouseDown);
        config.emitter.on('mousemove', this.mouseMove);
        config.emitter.on('mouseup', this.mouseUp);
    }

    public setSize(pos: Position, size?: Size): void {
        if (size && size.width) {
            this.property.width = size.width;
        }
        if (size && size.height) {
            this.property.height = size.height;
        }

        this.property.position.x = pos.x;
        this.property.position.y = pos.y;

        config.emitter.emit('draw-all');
    }

    public inBoxBorder(x: number, y: number): boolean {
        const margin: number = 10;
        const p1: Position = {
            x: this.property.position.x - margin,
            y: this.property.position.y - margin,
        };
        const p2: Position = {
            x: this.property.position.x + this.property.width + margin,
            y: this.property.position.y - margin,
        };
        const p3: Position = {
            x: this.property.position.x - margin,
            y: this.property.position.y + this.property.height + margin,
        };
        const p4: Position = {
            x: this.property.position.x + this.property.width + margin,
            y: this.property.position.y + this.property.height + margin,
        };
        const p: Position = {
            x,
            y,
        };

        return !!pointInRectangular(p1, p2, p3, p4, p);
    }

    public draw(): void {
        const rect: Rect = {
            startX: this.property.position.x,
            startY: this.property.position.y,
            endX: this.property.position.x + this.property.width,
            endY: this.property.position.y + this.property.height,
        };
        const circleMap: IcircleMap[] = <IcircleMap[]>getCircleMap(
            rect,
            this.property.lineWidth,
        );
        this.property.circles = circleMap;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.drawImage(
            this.file,
            config.rate * this.property.position.x,
            config.rate * this.property.position.y,
            config.rate * this.property.width,
            config.rate * this.property.height,
        );
        // this.ctx.putImageData(
        //     this.file,
        //     this.property.position.x,
        //     this.property.position.y,
        //     0,
        //     0,
        //     this.property.width,
        //     this.property.height,
        // );
        if (this.isFocus) {
            for (const i of circleMap) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.property.color;
                this.ctx.arc(
                    config.rate * i.x,
                    config.rate * i.y,
                    config.rate * this.property.circleWidth,
                    0,
                    Math.PI * 2,
                    true,
                );
                this.ctx.stroke();
                this.ctx.fillStyle = 'white';
                this.ctx.fill();
            }
        }
        this.ctx.restore();
    }
}
