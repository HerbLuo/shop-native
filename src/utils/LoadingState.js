/**
 * 转换App的loading-loaded状态
 *
 * 所有组件可以在beforeCreate时，
 * 使用loadingState.loading(组件名)注册一个loading状态
 * 并在loading结束后，使用loadingState.ok或loadingState.bad结束loading状态
 *
 * 注意：App.vue 的created，mounted方法里必须分别调用 loading，bad方法
 *
 * 在所有组件的loading状态结束后，或该模块初始化三秒后
 * loading状态自动转化为loaded
 * 可使用onLoaded方法捕获该 转化过程
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/15
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/15 herbluo created
 */

import log from './log.js'

class LoadingState {
    constructor() {
        this.haveLoaded = false;
        this.stateMap = {
            length() {
                return Object.keys(this).length - 1;
            }
        };
        setTimeout(() => {
            if (this.haveLoaded === false) {
                this.loaded();
                let onLoadingComponent = '';
                for (let key in this.stateMap) {
                    //noinspection JSUnfilteredForInLoop
                    this.stateMap[key] === 'loading' && (onLoadingComponent += `${key}, \n`)
                }
                const msg = `time out, we have to set the loading state to loaded.\n the components on loading in the follow: \n [${onLoadingComponent}]`;
                log.error(msg);
                throw new Error(msg);
            }
        }, 3000)
    }

    /*
     * public
     */
    /**
     * 整个app初始化的时候调用
     * 使用该方法注册 onLoaded回调
     * @param callback: Function
     */
    onLoaded(callback) {
        this.callback = callback;
    }

    /**
     * 所有需要初始化（即存在耗时操作的方法）的组件，
     * 建议在onCreated里
     * 使用该方法注册loading事件
     *
     * 注意：必须在App.vue(即创世神组件)的created方法之前调用该方法
     *
     * @param str 组件名（确保全局唯一）
     */
    loading(str) {
        log.info(str + ' loading');
        this.state(str, 'loading');
    }

    /**
     * 各组件初始化完毕后调用
     *
     * 注意：必须在App.vue(即创世神组件)的mounted方法里（后）调用该方法
     *
     * @param str （确保全局唯一）
     */
    ok(str) {
        log.info(str + ' ok');
        this.state(str, 'ok')
    }

    /**
     * 各组件初始化完毕后调用
     *
     * @param str （确保全局唯一）
     */
    bad(str) {
        this.state(str, 'bad')
    }

    /*
     * private
     */
    state(str, state) {
        const stateMap = this.stateMap;
        stateMap[str] = state;
        if (this.haveLoaded || state === 'loading') {
            return;
        }
        // 寻找是否存在loading状态的 东东
        const keys = Object.keys(stateMap);
        let index = -1;
        for (let i = 0; i < keys.length; i++) {
            if (stateMap[keys[i]] === 'loading') {
                index = i;
            }
        }
        // 如果未找到 （全部都loading完毕）
        if (index === -1) {
            this.loaded();
        }
    }

    loaded() {
        // 已经调用过了
        if (this.haveLoaded) {
            return;
        }
        // callback必须已注册 #see onLoaded
        if (this.callback) {
            this.haveLoaded = true;
            this.callback();
        } else {
            const msg = 'callback is undefined，use onLoaded(callback: Function) to defined it';
            log.error(msg);
            throw new Error(msg);
        }
    }
}

export default new LoadingState();