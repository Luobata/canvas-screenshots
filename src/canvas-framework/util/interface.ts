export interface Rect {
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
}

export interface Events {
    type: string;
    callback: Function;
}
