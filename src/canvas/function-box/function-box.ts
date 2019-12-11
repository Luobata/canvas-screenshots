/**
 * @description function box
 */
import { config } from 'Canvas/config';

// tslint:disable
import 'Canvas/function-box/function-box.styl';
import { PluginType, CustomerDefined } from 'LIB/interface';
const tpl = require('Canvas/function-box/function-box.pug');
// tslint:enable

interface Iclass extends CustomerDefined {
    className: string;
    ctype?: string;
}

interface Icolor {
    color: string;
}

export default (parent: HTMLElement): HTMLDivElement => {
    const div: HTMLDivElement = document.createElement('div');
    let item: Iclass[] = config.plugins.map((v: PluginType) => {
        return { className: v };
    });
    const cd: CustomerDefined[] = config.customerDefined;
    item = item.concat(
        cd.map(
            (c: CustomerDefined): Iclass => {
                return {
                    ...c,
                    ctype: 'customer-defined',
                    className: '',
                };
            },
        ),
    );
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
