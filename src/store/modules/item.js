/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/6/18
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/6/18 herbluo created
 */
/* *********
 * import
 ********* */
import '../../utils/log'
import api from '../../api/index'
import dao from '../../dao/index'
import {
  loadFromStorage$Promise,
  loadFromServer$Promise
} from '../../utils/app/loader'

import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _concat from 'lodash/concat'
import _findIndex from 'lodash/findIndex'
import {get} from '../../utils/app/app-fetch'

/* *********
 variables
 ********* */
const actions = {}
const mutations = {}

/**
 * 拉取商品
 *
 * payload.itemIds 需拉取的商品的id数组
 *
 * 拉取成功后:
 * 返回Promise.resolve, 且可通过state.items[id]访问
 *
 */
const FETCH_ITEM = 'FETCH_ITEM'
actions[FETCH_ITEM] = function ({commit, state}, payload) {
  if (!payload.itemIds) {
    const error = new Error('FETCH_ITEM 参数错误')
    console.warn(error)
    return Promise.reject(error)
  }

  // 寻找是否存在未拉取的数据
  const needFetchItemIds = payload.itemIds.filter(itemId => {
    return !(state.items[itemId])
  })
  if (needFetchItemIds.length === 0) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const storagePromises = [] // 从闪存获取 商品(s) 的promise(s)
    let fetchedItems = [] // 已经拉取到的数据

    // 从闪存拉取闪存存在的商品
    needFetchItemIds.forEach(itemId => {
      storagePromises.push(
        loadFromStorage$Promise(dao.get_by__item__by_id(itemId)).then(
          e => fetchedItems.push(e),
          _ => _
        )
      )
    })

    const itemIds = needFetchItemIds // url参数1
    const itemVersions = [] // url参数2

    // 从服务端拉取剩余的商品
    Promise.all(storagePromises).then(() => {
      // 构造参数
      itemIds.forEach(itemId => {
        let item = _find(fetchedItems, {id: itemId})
        itemVersions.push(item ? item.version : '')
      })

      let timer
      // 从服务端请求商品
      loadFromServer$Promise(get(api.url.getItemsByIdsAndVersions(itemIds, itemVersions)))
        .then(data => {
          clearTimeout(timer)

          data.forEach(item => {
            item.picLinksJson = JSON.parse(item.picLinksJson)
          })

          updateFetchedItems(data)
          commit(SAVE_ITEM_MUTATION, {items: fetchedItems, override: true})

          resolve()
        })
        .catch(e => {

        })

      timer = setTimeout(() => {
        commit(SAVE_ITEM_MUTATION, {items: fetchedItems, override: false})
        resolve()
      }, 1000)
    })

    // 将服务端拉取到的items并入到fetchedItems
    function updateFetchedItems (items) {
      fetchedItems = _filter(fetchedItems, item => _findIndex(items, {id: item.id}) === -1)
      fetchedItems = _concat(fetchedItems, items)
      return fetchedItems
    }
  })
}

/**
 * 拉取商品详情
 *
 * 初步处理：
 *  * 将describeJsonArray的json字符串转化成json对象
 *
 * @param. payload.itemId 需获取详情的商品的id
 * @return Promise.<?>
 *
 * _note_ 只从内存或服务端拉取数据
 */
const FETCH_ITEM_DETAIL_DESCRIBE = 'FETCH_ITEM_DETAIL_DESCRIBE'
actions[FETCH_ITEM_DETAIL_DESCRIBE] = function ({commit, state}, payload) {
  let itemId = payload.itemId

  let itemDetail = state.itemDetails[itemId]

  if (itemDetail && itemDetail.descirbes) {
    return Promise.resolve()
  }

  return loadFromServer$Promise(get(api.url.getItemDetailDescribe(itemId)))
    .then(data => {
      // 描述数组
      let describes = JSON.parse(data.describeJsonArray)
      if (describes instanceof Array) {
        // 将字符串分割
        describes = describes.map(d => {
          let a = d.split(':')
          return {
            key: a[0],
            value: a[1]
          }
        })
      } else {
        return Promise.reject(data)
      }

      commit(SAVE_ITEM_DETAIL_DESCRIBE, {itemId, describes})
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/**
 * 保存商品的描述信息
 *
 * payload.itemId 描述信息对应的商品id
 * payload.describes 描述信息
 */
const SAVE_ITEM_DETAIL_DESCRIBE = 'SAVE_ITEM_DETAIL_DESCRIBE'
mutations[SAVE_ITEM_DETAIL_DESCRIBE] = function (state, payload) {
  let itemId = payload.itemId

  let itemDetail = state.itemDetails[itemId] || {}

  itemDetail.describes = payload.describes

  state.itemDetails[itemId] = itemDetail
}

/**
 * 保存商品信息
 *
 * payload.items 需保存的商品数组
 *
 */
const SAVE_ITEM_MUTATION = 'SAVE_ITEM_MUTATION'
mutations[SAVE_ITEM_MUTATION] = function (state, payload) {
  const items = state.items
  const itemIds = state.itemIds

  const override = payload.override // 当某个id的商品已经存在时是否覆盖原有商品数据

  payload.items.forEach(item => {
    let id = item.id
    if (override) {
      items[id] = item // 添加商品
    } else {
      items[id] = items[id] || item // 如商品已存在，则跳过
    }
    itemIds.push(id) // 添加商品id信息
  })

  state.items = items
  state.itemIds = itemIds
}

/**
 * 更新当前正在浏览的商品，用于商品结算
 *
 * payload.itemId 正在浏览的商品id
 */
const UPDATE_CURRENT_ITEM_MUTATION = 'UPDATE_CURRENT_ITEM_MUTATION'
mutations[UPDATE_CURRENT_ITEM_MUTATION] = function (state, payload) {
  state.currentItemId = payload.itemId
}

/**
 * 释放部分商品信息
 * 减缓内存压力
 */
const RELEASE_SOME_ITEM = 'RELEASE_SOME_ITEM'
mutations[RELEASE_SOME_ITEM] = function (state) {
  let itemIds = state.itemIds

  for (let i = 0; i < (itemIds.length / 2 | 0); i++) {
    state.items[itemIds[i]] = null
  }

  itemIds = itemIds.splice((itemIds.length / 2) | 0)
  state.itemIds = itemIds
}

/* *********
 exports
 ********* */
export default {
  state: {
    // 当前浏览的item
    currentItemId: null,
    // 缓存的item
    items: {},
    // 缓存的item对应的id（顺序只和数据新旧有关）
    itemIds: [],
    // 商品详情
    itemDetails: {
      'item-id': {
        descirbes: null
      }
    }
  },
  mutations,
  actions
}

export {
  SAVE_ITEM_MUTATION,
  UPDATE_CURRENT_ITEM_MUTATION,
  FETCH_ITEM,
  FETCH_ITEM_DETAIL_DESCRIBE
}
