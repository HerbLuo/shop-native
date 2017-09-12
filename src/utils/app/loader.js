/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/5/5
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/5/5 herbluo created
 */

import '../log'
import {getATimeoutReject} from '../timer'

/*
 * 获取等待网络请求的时间
 */
function _getDelayTime (version) {
  /*
   * 渲染优先级
   * 存在于版本字符串的开头，使用'-'分隔
   * 优先级越高，等待网络请求的时间越短（执行第一次渲染的时间越短）
   */
  const priority = version ? version.split('-')[0] : undefined

  /*
   * 等待网络请求的时间
   */
  return ({
    real: 100,
    high: 300,
    low: 1500,
    off: 8000
  })[priority] || 700
}

/*
 * 从闪存中获取
 */
function _getDataFromStorage ({logKey = '[LOADER]', storagePromise, version},
  {storageFilter, storageThru = storageFilter}) {
  // .
  return Promise.resolve().then(async () => {
    // 未配置闪存数据获取方式，即不使用缓存数据
    if (!storagePromise) {
      return Promise.reject(new Error('未配置闪存数据获取方式，即不使用缓存数据'))
    }

    if (!version) {
      console.log('%s 参数version没有定义', logKey)
    }

    // 从闪存中获取数据
    let {data} = await storagePromise

    // 字符串解析成对象
    try {
      data = (data && data !== 'undefined' && JSON.parse(data))
    } catch (e) {
      console.warn('%s 无法解析闪存数据: %s', logKey, data)
      return Promise.reject(e)
    }

    // 闪存中无相应数据
    if (!data) {
      return Promise.reject(new Error('闪存中无相应数据'))
    }

    // 闪存中的entrances版本可用
    if (!version || version === '*' || data.version === version) {
      // 没有定义 闪存数据处理器
      if (!storageThru) {
        console.info('%s 使用闪存中的数据', logKey)
        return Promise.resolve(data)
      }

      let ndata = storageThru(data)

      switch (ndata) {
        case null:
        case undefined:
          console.warn('%s 闪存数据过滤器返回了一个undefined', logKey)
          break

        // 舍弃该闪存数据
        case false:
          console.info('%s 闪存数据过滤器弃用了该组数据', logKey)
          return Promise.reject(data)

        default:
          // 替换该数据
          console.info('%s 使用闪存中的数据', logKey)
          return Promise.resolve(ndata === true ? data : ndata)
      }
    }

    return Promise.reject(data)
  })
}

/*
 * 从服务端获取
 */
function _getDataFromServer ({logKey = '[LOADER]', serverPromiseFunc},
  {serverDataGotten}) {
  // .
  return Promise.resolve().then(() => {
    let serverPromise = serverPromiseFunc && serverPromiseFunc()

    // 传入参数错误 server promise 不存在
    if (!serverPromise || !(serverPromise instanceof Promise)) {
      const error = new Error(`${logKey}server promise 不存在`)
      console.error(error)
      return Promise.reject(error)
    }

    // 从服务端拉取数据
    return serverPromise.then(event => {
      console.info('%s 使用服务端的数据', logKey)

      serverDataGotten && serverDataGotten(event.data)

      return Promise.resolve(event.data)
    }).catch(error => {
      console.warn('%s 数据拉取失败 %s', logKey, error)
      return Promise.reject(error)
    })
  })
}

/*
 * 加载数据(从各种地方)
 */

/**
 * 加载数据
 * 依次从闪存，服务器拉取数据
 *
 *
 * 1. 可不指定 storagePromise，直接从服务端拉取数据
 *
 * 1. 指定了 storagePromise 的同时需指定 version
 *
 * 1. 对于服务端的数据，如不存在version，（且参数中指定了version）
 *    会外包一层并加入version属性，原有数据放于data属性中
 *
 * 1. 如拉取服务端数据超时，会先返回一次闪存中的旧数据，待数据正常返回后，执行第二次回调
 *
 *  NOTE1: version的组成：'{渲染优先级}-v{版本}'
 *         说明：渲染优先级指定了第一次渲染的时间（delayTime）
 *  NOTE1: real: 100, high: 300, low: 1500, off: 8000,
 *         例 rel代表100毫秒内必定执行第一次渲染，
 *         如需更短，请考虑使用 '*'
 *  NOTE1: 'rel-nocache' 可以用这样的方式保证数据的版本最新且用户等待时间很短
 *
 * @param logKey 可选 日志标记（建议使用组件名）
 *
 * @param version: string 可选 数据的版本 '*' | undefined | '{渲染优先级}-{版本}'
 * @param storagePromise 读取本地缓存数据的 promise
 *
 * @param serverPromiseFunc 请求服务端数组的方法，要求返回一个promise
 *
 * @param onDataGotten: Function(event)
 *          event.type: ['storage', 'server', 'error', 'timer']
 *          event.data: {version, data} | {?}
 *
 *
 * @param lifecycle ... PackedData {version, entity: data}
 * @param lifecycle.storageThru: (data: PackedData): PackedData|boolean
 *                     验证storage数据版本并可替换数据，
 *                     false表示舍弃本次数据，
 *                     true表示不处理本次数据
 * @param lifecycle.storageFilter: (data: PackedData): PackedData|boolean
 *                     storageThru 的别名
 *
 *
 * @param lifecycle.serverDataGotten: (data: object): object
 *                        在服务端数据返回后，处理服务端数据
 * @param lifecycle.serverDataPacked (data: PackedData):
 *                        PackedData|false|'error'|Promise
 *                        在服务端数据加上版本信息后
 *
 * @param lifecycle.onDataGotten 数据获取成功或失败后
 *
 *
 */
export function load (
  {
    logKey = '[LOADER]',
    version,
    storagePromise,
    serverPromiseFunc,
    onDataGotten
  },
  lifecycle = {}) {
  // .
  console.info('[UTIL/LOADER] load %s', logKey)

  onDataGotten = onDataGotten || lifecycle.onDataGotten

  // 等到从闪存拉取数据成功后
  _getDataFromStorage({logKey, version, storagePromise}, lifecycle).then(
    // 闪存数据可用
    data => onDataGotten({data, type: 'storage'}),

    // 闪存数据拉取失败
    data => {
      let timer
      // 从服务端拉取数据
      _getDataFromServer({logKey, serverPromiseFunc}, lifecycle).then(data => {
        // .
        timer && clearTimeout(timer)

        version && data.version && (data = {version, entity: data})

        let serverDataPacked = lifecycle.serverDataPacked
        let ndata = serverDataPacked && serverDataPacked(data)

        switch (ndata) {
          case null:
          case undefined:
            console.warn('%s serverDataGotten返回了一个undefined', logKey)
            break

          case 'error':
            onDataGotten({data: 'serverDataPacked返回了异常', type: 'error'})
            break

          case false:
            break

          default:
            if (ndata instanceof Promise) {
              return ndata
            }

            ndata && (data = ndata)
        }

        onDataGotten({data, type: 'server'})
      }).catch(error => {
        onDataGotten({
          type: 'error',
          data: 'server promise 不存在 ' + error,
          error
        })
      })

      // 如果不存在闪存中的数据，就不必执行超时程序
      if (!data) {
        return
      }

      // 超时后使用闪存数据执行第一次回调，不影响服务端拉取代码的执行
      timer = setTimeout(() => {
        if (data) {
          console.info('%s render data from timeout', logKey)
          typeof data === 'object' && onDataGotten({data, type: 'server'})
        } else {
          console.warn('%s 数据拉取超时但仍在继续', logKey)
        }
      }, _getDelayTime(version))
    }
  )
}

/**
 * 直接从服务端获取数据
 *
 * @param polytype 允许多种类型
 *                 1. 同load
 *                 2. promise
 *                 3. function，返回一个promise的function
 *
 * @return {Promise.<*>}
 *          Promise.resolve 数据拉取成功，参数为服务端返回的data
 *          Promise.reject 数据拉取失败
 */
export function loadFromServer$Promise (polytype) {
  let config

  if (polytype instanceof Promise) {
    config = {
      serverPromiseFunc: function () {
        return polytype
      }
    }
  } else if (typeof polytype === 'function') {
    config = {serverPromiseFunc: polytype}
  } else if (typeof polytype === 'object') {
    config = polytype
  } else {
    const error = new Error('polytype 无法识别')
    console.error(error)
    return Promise.reject(error)
  }

  return _getDataFromServer(config, {})
}

/**
 * 从闪存拉取数据
 *
 * @param polytype 允许多种类型
 *                 1. 同load
 *                 2. promise
 *                 3. function，返回一个promise的function
 *
 * @return {Promise.<*>}
 *          Promise.resolve 数据拉取成功，参数为闪存中存储的data
 *          Promise.reject 数据拉取失败
 */
export function loadFromStorage$Promise (polytype) {
  let config

  if (polytype instanceof Promise) {
    config = {storagePromise: polytype}
  } else if (typeof polytype === 'object') {
    config = polytype
  } else {
    const error = new Error('polytype 无法识别')
    console.error(error)
    return Promise.reject(error)
  }

  config.version = '*'

  return _getDataFromStorage(config, {})
}

/**
 * load 的promise兼容方案，
 *
 * 只可用于无缓存或可使用任意版本缓存的情况下
 *
 * @return {Promise.<*>}
 */
export function load$Promise (config, lifecycle) {
  return Promise.race([
    new Promise(resolve => {
      config.onDataGotten = resolve
      load(config, lifecycle)
    }),
    getATimeoutReject(8000)
  ])
}
