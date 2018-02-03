import { Emitter } from 'event-emitter';

interface Config {
    emitter?: Emitter;
    uid?: number;
    wrap?: HTMLElement;
}

export const config: Config = {
    uid: 0,
};

export const setConfig = (obj: Config) => {
    Object.assign(config, obj);
};
