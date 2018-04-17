import { config } from './config';
export default function(...args: any[]) {
    if (config.debuggerMode) {
        console.log.apply(window, arguments);
    }
}
