/**
 * @description interface
 */
import Arrow from 'INSERT/arrow';
import cCircle from 'INSERT/circle';
import ImageInsert from 'INSERT/image';
import Mosaic from 'INSERT/mosaic';
import Pen from 'INSERT/pen';
import Rectangular from 'INSERT/rectangular';
import Text from 'INSERT/textarea';

// tslint:disable interface-name
export interface DragCircle {
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

export interface CustomerDefined {
    // url or base64
    icon?: string;
    callback?: Function;
}

export interface Config {
    body?: HTMLElement;
    plugins?: PluginType[];
    noBackground?: boolean;
    download: Function;
    imageFail?: Function;
    onClose?: Function;
    debuggerMode?: boolean;
    outputType?: Type;
    backgroundData?: ImageData | string; // string 为base64
    customerDefined?: CustomerDefined[];
}

export type Type = 'imageData' | 'png' | 'file';

export type Content = Rectangular | cCircle | Arrow | Pen | Text | ImageInsert;
export type sContent = Mosaic;
