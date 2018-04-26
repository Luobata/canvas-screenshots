import { config } from './config';
import { Content, sContent } from './lib/interface';
import { getType, type, getPlainObj } from './lib/type';

export default function(...args: any[]) {
    if (config.debuggerMode) {
        if (console.trace) {
            console.trace.apply(window, arguments);
        } else {
            console.log.apply(window, arguments);
        }
    }
}

type Con = Content | sContent;
let debuggerData: Array<any> = [];
export const setDebuggerData = () => {
    if (config.debuggerMode) {
        if ((<any>window).__Canvas_Screen_Data) return;
        (<any>window).__Canvas_Screen_Data = debuggerData;
    }
};

export const addDebuggerData = (obj: any) => {
    const item = getPlainObj(obj);
    if (!debuggerData.find(v => v.id === item.id)) {
        debuggerData.push(item);
    }
};

export const deleteDebuggerData = (obj: Con) => {
    for (let i = 0; i < debuggerData.length; ) {
        if (debuggerData[i].id === obj.id) {
            debuggerData.splice(i, 1);
        } else {
            i++;
        }
    }
};
