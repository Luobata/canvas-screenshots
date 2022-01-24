// import canvas from '../src/index';
//
// canvas();

// import ScreenShoot from '../dist/screenShots';
import ScreenShoot from '../src/index.ts';

let screen;
window.onload = () => {
    // console.log(ScreenShoot);
    screen = new ScreenShoot({
        // plugins: ['rectangular', 'circle'],
        noBackground: true,
        download: (data, rect) => {
            console.log(rect);
            if (data.x) {
                const ctx = data.actionCtx;
                const imagedata = ctx.getImageData(
                    data.x,
                    data.y,
                    data.width,
                    data.height,
                );
                console.log(imagedata);
            } else {
                console.log(data);
                document.getElementById('back').remove();
                document.body.append(data);
            }
        },
        imageFail: (error) => {
            console.log(error);
        },
        customerDefined: [
            {
                icon: 'http://shared.ydstatic.com/fanyi/login/images/qq@2x.png',
                callback: (data) => {
                    console.log(data);
                },
            },
        ],
        debuggerMode: true,
        // type: 'png',
        outputType: 'png',
        onClose: () => {
            console.log('close');
        },
    });
    screen.start();
    window.xxxx = () => {
        screen.start();
    };
};
window.test = [1, 2];
