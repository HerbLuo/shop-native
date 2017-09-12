/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/5/31
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/5/31 herbluo created
 */
import '../log'
import api from '../../api'
import dao from '../../dao'
import SHA256 from 'crypto-js/sha256'
import {vuebus} from '../../eventbus/index'
import {saveBackPage} from './app-page-helper'
import store, {registerModuleIfNotExist} from '../../store'
import user, {SET_USER_ACCESS_TOKEN_ACTION} from '../../store/modules/user'
import {post} from './app-fetch'

registerModuleIfNotExist('user', user)

const logKey = 'LOGIN'

/**
 * 待处理的产品
 *
 * @constructor (resolve, reject) 分别是处理成功和失败的回调
 */
class Item {
  constructor (resolve, reject) {
    this.resolve = resolve
    this.reject = reject
  }
}

/**
 * 工人
 *
 * @constructor work: promise
 */
class Worker {
  constructor (work) {
    this.inWork = false

    /**
     * 调用work方法即开始处理
     * @type {Promise}
     */
    this.work = () => new Promise((resolve, reject) => {
      this.inWork = true
      work().then(
        (e) => {
          this.inWork = false
          resolve(e)
        },
        (e) => {
          this.inWork = false
          reject(e)
        }
      )
    })
  }
}

/**
 * 该结构
 *
 * 可理解为这样的一段流水线：
 *
 *
 * 单一工人操作
 *
 * 工人坐在流水线的末端
 *
 * 工人执行完一次操作后，该流水线上的所有物品同时被处理完毕
 *
 *
 * 该结构在此处用于登陆请求的合并
 *
 * 与_.debounce的区别在于，
 *
 * 该结构不会舍弃任何一次请求，确保每一个请求都能在适当时间都能获得请求结果
 * (登录请求一段时间内只需发一次，但所有请求的组件都应收到登录成功的通知)
 *
 * @constructor worker Worker的实例，代表工人
 *
 * @function push(item: Item) 往流水线里添加一个待处理的产品
 */
class SinglePipeLine {
  constructor (worker) {
    this.items = [] // 流水线上的物品
    this.worker = worker // 流水线上的工人
  }

  push (item) {
    this.items.push(item)
    this._singlePipeLine()
  }

  _singlePipeLine () {
    if (this.worker.inWork) {
      return
    }
    this.worker.work().then(
      this._whenFinished(true),
      this._whenFinished(false)
    )
  }

  _whenFinished (resolveQ) {
    return (obj) => {
      this.items.forEach(item => item[resolveQ ? 'resolve' : 'reject'](obj))
      this.items = []
    }
  }
}

/* *********
 private variables
 ********* */
let auth // 登陆成功后的信息
let backPage

const _loginWithUiPage = () => {
  saveBackPage(backPage).then(() => {
    vuebus.push('UserLogin')
  }).catch(::console.error)
  // 当前界面永远不会收到成功登录的promise
  return new Promise(() => {
  })
}

/* *********
 private functions
 ********* */
/**
 * token 是否过期
 * @param auth
 * @return {boolean}
 */
const _isTokenExpire = (auth) => {
  return auth.expires_timestamp < new Date().getTime()
}

/**
 * 为auth 生成过期时间戳
 * @param auth
 */
const _updateExpireTimestamp = (auth) => {
  auth.expires_timestamp = new Date().getTime() + auth.expires_in - 5
}

/**
 * 更新并保存登录信息
 * @private
 */
const _updateAndSaveData = (data, username) => {
  _updateExpireTimestamp(data)
  data.username = username
  auth = data
  // 更新 vuex 状态
  store.commit(SET_USER_ACCESS_TOKEN_ACTION, {
    access_token: data.access_token,
    username
  })
}

// noinspection JSUnusedLocalSymbols
/**
 * 刷新key或转向登录界面
 */
const loginWork = () => new Promise(async (resolve, reject) => {
  // 已登陆
  if (store.state.user.login === true &&
    auth &&
    !_isTokenExpire(auth)
  ) { // token 未失效
    console.log('[%s] token 未失效，采用了内存中的token', logKey)
    resolve()
    return
  }

  console.log('[%s] 登陆中', logKey)

  /*
   * 未登录
   * 1. 判断是否存已经登陆过（是否有 auth 信息）
   * 2. 判断闪存内是否存在refresh_token，以及token是否过期
   * 3. ui登陆，弹出登录界面
   */
  let refreshToken, username
  if (auth && auth.refresh_token) {
    refreshToken = auth.refresh_token
  } else {
    let user = await dao.get__user()
    user = user.data
    try {
      user = JSON.parse(user)
    } catch (e) {
    }
    refreshToken = user && user.refresh_token
    username = user && user.username
  }

  // 已有refresh_token
  if (refreshToken) {
    console.log('[%s] 使用refresh_token刷新中', logKey)
    // 刷新key
    const event = await post(api.url.refreshToken(refreshToken))
      .catch(::console.log)

    const data = event && event.data

    // 刷新成功
    if (data && data.access_token) {
      console.log('[%s] 刷新完毕', logKey)
      _updateAndSaveData(data, username)
      resolve(true)
      return
    }
  }

  console.log('[%s] token刷新失败，转向登录界面', logKey)
  _loginWithUiPage()
  resolve(false)
})

const loginWorker = new Worker(loginWork)
const loginSinglePipeLine = new SinglePipeLine(loginWorker)

/**
 * 等到登陆成功（或失败） promise
 *
 * @param [nextPage] {string}
 * @return {Promise}
 */
const waitWhileLogin = (nextPage) => {
  backPage = nextPage
  return new Promise((resolve, reject) => {
    loginSinglePipeLine.push(new Item(resolve, reject))
  })
}

/**
 * 使用用户名 密码登陆
 *
 * @param username 用户名
 * @param password 密码
 * @return {Promise.<>} resolve true, false
 *                      reject catch an error
 */
const loginByUsnAndPsd = (username, password) => {
  if (!username || !password) {
    return Promise.reject(new Error('用户名或密码不能未空'))
  }

  return post(api.url.getToken(username, SHA256(password)))
    .then(
      ({data: auth}) => {
        const isLoginSuccess = !!(auth && auth.access_token)
        if (isLoginSuccess) {
          _updateAndSaveData(auth, username)
          dao.set__user(`{"refresh_token": "${auth.refresh_token}", "username": "${username}"}`)
        }
        return Promise.resolve(isLoginSuccess)
      }
    )
}

export {
  waitWhileLogin,
  loginByUsnAndPsd
}
