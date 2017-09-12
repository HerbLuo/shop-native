/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/26
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/26 herbluo created
 */
import dao from '../../dao'
import {appVersionHandler} from '../../utils/app/app-version-handler'
import {isWeb} from '../../utils/global'

const modal = weex.requireModule('modal')

const app = require('./data/app.json')
const provCityArea = require('./data/city.json')
const entranceBar = require('./data/entrance.json')

/* TODO DEBUG S */
app.updateTimestamp = new Date().getTime() - (1000 * 60 * 5)
/* TODO DEBUG E */
appVersionHandler(app)

/* *********
 写入数据
 ********* */
// 写入完毕的回调
let callbackWhenFinished

// 注册回调
const registerWhenInitSnippetFinished = (callback) => {
  callbackWhenFinished = callback
}

// 检查回调是否已注册
const checkCallbackRegistered = () => {
  if (typeof callbackWhenFinished !== 'function') {
    const msg = '[INIT_SNIPPET] 未注册初始化完毕回调'
    modal.toast({
      message: msg,
      duration: 2
    })
    console.error(msg)
    return false
  } else {
    return true
  }
}

// main
(async function () {
  console.log('INIT_SNIPPET 初始化代码开始执行')

  let events
  try {
    events = await Promise.all([
      dao.set__app(JSON.stringify(app)),
      dao.set__entrance_bar(JSON.stringify(entranceBar)),
      dao.get__prov_city_area().then(({data}) => {
        try {
          // 该省份不存在，或者版本不一致
          if (!data || data.substring(0, 20).indexOf(app['appCityVersion']) < 0) {
            return dao.set__prov_city_area(JSON.stringify(provCityArea))
          }
        } catch (e) {
          return dao.set__prov_city_area(JSON.stringify(provCityArea))
        }

        return Promise.resolve({result: 'success'})
      })
    ])
  } catch (e) {
    modal.toast({
      message: 'INIT_SNIPPET 严重错误，dao模块代码逻辑错误',
      duration: 2
    })
    throw e
  }

  if (!checkCallbackRegistered()) {
    return
  }

  // 写入失败
  for (let i = 0; i < events.length; i++) {
    if (events[i].result !== 'success') {
      console.warn('数据写入失败 \n初始化代码执行失败')
      callbackWhenFinished('fail')
      return
    }
  }

  console.log('INIT_SNIPPET 初始化代码执行完毕')
  callbackWhenFinished('success')
})()

// export

;(typeof window === 'object') && isWeb && (
  registerWhenInitSnippetFinished(window.whenInitSnippetFinished)
)

export {
  registerWhenInitSnippetFinished
}
