import Rectangular from 'INSERT/rectangular';
// 插入功能
enum insertFunction {
    rectangular,
    circle,
    arrow,
    text,
}
export default class Box {
    startX: number;
    startY: number;
    endX: number;
    endY: number;

    currentFun?: string;

    constructor() {
        this.initBox();
        // 测试设定默认值
        this.currentFun = insertFunction[0];
        //new Rectangular();
        // addEventListener 但是不能给当前模块加 canvas元素的event 只能靠穿透 能否从框架层面解决问题
    }

    initBox() {
        this.startX = -1;
        this.startY = -1;
        this.endX = -1;
        this.endY = -1;
    }

    hasBox(): boolean {
        return !(
            this.startX === -1 ||
            this.startY === -1 ||
            this.endX === -1 ||
            this.endY === -1
        );
    }

    inBox(positionX: number, positionY: number): boolean {
        return !!(
            positionX >= this.startX &&
            positionX <= this.endX &&
            positionY >= this.startY &&
            positionY <= this.endY
        );
    }

    setPosition({ startX = -1, startY = -1, endX = -1, endY = -1 }) {
        if (startX !== -1) {
            this.startX = startX;
        }
        if (startY !== -1) {
            this.startY = startY;
        }
        if (endX !== -1) {
            this.endX = endX;
        }
        if (endY !== -1) {
            this.endY = endY;
        }
    }
}
