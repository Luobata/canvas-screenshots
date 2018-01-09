export default class {
    startX: number;
    startY: number;
    endX: number;
    endY: number;

    constructor() {
        this.initBox();
    }

    initBox() {
        this.startX = -1;
        this.startY = -1;
        this.endX = -1;
        this.endY = -1;
    }

    hasBox() {
        return !(
            this.startX === -1 ||
            this.startY === -1 ||
            this.endX === -1 ||
            this.endY === -1
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
