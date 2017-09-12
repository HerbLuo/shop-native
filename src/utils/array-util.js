/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/28
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/28 herbluo created
 */

const util = {

  /**
   * 冒泡排序
   * @param array
   * @param isAGreaterThanB  a > b, 从小到大排，a < b 从大到小排
   */
  sortBy (array, isAGreaterThanB) {
    const length = array.length
    for (let i = 0; i < length - 1; ++i) {
      for (let j = 0; j < length - i - 1; ++j) {
        if (isAGreaterThanB(array[j], array[j + 1])) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]]
        }
      }
    }
  },

  /**
   * 分组 根据属性进行
   * @param array
   * @param propertyName 属性名
   * @param groups 原有的groups 可选 默认为 []
   * @returns {Array} [{groupId(等同于属性): any, group: Array}]
   */
  groupBy_PropertyEqual (array, propertyName, groups = []) {
    let length = array.length

    for (let i = 0; i < length; i++) {
      let isNew = true
      let groupsLength = groups.length

      for (let j = 0; j < groupsLength; j++) {
        if (array[i][propertyName] === groups[j].groupId) {
          isNew = false
          groups[j].group.push(array[i])
        }
      }
      if (isNew) {
        groups.push({
          groupId: array[i][propertyName],
          group: [array[i]]
        })
      }
    }
    return groups
  },

  /**
   * shop native专用，
   * 其它项目亦可用
   *
   * 从每一个分组完毕的组里面采集一个对象，
   * 最后构成一个数组并返回。
   *
   * 该数组长度与组长度相同
   *
   * @param groups [{group: []}]
   * @param index start from 0
   * @param sorted 'DESC' 降序， 'ASC' 升序
   * @private
   */
  _pickItemFromEachGroup (groups, index, sorted = false) {
    const items = []
    for (let i = 0; i < groups.length; i++) {
      let group = groups[i].group
      let length = group.length
      items.push(group[length > index ? index : length - 1])
    }
    if (sorted !== false) {
      util.sortBy(items, sorted === 'DESC' ? (a, b) => a < b : (a, b) => a > b)
    }
    return items
  },

  /**
   * 判断数组中是否包含某个元素
   */
  includes: function (array, val) {
    if (!isArray(array)) {
      return false
    }
    for (let i = 0; i < array.length; i++) {
      if (typeof val === 'function' ? val(array[i]) : array[i] === val) {
        return true
      }
    }
    if (isNaN(val)) {
      return isArrayIncludeNaN(array)
    }
    return false
  }
}

function isArray (obj) {
  return obj instanceof Array
}

function isArrayIncludeNaN (array) {
  for (let i = 0; i < array.length; i++) {
    if (isNaN(array[i])) {
      return true
    }
  }
  return false
}

function isNaN (val) {
  // eslint-disable-next-line
  return val !== val
}

export default util
