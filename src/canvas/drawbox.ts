export const drawEnd = function() {
    const borderWidth = 1;
    const circleWidth = 3;
    let result = [];
    this.maskCtx.save();
    this.maskCtx.beginPath();
    this.maskCtx.fillStyle = 'black';
    // boder
    this.maskCtx.moveTo(
        this.box.startX - borderWidth,
        this.box.startY - borderWidth,
    );
    this.maskCtx.lineTo(
        this.box.endX + borderWidth,
        this.box.startY - borderWidth,
    );
    this.maskCtx.lineTo(
        this.box.endX + borderWidth,
        this.box.endY + borderWidth,
    );
    this.maskCtx.lineTo(
        this.box.startX - borderWidth,
        this.box.endY + borderWidth,
    );
    this.maskCtx.lineTo(
        this.box.startX - borderWidth,
        this.box.startY - borderWidth,
    );
    this.maskCtx.restore();
    this.maskCtx.stroke();
    // circle
    const circleMap = [
        // left-top
        {
            x: this.box.startX - borderWidth,
            y: this.box.startY - borderWidth,
            position: 'left-top',
            cssPosition: 'nw',
        },
        // left-bottom
        {
            x: this.box.startX - borderWidth,
            y: this.box.endY + borderWidth,
            position: 'left-botoom',
            cssPosition: 'sw',
        },
        // left-middle
        {
            x: this.box.startX - borderWidth,
            y: this.box.startY + (this.box.endY - this.box.startY) / 2,
            position: 'left-middle',
            cssPosition: 'w',
        },
        // middle top
        {
            x: this.box.startX + (this.box.endX - this.box.startX) / 2,
            y: this.box.startY - borderWidth,
            position: 'middle-top',
            cssPosition: 'n',
        },
        // middle bottom
        {
            x: this.box.startX + (this.box.endX - this.box.startX) / 2,
            y: this.box.endY + borderWidth,
            position: 'middle-bottom',
            cssPosition: 's',
        },
        // right top
        {
            x: this.box.endX + borderWidth,
            y: this.box.startY - borderWidth,
            position: 'right-top',
            cssPosition: 'ne',
        },
        // right bottom
        {
            x: this.box.endX + borderWidth,
            y: this.box.endY + borderWidth,
            position: 'right-bottom',
            cssPosition: 'se',
        },
        // right middle
        {
            x: this.box.endX + borderWidth,
            y: this.box.startY + (this.box.endY - this.box.startY) / 2,
            position: 'right-middle',
            cssPosition: 'e',
        },
    ];
    for (let i of circleMap) {
        this.maskCtx.beginPath();
        this.maskCtx.fillStyle = 'black';
        this.maskCtx.arc(i.x, i.y, circleWidth, 0, Math.PI * 2, true);
        this.maskCtx.stroke();
        this.maskCtx.fillStyle = 'white';
        this.maskCtx.fill();

        // log circle info into maskCircles
        //this.cursor.maskCircles.push(i);
        result.push(i);
    }
    this.cursor.maskCircles = result;
};
