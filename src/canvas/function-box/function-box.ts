/**
 * @description function box
 */
import { config } from 'Canvas/config';

// tslint:disable
import 'Canvas/function-box/function-box.styl';
import { PluginType } from 'LIB/interface';
const tpl = require('Canvas/function-box/function-box.pug');
// tslint:enable
interface Iclass {
    className: string;
}

interface Icolor {
    color: string;
}

export default (parent: HTMLElement): HTMLDivElement => {
    const div: HTMLDivElement = document.createElement('div');
    let item: Iclass[] = config.plugins.map((v: PluginType) => {
        return { className: v };
    });
    item = item.concat([{ className: 'close' }, { className: 'save' }]);
    const colors: Icolor[] = [
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
    const prefix: string = 'screen-shoot';
    const tmpl: string = tpl({
        item,
        colors,
        prefix,
    });
    div.id = `${prefix}`;
    // tslint:disable no-inner-html
    div.innerHTML = tmpl;
    // tslint:enable no-inner-html

    parent.appendChild(div);

    return div;
};
