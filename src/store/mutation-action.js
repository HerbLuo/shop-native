/**
 * mutation and action
 * 所有 action必有 ACTION_ 前缀
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/23
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/23 herbluo created
 */

/**
 * 保存 来自闪存的appData
 */
export const SET_APP_DATA_IN_STORAGE = 'SET_APP_DATA_IN_STORAGE';

/**
 * 保存 来自服务端的appData
 */
export const SET_APP_DATA_IN_SERVER = 'SET_APP_DATA_IN_SERVER';

/**
 * 更新闪存中的 appData
 * keySet: json, 替换掉原有的属性
 */
export const ACTION_UPDATE_APP_DATA_IN_STORAGE = 'ACTION_UPDATE_APP_DATA_IN_STORAGE';


/**
 * home
 * 状态转换
 *
 * 将刷新中状态强制转换为刷新完毕
 * 可直接提交该请求，不必检查refreshing的状态
 *
 * 建议仅用于timeout，
 * 正常情况下，该状态会由子组件自动转换
 * @type {string}
 */
export const SET_HOME_REFRESHED = 'SET_HOME_REFRESHED';

/**
 * home
 * 注册事件
 *
 * 某些需刷新的组件
 * 注册 ON_REFRESHING（刷新中） 事件
 *
 * (cb(finished: Function): Function)
 *
 * @type {string}
 */
export const ON_HOME_REFRESHING = 'ON_HOME_REFRESHING';

/**
 * home
 * 状态转换
 *
 * 将主页状态设置为 刷新中
 *
 * @type {string}
 */
export const ACTION_SET_HOME_REFRESHING = 'ACTION_SET_HOME_REFRESHING';