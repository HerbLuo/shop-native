/**
 * axios 的response处理器
 * 用于 返回值 处理，包括
 * 请求 错误处理
 * 用户 access_token 续租
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/3/28
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/3/28 herbluo created
 */
import regexUtil from '../regex-util'
import storage from './storage-promise'
import api from '../../api'

const JS_CLIENT_REQUEST_REGION = 'js-client-request-region';
const errorMapping = {}; // 保存需保存的response，利用response.
export const log = [];

export default {
    success(response) {
        const data = response.data;
        if (!data) return response;

        const url = response.config.url;
        if (!url) return response;

        // 本次请求为登陆请求，且token获取成功
        let access_token;
        if (data && (access_token = data.access_token)) {
            let region = regexUtil.urlParamGetter(url, JS_CLIENT_REQUEST_REGION);
            if (region) {
                let promise = resolveRequest(region, access_token);
                deleteRequest(region);
                return promise;
            }
        }
        return response;
    },
    /**
     * 监测异常返回结果 进行相关操作
     */
    error(error) {
        if (!error) return Promise.reject(error);

        const response = error.response;
        if (!response) return Promise.reject(error);
        // 调试
        console.info(response);

        const url = response.config.url;
        // 妈的，这什么情况
        if (typeof url !== 'string') {
            log.push({'error': response});
            return Promise.reject(error);
        }

        const status = response.status;
        const data = response.data;

        // 401 无权限 此时尝试自动续租
        if (status === 401 && data) {
            /*
             * 避免无限401请求
             * url中存在 一标志，该标识表明当前请求由此处理器产生,
             * 该请求为认证请求，第二次认证请求仍然失败，故无需再次认证，直接退出
             */
            let region = regexUtil.urlParamGetter(url, JS_CLIENT_REQUEST_REGION);
            if (region) {
                deleteRequest(region);
                return Promise.reject(error);
            }

            // 未认证
            if (data.error === 'unauthorized') {
                const region = 0 | (Math.random() * 100000000);
                saveRequest(region, error);
                return authorized(region);
            }
        }
    }
}

/**
 * 保存请求，
 * 当某个请求返回401结果后，保存该请求，
 * 并在适当时机* 利用{@link resolveRequest}再次发送该请求
 *
 * 注 *一个401 response接收后，
 *    该处理器{the default function}会立即发送一个authorized{@link authorized}请求，
 *    适当时机指该请求返回了一个access_token
 *
 * @param region
 * @param error
 */
function saveRequest(region, error) {
    errorMapping[region] = error;
}

/**
 * 删除请求
 * @param region
 */
function deleteRequest(region) {
    delete errorMapping[region];
}

/**
 * 解析请求
 * 根据region获取request对象
 * 并使用该对象构造出一个 http请求 并发送
 *
 * @param region
 * @param access_token
 * @return {Promise}
 */
function resolveRequest(region, access_token) {
    const error = errorMapping[region];
    let config;
    // 不支持该请求的情况下
    if (!error || !error.response || !(config = error.response.config)) {
        return Promise.reject(error)
    }

    let tmpurl = regexUtil.urlParamSetter(config.url, 'access_token', access_token);
    tmpurl = tmpurl + `&${JS_CLIENT_REQUEST_REGION}=${region}`;
    config.url = tmpurl;

    //noinspection JSUnresolvedFunction
    return Vue.axios.request(config);
}

/**
 * 弹出登陆界面，让用户手动登陆
 */
function login(resolve, reject) {

}

/**
 * 尝试利用storage内存储的信息进行认证
 * @return {Promise}
 */
function authorized(region) {
    return new Promise(async (resolve, reject) => {
        storage.getItem_resolve_data('refresh_token').then((data) => {

            /*
             * 存在 refresh_token
             * 利用 refresh_token登陆
             */
            //noinspection JSUnresolvedFunction
            Vue.axios.post(api.url.refreshToken(data) + `&${JS_CLIENT_REQUEST_REGION}=${region}`)
                .then(res => resolve(res), err => reject(err));
        }, () => {

            /*
             * 不存在 refresh_token
             */
            Promise.all([storage.getItem_resolve_data('username'), storage.getItem_resolve_data('password')]).then(data => {

                /*
                 * 存在username和password
                 * 利用username和password登陆
                 */
                const username = data[0], password = data[1];
                /*
                 * password不合法，用户手动登陆
                 */
                password.length !== 64 && login(resolve, reject);
                /*
                 * 发送登录请求
                 */
                //noinspection JSUnresolvedFunction
                Vue.axios.post(api.url.getToken(username, password) + `&${JS_CLIENT_REQUEST_REGION}=${region}`)
                    .then(res => resolve(res), err => reject(err));
            }, () => {

                // 需要用户手动登陆或注册
                login(resolve, reject);
            })
        });
    });
}


