import { dragCircle, Rect, Position } from 'LIB/interface';
import { config, inBox } from '../config';
import { getCircleMap } from 'LIB/help';
import Content from './content';
import { pointInRectangular } from 'LIB/geometric';
import Mouse from './mouse-image';

interface image {
    position: Position;
    circles?: Array<dragCircle>;
    lineWidth: number;
    circleWidth: number;
    width: number;
    height: number;
    color: string;
}

export default class extends Content {
    property: image;
    file: ImageData;
    mouse: Mouse;

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
        const offCanvas = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(file, 0, 0);
        this.file = offCtx.getImageData(0, 0, width, height);
        this.mouse = new Mouse(this);
        this.event();
    }

    event() {
        this.mouseDown = (e: MouseEvent) => {
            if (this.isFocus && inBox(e)) {
                this.mouse.mouseDown(e, this.getCursor(e, 'eve'));
            }
        };
        this.mouseMove = (e: MouseEvent) => {
            if (this.isFocus) {
                this.mouse.mouseMove(e);
            }
        };
        this.mouseUp = (e: MouseEvent) => {
            if (this.isFocus) {
                this.mouse.mouseUp(e);
            }
        };

        config.emitter.on('mousedown', this.mouseDown);
        config.emitter.on('mousemove', this.mouseMove);
        config.emitter.on('mouseup', this.mouseUp);
    }

    setSize(pos: Position) {
        this.property.position.x = pos.x;
        this.property.position.y = pos.y;

        config.emitter.emit('draw-all');
    }

    inBoxBorder(x: number, y: number) {
        const p1 = {
            x: this.property.position.x,
            y: this.property.position.y,
        };
        const p2 = {
            x: this.property.position.x + this.property.width,
            y: this.property.position.y,
        };
        const p3 = {
            x: this.property.position.x,
            y: this.property.position.y + this.property.height,
        };
        const p4 = {
            x: this.property.position.x + this.property.width,
            y: this.property.position.y + this.property.height,
        };
        const p = {
            x,
            y,
        };
        return pointInRectangular(p1, p2, p3, p4, p);
    }

    draw() {
        const rect: Rect = {
            startX: this.property.position.x,
            startY: this.property.position.y,
            endX: this.property.position.x + this.property.width,
            endY: this.property.position.y + this.property.height,
        };
        const circleMap = getCircleMap(rect, this.property.lineWidth);
        this.property.circles = circleMap;
        this.ctx.save();
        this.ctx.beginPath();
        // this.ctx.drawImage(
        //     this.file,
        //     this.property.position.x,
        //     this.property.position.y,
        // );
        this.ctx.putImageData(
            this.file,
            this.property.position.x,
            this.property.position.y,
            0,
            0,
            this.property.width,
            this.property.height,
        );
        if (this.isFocus) {
            for (let i of circleMap) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.property.color;
                this.ctx.arc(
                    i.x,
                    i.y,
                    this.property.circleWidth,
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
