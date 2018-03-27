import { config } from '../config';
import { domEach } from 'LIB/dom';
import Box from '../box';

const childBoxContent = ['rectangular', 'circle', 'arrow', 'pen', 'text'];
const activeBox = [
    'rectangular',
    'circle',
    'arrow',
    'pen',
    'text',
    'mosaic',
    'image',
];
export default class FunctionBox {
    box: HTMLDivElement;
    wrapBox: Box;
    items: Array<HTMLElement>;
    colorItems: Array<HTMLElement>;
    activeFun: string;
    activeColor: string;
    constructor(box: HTMLDivElement, wrapBox: Box) {
        this.box = box;
        this.wrapBox = wrapBox;
        this.event();
    }

    event() {
        const items = this.box.querySelectorAll('.box-item');
        const childWrap = this.box.querySelector(
            '.function-box-child',
        ) as HTMLElement;
        const colorWrap = this.box.querySelector('.color-wrap') as HTMLElement;
        const colorItem = colorWrap.querySelectorAll('.color-item');
        this.items = Array.prototype.slice.call(items);
        this.colorItems = Array.prototype.slice.call(colorItem);
        const that = this;
        this.items.forEach((v: HTMLElement) => {
            v.addEventListener('click', function() {
                that.activeFun = this.getAttribute('type');
                that.wrapBox.currentFun = this.getAttribute('type');
                that.items.forEach((v: HTMLElement, i: number) => {
                    items[i].className = items[i].className.replace(
                        'active',
                        '',
                    );
                });
                if (activeBox.indexOf(that.wrapBox.currentFun) !== -1) {
                    this.className += ' active';
                }
                if (childBoxContent.indexOf(that.wrapBox.currentFun) !== -1) {
                    childWrap.style.display = 'inline-block';
                } else {
                    childWrap.style.display = 'none';
                }
                if (that.wrapBox.currentFun === 'back') {
                    that.wrapBox.back();
                }
                if (that.wrapBox.currentFun === 'close') {
                    that.wrapBox.destroyed();
                    config.emitter.emit('destoryed');
                }
                config.emitter.emit('blur');
            });
        });

        this.colorItems.forEach((v: HTMLElement) => {
            v.addEventListener('click', function() {
                domEach(colorItem, (v: HTMLElement, i: number) => {
                    colorItem[i].className = colorItem[i].className.replace(
                        'active',
                        '',
                    );
                });
                this.className += ' active';
                that.activeColor = this.getAttribute('color');
                that.wrapBox.colorFun = this.getAttribute('color');
                that.wrapBox.focusItem = that.wrapBox.findFocus();
                if (that.wrapBox.focusItem) {
                    that.wrapBox.focusItem.setColor(that.wrapBox.colorFun);
                    that.wrapBox.childSaveArray.push(that.wrapBox.focusItem);
                }
            });
        });
        that.wrapBox.colorFun = colorItem[0].getAttribute('color');
        colorItem[0].className += ' active';
    }

    setColor(color: string) {
        this.activeColor = color;
        this.colorItems.forEach((v: HTMLElement, i: number) => {
            const item = this.colorItems[i];
            item.className = item.className.replace('active', '');
            if (item.getAttribute('color') === color) {
                item.className += 'active';
            }
        });
    }

    remove() {
        this.box.remove();
    }
}
