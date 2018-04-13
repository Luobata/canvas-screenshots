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

export interface Size {
    width?: number;
    height?: number;
}

// export enum plugins {
//     rectangular = 'rectangular',
//     circle = 'circle',
//     arrow = 'arrow',
//     pen = 'pen',
//     text = 'text',
//     mosaic = 'mosaic',
//     image = 'image',
//     back = 'back',
// }
export type PluginType =
    | 'rectangular'
    | 'circle'
    | 'arrow'
    | 'pen'
    | 'text'
    | 'mosaic'
    | 'image'
    | 'back';
