export const hasBox = function(): boolean {
    return !(
        this.box.startX === 0 &&
        this.box.startY === 0 &&
        this.box.endX === 0 &&
        this.box.endY === 0
    );
};

export const inBox = function(positionX: number, positionY: number): boolean {
    return !!(
        positionX >= this.box.startX &&
        positionX <= this.box.endX &&
        positionY >= this.box.startY &&
        positionY <= this.box.endY
    );
};
