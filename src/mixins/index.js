/**
 *
 * any question or idea, email to i@closx.com
 * @author herbluo modifier
 * @date 2017/8/26
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/8/26 herbluo created
 */
import {debugModel} from '../config'
import {isWeb} from '../utils/global'
import api from '../api/index'
import {loadJsFile} from '../utils/load-js-file'

/* *********
 调试相关 控制台输出二维码
 ********* */
const getNativeAppJsPath = ::api.app.getNativeAppJsPath

/*
 * 控制台输出当前界面的二维码
 * 便于手机端扫描
 * 须在控制台输入 `showQr()`
 */
// web平台，debug模式下，往window里添加showQr方法以显示当前界面的 Native端的 二维码
let showNativeFileUrlQr = (_) => {
}

const isDesktopWebPlatformAndDebugModel = debugModel && (typeof window === 'object')

if (isDesktopWebPlatformAndDebugModel) {
  // 映射某些 Web平台 和 Native平台 不一样的界面
  const web2nativeMap = {
    'AppInitWeb': 'AppInitNative'
  }

  // 动态加载Js文件
  loadJsFile(api.app.getConsoleQRCodeJs())

  // 往window里添加 showQr 方法
  window.showQr = function (url) {
    url = url || getNativeAppJsPath(window.currentRouteName)
    ;(typeof console.qrcode === 'function') && (
      console.qrcode(url)
    )
    return url
  }
  showNativeFileUrlQr = (name) => {
    window.currentRouteName = web2nativeMap[name] || name
  }
}

/* *********
 跳转
 ********* */
const navigator = weex.requireModule('navigator')

/**
 * 作者：_啃Apple的猫
 * 链接：http://www.jianshu.com/p/497f1a9ff33f
 *   來源：简书
 * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 */
export default {
  methods: {
    push (name, animated, callBackWhenNative) {
      if (isWeb) {
        this.$router.push({name})
        showNativeFileUrlQr(this.$route.name)
      } else {
        navigator.push({
          url: getNativeAppJsPath(name),
          animated: animated || 'true'
        }, () => {
          callBackWhenNative && callBackWhenNative(navigator)
        })
      }
    },

    pop (animated) {
      if (isWeb) {
        window.history.back()
        showNativeFileUrlQr(this.$route.name)
      } else {
        navigator.pop({
          animated: animated || 'true'
        })
      }
    }
  }
}

// 作者：_啃Apple的猫
// 链接：http://www.jianshu.com/p/497f1a9ff33f
//   來源：简书
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
