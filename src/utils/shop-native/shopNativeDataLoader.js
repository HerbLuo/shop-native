/**
 * shop native专用
 * 数据加载器
 *
 * shop native的数据加载方案
 * 方案A：
 *  data = {
 *    version: '{渲染优先级}-v{版本}'; // 渲染优先级指定了第一次渲染的时间（delayTime）
 *    ...
 *  }
 *  data 依次从 cache，storage，server 加载，
 *  当 version 和所需版本 一致时，
 *   可直接使用 cache 或 storage 里的数据，
 *  否则，从服务端加载，
 *   为确保不因网络不通畅导致的 '首屏' 时间延长，
 *   delayTime 后，若 server 未返回结果，进行第一次渲染
 *   server 返回结果后，再次渲染
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/5/5
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/5/5 herbluo created
 */

import cache from '../cache'
import log from '../log'

export default {

    /**
     * A加载方案
     *
     *  data = {
     *      version: '{渲染优先级}-v{版本}'; // 渲染优先级指定了第一次渲染的时间（delayTime）
     *      ...
     *  }
     *  data 依次从 cache，storage，server 加载，
     *  当 version 和所需版本 一致时，
     *      可直接使用 cache 或 storage 里的数据，
     *  否则，从服务端加载，
     *      为确保不因网络不通畅导致的 '首屏' 时间延长，
     *      delayTime 后，若 server 未返回结果，进行第一次渲染
     *      server 返回结果后，再次渲染
     *
     * @param logKey 日志标记（建议使用组件名）
     * @param version 数据的版本  组成：'{渲染优先级}-v{版本}'  说明：渲染优先级指定了第一次渲染的时间（delayTime）
     * @param cacheName 缓存名
     * @param storagePromise 读取本地存储的 promise
     * @param serverPromiseFunc 请求服务端数组的方法，要求返回一个promise
     * @param renderCallback(data, type): Function 说明：type: ['cache', 'storage', 'server', 'error', 'timer']
     * @returns {Promise.<void>}
     * @constructor
     */
    A: async ({logKey = '[LOADER A]', version, cacheName, storagePromise, serverPromiseFunc, renderCallback}) => {

        // appEntranceVersion 被意外置空了
        if (version === undefined) {
            log.warning(`${logKey} version 不能为空`);
            return;
        }

        // 获取缓存中的entrances
        let data,
            versionSplited;
        if (
            version !== 'nocache'
            && (data = cache.get(cacheName)) // 缓存中取到了缓存值
            && ( // 且以下任意一条件满足
                data.version === version // 1. 缓存中的版本可用
                || version === '*' // 2. 参数version 指定了可以使用 任意版本 的缓存
            )
        ) {
            log.info(`${logKey} render data from cache`);
            renderCallback(data, 'cache');
            return;
        }

        // 获取闪存中的entrances
        let event = await storagePromise;
        data = event.data;
        data = data && data !== 'undefined' && JSON.parse(data);

        // 闪存中的entrances版本可用
        if (data && (data.version === version)) {
            log.info(`${logKey} render data from storage`);
            renderCallback(data, 'storage');
            return;
        }

        /*
         * 渲染优先级
         * 存在于版本字符串的开头，使用'-'分隔
         * 优先级越高，等待网络请求的时间越短（执行第一次渲染的时间越短）
         */
        const priority = (versionSplited && versionSplited[0]) || version.split('-')[0];

        const priorityDelayMapping = {
            real: 100,
            high: 300,
            low: 1500,
            off: 8000,
        };

        /*
         * 等待网络请求的时间
         */
        let delayTime = priorityDelayMapping[priority] || 700;

        let timer;

        /*
         * 从服务端获取entrance
         */
        serverPromiseFunc().then(({data}) => {
            clearTimeout(timer);
            log.info(`${logKey} render data from server`);
            renderCallback(data, 'server')
        }).catch(e => {
            renderCallback(e, 'error');
        });

        timer = setTimeout(() => {
            if (data) {
                log.info(`${logKey} render data from timeout`);
                renderCallback(data, 'timer')
            } else {
                log.warning(`${logKey} 第一次渲染失败，等待服务器返回结果后的第二次渲染`)
            }
        }, delayTime);

    },

}

