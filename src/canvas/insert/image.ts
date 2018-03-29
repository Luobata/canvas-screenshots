import { dragCircle, Rect, Position } from 'LIB/interface';
import { config, inBox } from '../config';
import { getCircleMap } from 'LIB/help';
import Content from './content';
import { pointInRectangular } from 'LIB/geometric';

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
        console.log(this);
        const offCanvas = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(file, 0, 0);
        this.file = offCtx.getImageData(0, 0, width, height);
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
