/**
 * @description config
 */
import { Emitter } from 'event-emitter';
import { CustomerDefined, PluginType, Rect, Type } from 'LIB/interface';
interface IConfig {
    emitter?: Emitter;
    uid?: number;
    wrap?: HTMLElement;
    boxRect?: Rect;
    width?: number;
    height?: number;
    platform?: string;
    rate?: number;
    plugins?: PluginType[];
    customerDefined?: CustomerDefined[];
    debuggerMode?: boolean;
    outputType?: Type;
}
export declare const config: IConfig;
export declare const inBox: Function;
export declare const setConfig: Function;
export {};
