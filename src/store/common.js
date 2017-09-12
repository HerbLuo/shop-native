/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/6/16
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/6/16 herbluo created
 */

import {vuebus} from '../eventbus'
import {getATimeoutReject} from '../utils/timer'

const isFromServerMap = {}

/**
 * （获取App版本信息）
 * 当闪存版本或服务器版本初始化完毕时
 *
 * 若执行了 storage类型的回调，可能会在服务端返回结果后再次回调
 * 若执行了server类型的回调，必然不会再次回调
 *
 */
export function whenVersioned (key, callWhenVersionGetted) {
  let state = vuebus.$store.state

  let version

  version = state.appDataInServer[key]
  if (version) {
    callWhenVersionGetted({
      type: 'server', version
    })
    return
  }

  version = state.appDataInStorage[key]
  if (version) {
    callWhenVersionGetted({type: 'storage', version})
    return
  }

  vuebus.$watch('$store.state.appDataInServer.' + key, function (v) {
    isFromServerMap[key] = true
    callWhenVersionGetted({type: 'server', version: v})
  })

  vuebus.$watch('$store.state.appDataInStorage.' + key, function (v) {
    isFromServerMap[key] || callWhenVersionGetted({type: 'storage', version: v})
  })
}

/**
 * whenVersioned的promise版本
 * @param key
 * @return {Promise.<*>}
 */
export function whenVersioned$Promise (key) {
  return Promise.race([
    new Promise(resolve => whenVersioned(key, resolve)),
    getATimeoutReject(8000)
  ])
}
