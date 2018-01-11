import { EventEmitter } from 'events';

interface Config {
    emitter?: EventEmitter;
    uid?: number;
}

export const config: Config = {
    uid: 0,
};

export const setConfig = (obj: Config) => {
    Object.assign(config, obj);
};
