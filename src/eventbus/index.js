/**
 * 事件总线，
 * 与vuex共同管理事件
 * 优先使用vuex，仅在以下情况使用eventbus
 *  1. weex实例间通信，export weexEvent
 *  2. 纯事件，无关UI，export default
 *
 * 自动重写 所有 方法名中存在 __ 的方法
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/27
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/27 herbluo created
 */

import broadcastAdapter from './_BroadcastAdapter'
import vueBusAdapter from './_VueBusAdapter'

/**
 * vue 的一个公交车
 * 管理一些简单事件
 */
const vuebus = new Vue();

/**
 * vueBus 事件
 * 当组件间仅有事件传递，不存在数据传递时使用
 *
 * 自动重写 所有 方法名中存在 __ 的方法
 */
const event = {};

/**
 * weex实例间通信
 * 自动重写 所有 方法名中存在 __ 的方法
 * 默认的 onmessage 实现了 promise API
 */
const weexEvent = {
    e__app_init() {
    },
    postMessage__app_init() {
    },
    onmessage__app_init() {
    },
};

/*
 * 以下为私有方法
 */

/*
 * bean
 * 包含本操作的所有信息
 * （该bean由函数名转化而来）
 */
class OpBean {
    constructor(method, value, config) {
        /*
         * 方法，如何操作
         * 如，get set delete等
         */
        this.method = method;
        /*
         * 值，具体做的内容
         * 如 'user', 'item' 等
         */
        this.value = value;
        /*
         * 包含操作方法初步处理完毕后的所有内容
         */
        this.config = config;
        /*
         * 本次操作的参数
         */
        this.args = undefined;
    }
}


/*
 * 入口
 * 对所有符合规范的方法名，重新绑定相应的方法
 * 重写方法名中存在 __ 的方法
 */
[{
    event: event,
    adapter: vueBusAdapter,
}, {
    event: weexEvent,
    adapter: broadcastAdapter,
}].forEach((obj) => {
    for (let key in obj.event) {
        //noinspection JSUnfilteredForInLoop
        typeof obj.event[key] === 'function'
        && (obj.event[key] = hander(key, obj.adapter) || obj.event[key])
    }
});

/*
 * 处理器
 * 控制器
 */
function hander(name, opAdapter) {
    const bean = convertOperate(name);

    if (!bean) {
        return;
    }

    return function () {
        bean.args = arguments;
        return opAdapter(bean);
    }
}

/*
 * 方法名 to OpBean对象
 */
function convertOperate(name) {
    const nameSnippet = name.split('__');
    if (nameSnippet.length < 2) {
        return;
    }

    return new OpBean(nameSnippet[0], nameSnippet[1], nameSnippet);
}

export default event;
export {
    vuebus,
    weexEvent,
}
