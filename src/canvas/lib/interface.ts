import Rectangular from 'INSERT/rectangular';
import cCircle from 'INSERT/circle';
import Arrow from 'INSERT/arrow';
import Pen from 'INSERT/pen';
import Text from 'INSERT/text';
import Mosaic from 'INSERT/mosaic';
import ImageInsert from 'INSERT/image';

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

export interface Config {
    plugins?: Array<PluginType>;
    download: Function;
    imageFail?: Function;
    debuggerMode?: boolean;
    type?: Type;
}

export type Type = 'imageData' | 'png';

export type Content = Rectangular | cCircle | Arrow | Pen | Text | ImageInsert;
export type sContent = Mosaic;
