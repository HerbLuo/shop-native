/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/6/23
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/6/23 herbluo created
 */
/* *********
 import
 ********* */

import '../../utils/log'
import _find from 'lodash/find'

/* *********
 variables
 ********* */
const actions = {}
const mutations = {}
const getters = {}

const refreshNeededComponentMap = [] // 保存需要刷新的组件

/* *********
 actions
 ********* */
/**
 * home
 * 状态转换
 *
 * 将状态设置为刷新中
 * 调用所有注册了 ON_REFRESHING 事件的组件 home_refreshNeededComponentMap.forEach(c.cb)
 *
 * @param commit
 */
const REFRESHING_ACTION = 'REFRESHING_ACTION'
actions[REFRESHING_ACTION] = function ({commit}) {
  console.log('[STORE/HOME] 模块刷新中')
  // 状态转化为刷新中
  commit(_SET_STATE_REFRESHING)

  // 调用所有注册的refreshing
  refreshNeededComponentMap.forEach((componentMap, index) => {
    // 刷新各组件，参数为刷新完毕的回调
    componentMap.callWhenRefreshing(() => {
      commit(_SET_COMPONENT_REFRESHED, {index})

      // 寻找是否存在刷新中的组件
      _find(refreshNeededComponentMap, val => !val.finished) ||
      commit(SET_REFRESHED_MUTATION) // 未找到（全部已刷新）
    })
  })
}

/* *********
 mutations
 ********* */
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
const SET_REFRESHED_MUTATION = 'SET_REFRESHED'
mutations[SET_REFRESHED_MUTATION] = function (state) {
  if (state.refreshing === true) {
    state.refreshing = false
  }
}

/**
 * home
 * 注册事件
 *
 * 某些需刷新的组件
 * 注册 ON_REFRESHING（刷新中） 事件
 *
 * payload.callWhenRefreshing 当刷新时的事件
 *
 * @type {string}
 */
const ON_REFRESHING_MUTATION = 'ON_REFRESHING_MUTATION'
mutations[ON_REFRESHING_MUTATION] = function (state, payload) {
  refreshNeededComponentMap.push({
    finished: false,
    callWhenRefreshing: payload.callWhenRefreshing
  })
}

/*
 * 私有
 * 将home状态设置为刷新中
 */
const _SET_STATE_REFRESHING = '_SET_STATE_REFRESHING'
mutations[_SET_STATE_REFRESHING] = function (state) {
  state.refreshing = true
}

/*
 * 私有
 * 将某一组件的状态设置为 刷新完毕（由子组件间接调用）
 */
const _SET_COMPONENT_REFRESHED = '_SET_COMPONENT_REFRESHED'
mutations[_SET_COMPONENT_REFRESHED] = function (state, payload) {
  refreshNeededComponentMap[payload.index].finished = true
}

/* *********
 export
 ********* */
export default {
  state: {
    refreshing: false
  },
  getters: {
    ...getters
  },
  mutations,
  actions
}

export {
  REFRESHING_ACTION,
  ON_REFRESHING_MUTATION,
  SET_REFRESHED_MUTATION
}
