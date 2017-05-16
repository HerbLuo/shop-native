/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/5/3
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/5/3 herbluo created
 */

import util from "../utils/array-util";
import log from '../utils/log'
const broadcastChannelModule = weex.requireModule('WXBroadcastChannel');


let Broadcast; //类（仅初始化一次）
// TODO 需要论证一下是否存在 "线程" 安全问题
let broadcast; //实例（每次调用broadcastAdapter方法俊实例化一次）

// Java Native WXBroadcastChannel组件的 JS适配器
class NativeBroadcastAdapter {
    constructor(app) {
        this.app = app;
    }
    postMessage(msg) {
        broadcastChannelModule.postMessage(this.app, msg);
    };
    set onmessage(func) {
        broadcastChannelModule.onmessage(this.app, func);
    }
}

if (typeof BroadcastChannel === 'function') {
    Broadcast = BroadcastChannel
} else if (broadcastChannelModule && broadcastChannelModule.postMessage && broadcastChannelModule.onmessage) {
    Broadcast = NativeBroadcastAdapter
} else {
    log.error('不存在BroadcastChannel的实现');
    throw new Error('App includes neither BroadcastChannel nor WXBroadcastChannel, ' +
        'if you are using the weex playground, please make sure that the WXBroadcastChannel registered.');
}

const ops = {
    postMessage: (msg) => broadcast.postMessage(msg),
    onmessage: () => {
        return new Promise(reject => {
            broadcast.onmessage = () => reject()
        });
    }
};

/**
 * public
 * bean to
 *      broadcast || Promise
 *
 * bean: {
 *  method: string, // 0
 *  value: string, // 1
 *  config: Array<string> // 0__1__2, 2允许为事件名
 *  args: argument
 * }
 */
function broadcastAdapter(bean) {
    const allowMethod = ['postMessage', 'onmessage'];

    broadcast = new Broadcast(bean.value);

    const method = bean.method;
    if (util.includes(allowMethod, method)) {
        // 支持参数 支持方法名硬编码 支持默认值
        let arg = (bean.args.length > 0 && bean.args[0]) // 参数
            || (bean.config.length > 2 && bean.config[2]) // 方法名硬编码
            || 'default' // 默认值
        ;
        return ops[method](arg);
    }

    return broadcast;
}

export default broadcastAdapter;


// de warn

if (0) {
    function BroadcastChannel() {
    }

    BroadcastChannel.prototype.onmessage = function (func) {
    };
    BroadcastChannel.prototype.postMessage = function (str) {
    };
}