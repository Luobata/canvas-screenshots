interface Config {
    uid?: nubmber;
}

export const config: Config = {
    uid: 0,
};

export const setConfig = (obj: Config) => {
    Object.assign(config, obj);
};
