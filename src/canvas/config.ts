import { EventEmitter } from 'events';

interface Config {
    emitter?: EventEmitter;
}

export const config: Config = {};

export const setConfig = (obj: Config) => {
    Object.assign(config, obj);
};
