/**
 * @description log
 */
import { config } from 'Canvas/config';
import { Content, sContent } from 'LIB/interface';
import { getPlainObj, getType, type } from 'LIB/type';

// tslint:disable no-any no-unsafe-any
export default function log(...args: any[]): void {
    if (config.debuggerMode) {
        if (console.trace) {
            console.trace.apply(window, arguments);
        } else {
            console.log.apply(window, arguments);
        }
    }
}

type Con = Content | sContent;
const debuggerData: Con[] = [];
export const setDebuggerData: Function = (): void => {
    if (config.debuggerMode) {
        if ((<any>window).__Canvas_Screen_Data) {
            return;
        }
        (<any>window).__Canvas_Screen_Data = debuggerData;
    }
};

export const addDebuggerData: Function = (obj: Con): void => {
    const item: Con = getPlainObj(obj);
    if (!debuggerData.find((v: Con) => v.id === item.id)) {
        debuggerData.push(item);
    }
};

export const deleteDebuggerData: Function = (obj: Con): void => {
    for (let i: number = 0; i < debuggerData.length; ) {
        if (debuggerData[i].id === obj.id) {
            debuggerData.splice(i, 1);
        } else {
            i = i + 1;
        }
    }
};

// tslint:enable no-any no-unsafe-any
