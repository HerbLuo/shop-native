/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/7/13
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/7/13 herbluo created
 */
/* *********
 imports
 ********* */
import '../../utils/log'
import api from '../../api'
import dao from '../../dao'
import _chunk from 'lodash/chunk'
import _sortBy from 'lodash/sortBy'
import {load} from '../../utils/app/loader'
import {get} from '../../utils/app/app-fetch'
import {appVersionHandler} from '../../utils/app/app-version-handler'

/* *********
 variables
 ********* */
const actions = {}
const mutations = {}
const getters = {}

const logKey = 'STORE/APP'

/* *********
 actions
 ********* */

/**
 * 拉取appData
 *
 * onChange: Function(AppVersion)
 *     可通过此接口获取version改变通知
 *     version的改变可能不止一次
 *     因此，纯的Promise不太适合
 *
 *     androidDownloadUrl:"http://"
 *     appCityVersion:"low-v1"
 *     appEntranceVersion:"high-v1"
 *     id:1
 *     versionCode:1
 *     versionName:"1.0"
 */
const FETCH_APPDATA = 'FETCH_APPDATA'
actions[FETCH_APPDATA] = async function (
  {commit, state}, {logKey: plogKey, onChange}) {
  // version 改变回调
  const callback = () => {
    onChange && onChange(state.appDataType === 'server'
      ? state.appDataInServer
      : state.appDataInStorage)
  }

  // 检查 - 是否已拉取
  if (state.appDataType) {
    callback()
    return Promise.resolve()
  }

  // 闪存里获取app数据
  const {result, data} = await dao.get__app()

  // 检查 - 无法读出 app
  if (result !== 'success' || !data) {
    return Promise.reject(new Error(
      '无法访问storage, 无法从storage读出app.'))
  }

  // 闪存中的 appData
  let appData$Storage = data && data !== '' && JSON.parse(data)

  // 检查 - appData 解析失败
  if (typeof appData$Storage !== 'object') {
    return Promise.reject(new Error(
      '无法将appData解析为json，appData为' + appData$Storage))
  }

  // appData in storage 更新时间
  // noinspection JSUnusedAssignment TODO DEBUG, WHEN RELEASE, DEL CURRENT LINE
  let dataUpdateDayTime = new Date().getTime() - appData$Storage.updateTimestamp
  dataUpdateDayTime = 1000 * 60 * 10 // TODO DEBUG, WHEN RELEASE, DEL CURRENT LINE
  dataUpdateDayTime = dataUpdateDayTime < 1000 * 60 * 10
    ? 0 // 小于10分钟为0
    : ((dataUpdateDayTime / 1000 / 60 / 60 / 24) | 0) + 1 // 计算天数

  // 数据更新时间小于10分钟，直接保存闪存数据
  if (dataUpdateDayTime === 0) {
    console.log('[%s] [%s] 数据更新时间少于10分钟', plogKey, logKey)
    commit(SET_APP_DATA_IN_STORAGE_MUTATION, {
      data: appData$Storage,
      type: 'storage'
    })
    callback()
    return Promise.resolve()
  }

  // 更具数据的新旧程度设置delayTime
  const delayTime = dataUpdateDayTime * 100 // 毫秒, 1天等待100毫秒，1月等待3秒

  /*
   * delayTime毫秒内 若服务端未返回结果，
   * 使用storage里的内容做第一次渲染
   */
  return new Promise((resolve, reject) => {
    let timer

    // 从服务端获取最新数据 appData
    get(api.url.getApp()).then(({data: appData$Server}) => {
      clearTimeout(timer)
      console.log('[%s] [%s] 成功从服务器拉取appData, 刷新数据',
        plogKey, logKey)
      appVersionHandler(appData$Server) // 处理 appData
      commit(SET_APP_DATA_IN_SERVER_MUTATION, {
        data: appData$Server,
        type: 'server'
      })
      callback()
      resolve()
    }).catch(err => {
      console.error('[%s] [%s] app data 无法获取， 请检查网络链接',
        plogKey, logKey)
      reject(err)
    })

    /*
     * delayTime 后，
     * 使用闪存中的数据执行第一次数据绑定（第一次渲染）
     */
    timer = setTimeout(() => {
      console.log(`[%s] [%s] %s ms 超时, 使用闪存数据做第一次渲染`,
        plogKey, logKey, delayTime)
      commit(SET_APP_DATA_IN_STORAGE_MUTATION, {
        data: appData$Storage,
        type: 'timer'
      })
      callback()
      resolve()
    }, delayTime)
  })
}

/**
 * 更新闪存中的 appData
 * keySet: json, 替换掉原有的属性
 */
const UPDATE_APP_DATA_IN_STORAGE_ACTION = 'UPDATE_APP_DATA_IN_STORAGE_ACTION'
actions[UPDATE_APP_DATA_IN_STORAGE_ACTION] = ({commit, state}, keySet) => {
  commit(_UPDATE_APP_DATA_IN_STORAGE, keySet)
  dao.debounce_set__app(state.appDataInStorage)
}

/**
 * 拉取app的 入口
 */
const FETCH_ENTRANCE = 'FETCH_ENTRANCE'
actions[FETCH_ENTRANCE] = ({dispatch, commit, state}) => {
  // 检查
  if (state.entrance) {
    return Promise.resolve()
  }

  // .
  return new Promise((resolve, reject) => {
    const onDataGotten = _onDataGotten(
      ::dao.set__entrance_bar,
      (error, data) => {
        if (error) {
          reject(error)
          return
        }
        if (!data) {
          reject(data)
          return
        }
        commit(_SAVE_ENTRANCE_MUTATION, data['entity'])
      }
    )
    dispatch(FETCH_APPDATA, {
      logKey: FETCH_ENTRANCE,
      onChange: ({appEntranceVersion}) => {
        // 检查
        if (!appEntranceVersion) {
          console.warn('[%s] appEntranceVersion 为空 %s',
            logKey, appEntranceVersion)
        }

        // 依次从 cache, storage, server获取entrance
        load({
          logKey: '[STORE/APP/ENTRANCE]',
          version: appEntranceVersion,
          storagePromise: dao.get__entrance_bar(),
          serverPromiseFunc: () => get(api.url.getEntrance()),
          onDataGotten
        })
      }
    })
  })
}

/* *********
 mutations
 ********* */

const SET_APP_DATA_IN_SERVER_MUTATION = 'SET_APP_DATA_IN_SERVER_MUTATION'
mutations[SET_APP_DATA_IN_SERVER_MUTATION] = (state, data) => {
  state.appDataType = data.type
  state.appDataInServer = data.data
}

const SET_APP_DATA_IN_STORAGE_MUTATION = 'SET_APP_DATA_IN_STORAGE_MUTATION'
mutations[SET_APP_DATA_IN_STORAGE_MUTATION] = (state, data) => {
  state.appDataType = data.type
  state.appDataInStorage = data.data
}

// private
const _UPDATE_APP_DATA_IN_STORAGE = '_UPDATE_APP_DATA_IN_STORAGE'
mutations[_UPDATE_APP_DATA_IN_STORAGE] = (state, keySet) => {
  state.appDataInStorage = {
    ...state.appDataInStorage,
    ...keySet
  }
}

const _SAVE_ENTRANCE_MUTATION = '_SAVE_ENTRANCE_MUTATION'
mutations[_SAVE_ENTRANCE_MUTATION] = (state, entrance) => {
  entrance = _sortBy(entrance, 'index')
  entrance = _chunk(entrance, 5)
  state.entrance = entrance
}

/* *********
 private functions
 ********* */
const _onDataGotten = (saveDataApi, callback) => ({data, type}) => {
  switch (type) {
    case 'error':
      callback(data)
      break
    case 'server':
      saveDataApi(JSON.stringify(data))
      callback(null, data)
      break
    case 'storage':
    case 'timer':
    default:
      callback(null, data)
      break
  }
}

/* *********
 exports
 ********* */
export default {
  state: {
    appDataInStorage: {}, // 必有一个不为空
    appDataInServer: {}, // 必有一个不为空
    appDataType: null,

    entrance: null
  },
  getters: {
    ...getters
  },
  mutations,
  actions
}

export {
  SET_APP_DATA_IN_SERVER_MUTATION,
  SET_APP_DATA_IN_STORAGE_MUTATION,

  FETCH_APPDATA,
  FETCH_ENTRANCE,
  UPDATE_APP_DATA_IN_STORAGE_ACTION
}
