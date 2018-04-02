import ScreenShoot from './canvas/screen';
import { plugins } from 'LIB/interface';

export default () => {
    window.onload = () => {
        new ScreenShoot({
            // plugins: [plugins.rectangular, plugins.circle],
            download: (data: ImageData) => {
                console.log(data);
            },
        });
    };
};
