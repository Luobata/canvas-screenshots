/// <reference path="../src/index.d.ts"/>
// import ScreenShoot from '../dist/screenShots';
const ScreenShoot = require('../src/index');
// import ScreenShoot from '../src/canvas/screen';

window.onload = () => {
    // let screen: ScreenShoot;
    let screen = new ScreenShoot({
        // plugins: [plugins.rectangular, plugins.circle],
        download: (data: ImageData) => {
            console.log(data);
        },
        imageFail: (error: object) => {
            console.log(error);
        },
    });
    screen.start();
};
// (<any>window).xxxx = () => {
//     screen.start();
// };
