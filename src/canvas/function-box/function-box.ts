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
        {
            text: 'P',
            className: 'pen',
        },
        {
            text: 'T',
            className: 'text',
        },
        {
            text: 'B',
            className: 'back',
        },
        {
            text: 'X',
            className: 'close',
        },
        {
            text: 'S',
            className: 'save',
        },
    ];

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
