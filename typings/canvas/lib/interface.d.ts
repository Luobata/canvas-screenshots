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
export declare type PluginType = 'rectangular' | 'circle' | 'arrow' | 'pen' | 'text' | 'mosaic' | 'image' | 'back';
export interface CustomerDefined {
    icon?: string;
    callback?: Function;
}
export interface Config {
    body?: HTMLElement;
    plugins?: PluginType[];
    download: Function;
    imageFail?: Function;
    debuggerMode?: boolean;
    outputType?: Type;
    backgroundData?: ImageData | string;
    customerDefined?: CustomerDefined[];
}
export declare type Type = 'imageData' | 'png' | 'file';
export declare type Content = Rectangular | cCircle | Arrow | Pen | Text | ImageInsert;
export declare type sContent = Mosaic;
