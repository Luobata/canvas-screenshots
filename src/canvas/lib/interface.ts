export interface dragCircle {
    x: number;
    y: number;
    cssPosition: string;
    cssPositionEve: string;
    position: string;
}

export interface Rect {
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
}

export interface Circle {
    centerX?: number;
    centerY?: number;
    radiusX?: number;
    radiusY?: number;
}

export interface Position {
    x: number;
    y: number;
}
