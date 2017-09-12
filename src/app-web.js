// only for web
/*
 * 如若当前是web平台，提醒一下
 */
import './utils/log'
import store from './store'
import router from './routes'
import {isWeb} from './utils/global'
import rebuildVuebus from './app-common'

if (!isWeb) {
  console.error('不可将app.js打包至非web平台')
}

/*
 * App主界面
 */
const App = require('./entry-web.vue')

App.el = '#App'
App.router = router
App.store = store
export default new Vue(App)

rebuildVuebus({
  router
})
