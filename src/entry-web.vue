<!--
    App
    此模块加载时，界面不会有任何显示
    在App的loading状态转换成loaded之后，
    App很快完成渲染，此时可以通知native端
 -->
<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>
<style scoped>
</style>
<script>
  import './utils/log'
  import dao from './dao'
  import {debugModel} from './config'

  const isTheAppLoadFirstTimePromise = () => {
    return dao.get__app()
      .then((event) => event.result === 'success' || debugModel)
  }

  export default {
    name: 'app',
    async created () {
      const isFirstTime = await isTheAppLoadFirstTimePromise()

      if (isFirstTime) {
        console.log('APP 首次加载')
        this.push('AppInitWeb')
      } else {
        this.push('HomeHome')
      }
    },
    methods: {}
  }
</script>