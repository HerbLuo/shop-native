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

/* *********
 variables
 ********* */
const actions = {}
const mutations = {}
const getters = {}

/* *********
 actions
 ********* */

/* *********
 mutations
 ********* */
/**
 * 保存登陆信息，转换登陆状态
 *
 * payload.access_token 登录成功后服务器返回的token
 * payload.username 用户名
 */
const SET_USER_ACCESS_TOKEN_ACTION = 'SET_USER_ACCESS_TOKEN_ACTION'
mutations[SET_USER_ACCESS_TOKEN_ACTION] = function (state, payload) {
  state.access_token = payload.access_token

  let username = payload.username
  username && (state.username = username)

  state.login = true
}

/* *********
 exports
 ********* */
export default {
  state: {
    login: false,
    username: '',
    access_token: ''
  },
  getters: {
    ...getters
  },
  mutations,
  actions
}

export {
  SET_USER_ACCESS_TOKEN_ACTION
}
