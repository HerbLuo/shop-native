/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/6/15
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/6/15 herbluo created
 */
import '../../utils/log'
import dao from '../../dao/index'
import api from '../../api/index'
import _groupBy from 'lodash/groupBy'
import {load} from '../../utils/app/loader'
import {get} from '../../utils/app/app-fetch'
import {createError} from '../../utils/error'
import {registerModuleIfNotExist} from '../index'
import app, {FETCH_APPDATA, UPDATE_APP_DATA_IN_STORAGE_ACTION} from './app'

/* *********
 variable
 ********* */
const actions = {}
const mutations = {}

const logKey = 'STORE/CITY'

/**
 * 获取城市信息
 *
 * 城市信息区分版本，当版本有更新，需从服务器端拉取最新数据，否则使用闪存数据
 *
 * 当服务器拉取超时，先试用闪存数据（提交一个'timer'的stream数据），
 * 当服务器数据拉取完毕后，通知使用者重新渲染视图（提交一个'server'的stream数据）
 * 具体的城市信息在store中给出
 *
 */
const FETCH_PROV_CITY_AREA = 'FETCH_PROV_CITY_AREA'
actions[FETCH_PROV_CITY_AREA] = function ({commit, state, dispatch}) {
  if (state.provCityArea) {
    return Promise.resolve()
  }

  registerModuleIfNotExist('app', app)

  /**
   * 检查数据是否需要更新（第一次读取闪存数据后需更新）
   */
  const __isDataNeedUpdate = (entity) => {
    return entity instanceof Array && entity.length > 100
  }

  /**
   * 保存城市信息到闪存
   */
  const __saveProvCityArea = (data) => {
    dao.set__prov_city_area(JSON.stringify(data)).then(e => {
      if (e.result === 'success') {
        dispatch(UPDATE_APP_DATA_IN_STORAGE_ACTION, {appCityVersion: data.version})
      }
    })
  }

  /**
   * 转换数据类型
   */
  const __updateData = (data) => {
    data = _groupBy(data, 'level');

    [1, 2, 3].forEach(level => {
      if (!data[level]) {
        console.error('[%s] 不存在level%s的城市数据', logKey, level)
      }
    })

    // 市级数据按照省级分组
    data[2] = _groupBy(data[2], 'parentId')

    // 区级数据按照市级分组
    data[3] = _groupBy(data[3], 'parentId')

    return data
  }

  /**
   * 检查并更新数据（第一次读取闪存数据后需更新）
   */
  const __checkAndUpdateData = (data) => {
    if (__isDataNeedUpdate(data.entity)) {
      console.log('[STORE/CITY] 未处理的数据，现在开始处理')
      data.entity = __updateData(data.entity)
    }
    return data
  }

  /**
   * @return {Promise}
   */
  const __onDataGotten = ({data, type}) => {
    switch (type) {
      case 'error':
        return Promise.reject(data)

      default:
        __checkAndUpdateData(data)
        __saveProvCityArea(data)

        commit(CHANGE_PROV_CITY_AREA, {provCityArea: data.entity})
        return Promise.resolve()
    }
  }

  // 开始拉取数据
  const __fetch = (version, onDataGotten) => {
    load({
      logKey: '[STORE/CITY]',
      version: version,
      storagePromise: dao.get__prov_city_area(),
      serverPromiseFunc: () => get(api.url.getProvCityArea()),
      onDataGotten
    })
  }

  return new Promise((resolve, reject) => {
    // 城市信息区分版本，当版本有更新，需从服务器端拉取最新数据
    // 当App版本信息（包块城市模块版本）成功拉取时
    dispatch(FETCH_APPDATA, {
      logKey,
      onChange (appVersion) {
        __fetch(appVersion.appCityVersion, (event) => {
          __onDataGotten(event).then(resolve).catch(reject)
        })
      }
    }).catch(reject)
  })
}

/**
 * 获取街道信息
 */
const FETCH_STREET = 'FETCH_STREET'
actions[FETCH_STREET] = function ({commit, state}, payload) {
  if (state.streetss && state.streetss[payload.areaCode]) {
    return Promise.resolve()
  }

  return get(api.url.getStreetByAreaCode(payload.areaCode))
    .then(({data}) => {
      if (data instanceof Array) {
        commit(UPDATE_STREET, {areaCode: payload.areaCode, data})
        return Promise.resolve()
      }
      return Promise.reject(createError('无法解析街道信息', data))
    })
}

/**
 * 修改省市区三级信息
 * @type {string}
 */
const CHANGE_PROV_CITY_AREA = 'CHANGE_PROV_CITY_AREA'
mutations[CHANGE_PROV_CITY_AREA] = function (state, payload) {
  state.provCityArea = payload.provCityArea
}

/**
 * 增加街道信息
 * @type {string}
 */
const UPDATE_STREET = 'UPDATE_STREET'
mutations[UPDATE_STREET] = function (state, payload) {
  const streets = state.streetss || {}
  streets[payload.areaCode] = payload.data

  state.streetss = streets
}

/* *********
 store
 ********* */
export default {
  state: {
    provCityArea: null,
    streetss: null
  },
  mutations,
  actions
}

/* *********
 export
 ********* */
export {
  FETCH_PROV_CITY_AREA,
  FETCH_STREET
}
