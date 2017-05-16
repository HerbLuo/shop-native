/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/22
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/22 herbluo created
 */

import dao from '../dao'
import Vuex from 'vuex'
import {
    SET_APP_DATA_IN_SERVER,
    SET_APP_DATA_IN_STORAGE,
    ACTION_UPDATE_APP_DATA_IN_STORAGE,

    SET_HOME_REFRESHED,
    ON_HOME_REFRESHING,
    ACTION_SET_HOME_REFRESHING,
} from './mutation-action'

/*
 * 私有状态
 */
const __SET_HOME_REFRESHING = 'SET_HOME_REFRESHING';
const __SET_HOME_COMPONENT_REFRESHED = 'SET_HOME_COMPONENT_REFRESHED';
const __UPDATE_APP_DATA_IN_STORAGE = 'UPDATE_APP_DATA_IN_STORAGE';

const store = new Vuex.Store({
    state: {
        appDataInStorage: {},
        appDataInServer: {},
        home: {
            refreshing: false,
        },
        __pri: {
            /*
             * 保存需要刷新的组件
             */
            home_refreshNeededComponentMap: [],
        }
    },
    mutations: {
        /**
         * 保存 来自服务端的appData
         */
        [SET_APP_DATA_IN_SERVER] (state, data) {
            state.appDataInServer = data;
        },

        /**
         * 保存 来自闪存的appData
         */
        [SET_APP_DATA_IN_STORAGE] (state, data) {
            state.appDataInStorage = data;
        },

        /*
         * 私有
         * 更新闪存内的appData
         * @param state
         * @param keySet
         */
        [__UPDATE_APP_DATA_IN_STORAGE] (state, keySet) {
            state.appDataInStorage = {
                ...state.appDataInStorage,
                ...keySet
            };
        },

        /**
         * home
         * 状态转换
         *
         * 将刷新中状态强制转换为刷新完毕
         * 可直接提交该请求，不必检查refreshing的状态
         *
         * 建议仅用于timeout，
         * 正常情况下，该状态会由子组件自动转换
         */
        [SET_HOME_REFRESHED] ({home}) {
            if (home.refreshing === true)
                home.refreshing = false;
        },
        /**
         * home
         * 注册事件
         *
         * 某些需刷新的组件
         * 注册 ON_REFRESHING（刷新中） 事件
         *
         * @param state
         * @param callWhenRefresh (cb(finished: Function): Function)
         */
        [ON_HOME_REFRESHING] (state, callWhenRefresh) {
            state.__pri.home_refreshNeededComponentMap.push({
                finished: false,
                callWhenRefresh
            })

        },

        /*
         * 私有
         * 将home状态设置为刷新中
         */
        [__SET_HOME_REFRESHING] (state) {
            state.home.refreshing = true;
        },
        /*
         * 私有
         * 将某一组件的状态设置为 刷新完毕（由子组件间接调用）
         */
        [__SET_HOME_COMPONENT_REFRESHED] (state, index) {
            state.__pri.home_refreshNeededComponentMap[index].finished = true
        }
    },
    actions: {
        /**
         * home
         * 状态转换
         *
         * 将状态设置为刷新中
         * 调用所有注册了 ON_REFRESHING 事件的组件 home_refreshNeededComponentMap.forEach(c.cb)
         *
         * @param commit
         * @param state
         */
        [ACTION_SET_HOME_REFRESHING] ({commit, state}) {
            // 状态转化为刷新中
            commit(__SET_HOME_REFRESHING);

            const map = state.__pri.home_refreshNeededComponentMap;
            // 调用所有注册的refreshing
            map.forEach((componentMap, index) => {
                // 刷新各组件，参数为刷新完毕的回调
                componentMap.callWhenRefresh(() => {
                    commit(__SET_HOME_COMPONENT_REFRESHED, index);

                    // 寻找是否存在刷新中的组件
                    let found = -1;
                    for (let i = 0; i < map.length; i++) {
                        if (map[i].finished === false) {
                            found = i;
                            break;
                        }
                    }

                    // 不存在（全部刷新完毕）
                    if (found === -1) {
                        commit(SET_HOME_REFRESHED);
                    }
                });
            })
        },

        /**
         * 更新闪存中的 appData
         * @param commit
         * @param state
         * @param keySet
         */
        [ACTION_UPDATE_APP_DATA_IN_STORAGE] ({commit, state}, keySet) {
            commit(__UPDATE_APP_DATA_IN_STORAGE, keySet);
            dao.debounce_set__entrance_bar(state.appDataInStorage);
        }
    }
});

export default store;