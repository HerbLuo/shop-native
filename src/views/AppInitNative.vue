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
    justify-content: flex-end;
  }

  .welcome-image {
    width: 750px;
    height: 1334px;
  }
</style>

<script>
  import '../utils/log'
  import {
    registerWhenInitSnippetFinished
  } from '../a_sub_apps/init/init_snippet'
  import {errorHandler} from '../utils/error'
  import app, {FETCH_APPDATA} from '../store/modules/app'
  import {registerModuleIfNotExist} from '../store'

  registerModuleIfNotExist('app', app)

  const logKey = 'VIEW/APPINITNATIVE'

  export default {
    name: 'app-init-native',
    created () {
      registerWhenInitSnippetFinished((state) => {
        if (state === 'success') {
          this.render()
        } else {
          console.error('[%s] 初始化代码执行完毕，但存在异常', logKey)
        }
      })
    },
    mounted () {
      const domModule = weex.requireModule('dom')
      domModule.addRule('fontFace', {
        'fontFamily': 'tabbaricon',
        'src': 'url(\'//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/iconfont/iconfont-v1.ttf\')'
      })
    },
    methods: {
      render () {
        this.fetchAppData()
      },
      /**
       * 拉取 appData
       */
      fetchAppData () {
        // fetch app data
        this.$store.dispatch(FETCH_APPDATA, {logKey})
          .then(() => {
            this.push('HomeHome', 'true', (navigator) => {
              const clearNavBarLeftItem = navigator.clearNavBarLeftItem
              if (clearNavBarLeftItem) {
                clearNavBarLeftItem()
              }
            })
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