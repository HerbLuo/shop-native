/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/27
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/27 herbluo created
 */

import _debounce from 'lodash/debounce'
import arrayUtil from '../utils/array-util'
import storagePromise from '../utils/app/storage-promise'

/**
 * 数据持久层，
 *
 * 自动重写 所有 方法名中存在 __ 的方法
 *
 * 支持的前缀有
 *
 * * get, set, remove
 *
 * * debounce_set 三秒内的多次请求仅保留最后一次
 *
 * * get_by, set_by 根据后缀读写。后缀格式：by_(name)。参数为：（查找的完整键名，保存的内容）
 */
const dao = {
  /**
   * 页面跳转参数
   */
  get__router_query () {},
  set__router_query () {},

  /**
   * 应当跳转回那个界面
   */
  get__backpage_name () {},
  set__backpage_name () {},

  /**
   * app
   */
  get__app () {
  },
  set__app () {
  },

  /**
   * 用户信息
   * refresh_token 等
   */
  get__user () {
  },
  set__user () {
  },

  /**
   * app入口对象
   */
  get__entrance_bar () {
  },
  set__entrance_bar () {
  },

  /**
   * 抢购信息
   */
  get__rush_buy_groups () {
  },
  set__rush_buy_groups () {
  },
  remove__rush_buy_groups () {
  },

  /**
   * 极有家
   */
  get__ji_you_jia_groups () {
  },
  set__ji_you_jia_groups () {
  },
  remove__ji_you_jia_groups () {
  },

  /**
   * 省市区三级信息
   */
  set__prov_city_area () {
  },
  get__prov_city_area () {
  },

  /*
   * 特殊
   */

  /**
   * 保存 entrance bar
   * 去除抖动
   * 三秒内的多次请求仅保留最后一次请求
   */
  debounce_set__app () {
  },

  /**
   * 根据id保存或查找商品
   * 参数是先id，再数据
   */
  get_by__item__by_id () {
  },
  set_by__item__by_id () {
  }

}

/*
 * 以下为私有方法
 */

/*
 * 入口Main
 * 往dao中所有方法中注入预定义的方法，
 */
function main () {
  for (let funcName in dao) {
    typeof dao[funcName] === 'function' &&
    (dao[funcName] = hander(funcName) || dao[funcName])
  }
}

/*
 * bean
 * 包含本操作的所有信息
 * （该bean由函数名转化而来）
 */
class OpBean {
  constructor (method, value, config) {
    /*
     * 方法，如何操作
     * 如，get set delete等
     */
    this.method = method
    /*
     * 值，具体做的内容
     * 如 'user', 'item' 等
     */
    this.value = value
    /*
     * 包含操作方法初步处理完毕后的所有内容
     */
    this.config = config
    /*
     * 本次操作的参数
     */
    this.args = undefined
  }
}

/*
 * 产生promise方法
 *
 * 返回值为 undefined 表示不支持
 */
function hander (name) {
  const bean = convertOperate(name)

  if (!bean) {
    return
  }

  return function () {
    bean.args = arguments
    return daoAdapter(bean)
  }
}

/*
 * 方法名 to OpBean对象
 */
function convertOperate (name) {
  const nameSnippet = name.split('__')
  if (nameSnippet.length < 2) {
    return
  }

  return new OpBean(nameSnippet[0], nameSnippet[1], nameSnippet)
}

/*
 * 操作bean的链
 */
let chain

/* Expected a conditional expression and instead saw an assignment
 * 处理 bean
 * 依次调用链下所有方法，
 * 直到某个方法可以处理 bean
 */
function daoAdapter (bean) {
  let obj
  for (let key in chain) {
    // noinspection JSUnfilteredForInLoop
    obj = chain[key](bean)
    if (obj) {
      break
    }
  }
  return obj
}

chain = {
  /*
   * bean to storage
   */
  storage (bean) {
    const allowMethod = ['get', 'set', 'remove']
    return arrayUtil.includes(allowMethod, bean.method)
      ? storagePromise[bean.method + 'Item'](bean.value, bean.args[0])
      : undefined
  },
  /*
   * bean to debounce storage
   */
  debounceStorage (bean) {
    const allowMethod = 'debounce_set'
    return allowMethod === bean.method
      ? _debounce((bean) => {
        storagePromise.setItem(bean.value, bean.data)
      }, 3000, {leading: false, trailing: true})
      : undefined
  },

  operateByStorage (bean) {
    const allowMethod = ['get_by', 'set_by', 'remove_by']
    return arrayUtil.includes(allowMethod, bean.method)
      ? storagePromise[bean.method.split('_')[0] + 'Item'](
        bean.value + '_' + bean.config[2].split('_')[1] + '_' + bean.args[0], // ex: (item)_(id)_([0,1,2...])
        bean.args[1] // 数据（可能为undefined）
      )
      : undefined
  }

}

main()

export default dao
