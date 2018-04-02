const tpl = require('./function-box.pug');
import './function-box.styl';
import { config } from '../config';

export default (parent: HTMLElement) => {
    const div = document.createElement('div');
    let item = config.plugins.map(v => {
        return { className: v };
    });
    item = (<Array<any>>item).concat([
        { className: 'close' },
        { className: 'save' },
    ]);
    const colors = [
        {
            color: 'red',
        },
        {
            color: 'blue',
        },
        {
            color: 'green',
        },
        {
            color: 'yellow',
        },
        {
            color: 'gray',
        },
        {
            color: 'white',
        },
    ];
    const prefix = 'screen-shoot';
    const tmpl = tpl({
        item,
        colors,
        prefix,
    });
    div.id = `${prefix}`;
    div.innerHTML = tmpl;

    parent.appendChild(div);

    return div;
};
