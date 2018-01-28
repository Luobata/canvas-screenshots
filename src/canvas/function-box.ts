const tpl = require('./function-box.pug');
import './function-box.styl';

export default (parent: HTMLElement) => {
    const div = document.createElement('div');
    const item = [
        {
            text: 'R',
            className: 'rectangular',
        },
        {
            text: 'C',
            className: 'circle',
        },
        {
            text: 'A',
            className: 'arrow',
        },
    ];
    const prefix = 'screen-shoot';
    const tmpl = tpl({
        item,
        prefix,
    });
    div.id = `${prefix}`;
    div.innerHTML = tmpl;

    parent.appendChild(div);

    return div;
};
