// 入口文件
import App from '../src/views/HomeUser.vue'
import store from '../src/store'
import '../src/app-common'

/* eslint-disable no-new */
new Vue({
  el: '#root',
  store,
  render: h => h(App)
})

