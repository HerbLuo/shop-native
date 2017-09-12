/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/7/7
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/7/7 herbluo created
 */

/* *********
 import
 ********* */
import '../../utils/log'
import api from '../../api'
import _find from 'lodash/find'
import {waitWhileLogin} from '../../utils/app/login'
import * as loader from '../../utils/app/loader'
import {get} from '../../utils/app/app-fetch'
import {createError} from '../../utils/error'

/* *********
 variables
 ********* */
const actions = {}
const mutations = {}
const getters = {}

/* *********
 actions
 ********* */
/**
 * 获取收货地址
 */
const FETCH_ADDRESS = 'FETCH_ADDRESS'
actions[FETCH_ADDRESS] = async function ({commit, state, rootState}) {
  if (state.addresses.length > 0) {
    return Promise.resolve()
  }

  // 如果未登录，尝试登录
  try {
    await waitWhileLogin()
  } catch (e) {
    return Promise.reject(createError('用户未登录', e))
  }

  // 获取收货地址
  let user = rootState.user
  return loader
    .loadFromServer$Promise(get(api.url.getAddress(
      user.username, user.access_token)))
    .then((data) => {
      commit(SAVE_ADDRESSES, {addresses: data})
    })
}

/* *********
 mutations
 ********* */
/**
 * 保存收货地址
 *
 * payload.addresses 收货地址数组
 */
const SAVE_ADDRESSES = 'SAVE_ADDRESSES'
mutations[SAVE_ADDRESSES] = function (state, payload) {
  state.addresses = payload.addresses
}

/* *********
 export
 ********* */
export default {
  state: {
    addresses: []
  },
  getters: {
    defaultAddress (state) {
      return _find(state.addresses, d => d.areDefault === true)
    },
    ...getters
  },
  mutations,
  actions
}

export {
  FETCH_ADDRESS
}
