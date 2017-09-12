/**
 * 基于weex的storage
 * 整合了promise操作
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/3/30
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/3/30 herbluo created
 */

const storage = weex.requireModule('storage')

export default {

  /**
   * storage.setItem
   * 不会返回reject
   *
   * @param key 要存储的键，不允许是 "" 或 null
   * @param value 要存储的值，不允许是 "" 或 null
   * @return {Promise}
   *         resolve: function(e)
   *              e.result：表示设置是否成功，如果成功返回 "success"
   *              e.data：undefined 表示设置成功，invalid_param 表示 key/value 为 "" 或者 null
   */
  setItem (key, value) {
    return new Promise(resolve => {
      storage.setItem(key, value, event => resolve(event))
    })
  },

  /**
   * storage.setItem
   * 成功即返回 resolve(e.data)
   * 失败返回 reject(e)
   *
   * @param key 要存储的键，不允许是 "" 或 null
   * @param value 要存储的值，不允许是 "" 或 null
   * @return {Promise}
   *         resolve: function(e.data)
   *         reject: function(e)
   *              e.result：表示设置是否成功，如果成功返回 "success"
   *              e.data：undefined 表示设置成功，invalid_param 表示 key/value 为 "" 或者 null
   */
  setItem_resolve_data (key, value) {
    return new Promise((resolve, reject) => {
      storage.setItem(key, value, event => {
        event.result === 'success' ? resolve(event.data) : reject(event)
      })
    })
  },

  /**
   * storage.getItem
   * 不会返回reject
   *
   * @param key 要获取值的名称，不允许是 "" 或 null
   * @return {Promise}
   *         resolve: function(e)
   *              e.result：表示设置是否成功，如果成功返回 "success"
   *              e.data：获取对应的键值字符串，如果没有找到则返回 undefined
   */
  getItem (key) {
    return new Promise((resolve) => {
      storage.getItem(key, event => {
        resolve(event)
      })
    })
  },

  /**
   * storage.getItem
   * 成功返回 resolve(e.data)
   * 失败返回 reject(e)
   *
   * @param key 要获取值的名称，不允许是 "" 或 null
   * @return {Promise}
   *         resolve: function(e)
   *         reject: function(e)
   *              e.result：表示设置是否成功，如果成功返回 "success"
   *              e.data：获取对应的键值字符串，如果没有找到则返回 undefined
   */
  getItem_resolve_data (key) {
    return new Promise((resolve, reject) => {
      storage.getItem(key, event => {
        event.result === 'success' ? resolve(event.data) : reject(event)
      })
    })
  },

  /**
   * storage.removeItem
   * 不会返回 reject
   *
   * the same as storage.removeItem
   * @param key 要存储的键，不允许是 "" 或 null
   * @return {Promise}
   *         resolve: function(e)
   *              e.result：表示删除是否成功，如果成功返回 "success"
   *              e.data：undefined 表示删除成功
   */
  removeItem (key) {
    return new Promise((resolve) => {
      storage.removeItem(key, event => resolve(event))
    })
  },

  /**
   * storage.removeItem
   * 成功返回 resolve(e.data)
   * 失败返回 reject(e)
   *
   * the same as storage.removeItem
   * @param key 要存储的键，不允许是 "" 或 null
   * @return {Promise}
   *         resolve: function(e)
   *         reject: function(e)
   *              e.result：表示删除是否成功，如果成功返回 "success"
   *              e.data：undefined 表示删除成功
   */
  removeItem_resolve_data (key) {
    return new Promise((resolve, reject) => {
      storage.removeItem(key, event => {
        event.result === 'success' ? resolve(event.data) : reject(event)
      })
    })
  },

  /**
   * storage.getAllKeys
   * 不会返回 reject
   *
   * @return {Promise}
   *         resolve: function(e)
   *              e.result：表示设置是否成功，如果成功返回 "success"
   *              e.data：所有键名组成的数组
   */
  getAllKeys () {
    return new Promise(resolve => {
      storage.getAllKeys(event => resolve(event))
    })
  },

  /**
   * storage.getAllKeys
   * 成功返回 resolve(e.data)
   * 失败返回 reject(e)
   *
   * @return {Promise}
   *         resolve: function(e)
   *         reject: function(e)
   *              e.result：表示设置是否成功，如果成功返回 "success"
   *              e.data：所有键名组成的数组
   */
  getAllKeys_resolve_data () {
    return new Promise((resolve, reject) => {
      storage.getAllKeys(event => {
        event.result === 'success' ? resolve(event.data) : reject(event)
      })
    })
  }

}
