// import canvas from '../src/index';
//
// canvas();

// import ScreenShoot from '../dist/screenShots';
import ScreenShoot from '../src/index.ts';

let screen;
window.onload = () => {
    console.log(ScreenShoot);
    screen = new ScreenShoot({
        // plugins: ['rectangular', 'circle'],
        download: data => {
            console.log(data);
        },
        imageFail: error => {
            console.log(error);
        },
        debuggerMode: true,
        type: 'png',
    });
    screen.start();
    window.xxxx = () => {
        screen.start();
    };
};
