/**
 * @description function box
 */
import Box from 'Canvas/box';
import { config } from 'Canvas/config';
import logger from 'Canvas/log';
import { domEach } from 'LIB/dom';

const childBoxContent: string[] = [
    'rectangular',
    'circle',
    'arrow',
    'pen',
    'text',
];
const activeBox: string[] = [
    'rectangular',
    'circle',
    'arrow',
    'pen',
    'text',
    'mosaic',
];

/**
 * default class
 */
// tslint:disable no-this-assignment
export default class FunctionBox {
    public box: HTMLDivElement;
    public wrapBox: Box;
    public items: HTMLElement[];
    public colorItems: HTMLElement[];
    public activeFun: string;
    public activeColor: string;

    constructor(box: HTMLDivElement, wrapBox: Box) {
        this.box = box;
        this.wrapBox = wrapBox;
        this.event();
    }

    public event(): void {
        const items: NodeListOf<Element> = this.box.querySelectorAll(
            '.box-item',
        );
        const childWrap: HTMLElement = this.box.querySelector(
            '.function-box-child',
        );
        const colorWrap: HTMLElement = this.box.querySelector('.color-wrap');
        const colorItem: NodeListOf<Element> = colorWrap.querySelectorAll(
            '.color-item',
        );
        // tslint:disable no-unsafe-any
        this.items = Array.prototype.slice.call(items);
        this.colorItems = Array.prototype.slice.call(colorItem);
        // tslint:enable no-unsafe-any
        const that: FunctionBox = this;
        this.items.forEach((v: HTMLElement) => {
            v.addEventListener('click', function(): void {
                const funType: string = this.getAttribute('type');
                logger(funType);
                that.activeFun = funType;
                that.wrapBox.currentFun = funType;
                that.items.forEach((vi: HTMLElement, i: number) => {
                    items[i].className = items[i].className.replace(
                        'active',
                        '',
                    );
                });
                if (activeBox.indexOf(funType) !== -1) {
                    this.className += ' active';
                }
                if (childBoxContent.indexOf(funType) !== -1) {
                    childWrap.style.display = 'inline-block';
                } else {
                    childWrap.style.display = 'none';
                }
                if (funType === 'back') {
                    that.wrapBox.back();
                }
                if (funType === 'close') {
                    config.emitter.emit('destoryed');
                }
                if (funType === 'image') {
                    // that.wrapBox.uploadImage();
                }
                if (funType === 'save') {
                    config.emitter.emit('shot');
                }
                config.emitter.emit('blur');
            });
        });
        if (config.plugins.indexOf('image') !== -1) {
            const uploadIcon: HTMLElement = this.items.find(
                (v: HTMLElement) => {
                    return v.getAttribute('type') === 'image';
                },
            );
            const input: HTMLInputElement = uploadIcon.querySelector('input');
            uploadIcon.addEventListener('change', (e: Event) => {
                this.wrapBox.uploadImage(e);
                input.value = '';
            });
            config.emitter.on('image-fail', () => {
                input.value = '';
            });
        }

        this.colorItems.forEach((v: HTMLElement) => {
            v.addEventListener('click', function(): void {
                domEach(colorItem, (vi: HTMLElement, i: number) => {
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

        config.emitter.on('destoryed', () => {
            this.wrapBox.destroyed();
        });
    }

    public setColor(color: string): void {
        logger(color);
        this.activeColor = color;
        this.colorItems.forEach((v: HTMLElement, i: number) => {
            const item: HTMLElement = this.colorItems[i];
            item.className = item.className.replace('active', '');
            if (item.getAttribute('color') === color) {
                item.className += 'active';
            }
        });
    }

    public remove(): void {
        this.box.remove();
    }
}
