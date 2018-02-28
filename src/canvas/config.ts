import { Emitter } from 'event-emitter';
import { Rect } from 'LIB/interface';

interface Config {
    emitter?: Emitter;
    uid?: number;
    wrap?: HTMLElement;
    boxRect?: Rect;
    platform?: string;
}

export const config: Config = {
    uid: 0,
};

export const setConfig = (obj: Config) => {
    Object.assign(config, obj);
};
