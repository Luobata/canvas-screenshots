// import canvas from '../src/index';
//
// canvas();

import ScreenShoot from '../dist/screenShots';

let screen;
window.onload = () => {
    console.log(ScreenShoot);
    screen = new ScreenShoot({
        // plugins: [plugins.rectangular, plugins.circle],
        download: data => {
            console.log(data);
        },
        imageFail: error => {
            console.log(error);
        },
    });
    screen.start();
    window.xxxx = () => {
        screen.start();
    };
};
