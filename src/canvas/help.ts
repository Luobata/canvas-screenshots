export const hasBox = function(): boolean {
    return !(
        this.box.startX === -1 ||
        this.box.startY === -1 ||
        this.box.endX === -1 ||
        this.box.endY === -1
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
