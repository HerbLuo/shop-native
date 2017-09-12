<!--
    
    @author herbluo
    change logs:
    2017/8/26 herbluo created
-->
<template>
  <div class="top">
    <image
        class="welcome-image"
        src="http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/welcome.png"></image>
  </div>
</template>

<style scoped>
  .top {
  }

  .welcome-image {
    width: 750px;
    height: 1334px;
  }
</style>

<script>
  import '../utils/log'
  import api from '../api'
  import pUtils from '../utils/promise-util'
  import {errorHandler} from '../utils/error'
  import {loadJsFile} from '../utils/load-js-file'
  import app, {FETCH_APPDATA} from '../store/modules/app'
  import {registerModuleIfNotExist} from '../store'

  registerModuleIfNotExist('app', app)

  const logKey = 'VIEW/APPINITWEB'

  /**
   * 动态加载初始化代码
   *
   * @return {Promise.<resolve>}
   */
  const isInitSnippetRunSuccessPromise = () => {
    // noinspection JSUnusedLocalSymbols
    return new Promise((resolve, reject) => {
      window.whenInitSnippetFinished = (state) => {
        resolve(state === 'success')
      }
      loadJsFile(api.app.getInitSnippetWeb())
    })
  }

  export default {
    name: 'app-init-web',
    created () {
      this.render()
    },
    mounted () {
      const domModule = weex.requireModule('dom')
      domModule.addRule('fontFace', {
        'fontFamily': 'tabbaricon',
        'src': 'url(\'//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/iconfont/iconfont-v1.ttf\')'
      })
    },
    methods: {
      /**
       * 通用入口，可多次执行
       */
      async render () {
        // init and wait
        const isSnippetRunSuccess = await Promise.race([
          isInitSnippetRunSuccessPromise(), // init
          pUtils.delay(5000) // timeout
        ])

        // init fail
        if (!isSnippetRunSuccess) {
          // check the network
          errorHandler.checkNetworkAndWaitWhileNetworkIsReopen$Promise()
            .then(() => { // network is open
              console.error('[%s] 初始化代码执行完毕，但存在异常', logKey)
            })
            .catch(this.render) // while network is reopen, rebuild this page
          return
        }

        // init success
        this.fetchAppData()
      },
      /**
       * 拉取 appData
       */
      fetchAppData () {
        // fetch app data
        this.$store.dispatch(FETCH_APPDATA, {logKey})
          .then(() => {
            this.push('HomeHome')
          })
          .catch((error) => {
            errorHandler.checkNetworkAndWaitWhileNetworkIsReopen$Promise()
              .then(() => { // network is open
                console.error('[%s] 无法拉取appData', logKey)
                console.error(error)
              })
              .catch(this.fetchAppData) // when net is reopen
          })
      }
    }
  }
</script>

<style></style>