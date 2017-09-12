<!--
    TODO 待修改 将代码转移至 store
    @author herbluo
    change logs:
    2017/4/17 herbluo created
-->
<!--suppress JSUnresolvedVariable -->
<template>
  <div class="entrance-bar">
    <div class="entrance-line"
         v-if="entrances"
         v-for="entrance_aline in entrances"
    >
      <div class="entrance"
           v-for="entrance in entrance_aline"
           :key="entrance.id"
      >
        <image class="image" :src="entrance.img"></image>
        <text class="text">{{entrance.name}}</text>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .entrance-bar {
    margin-left: 15px;
    margin-right: 15px;
    width: 720px;
    height: 340px;
    justify-content: center;
  }

  .entrance-line {
    flex-direction: row;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .entrance {
    flex: 1;
    align-items: center;
  }

  .image {
    width: 88px;
    height: 88px;
  }

  .text {
    margin-top: 5px;
    font-size: 24px;
  }
</style>

<script>
  import '../../utils/log'
  import {errorHandler} from '../../utils/error'
  import app, {FETCH_ENTRANCE} from '../../store/modules/app'
  import {registerModuleIfNotExist} from '../../store'

  registerModuleIfNotExist('app', app)

  const logKey = 'VIEW/ENTRANCEBAR'

  export default {
    name: 'entrance-bar',
    data () {
      return {
      }
    },
    created () {
      this.render()
    },
    computed: {
      entrances () {
        return this.$store.state.app.entrance
      }
    },
    methods: {
      render () {
        this.$store.dispatch(FETCH_ENTRANCE, {logKey})
          .then()
          .catch((error) => {
            errorHandler
              .checkNetworkAndWaitWhileNetworkIsReopen$Promise()
              .then(() => {
                console.error('[%s] 无法拉取app的入口信息', logKey)
                console.error(error)
              })
              .catch(this.render)
          })
      }
    }
  }
</script>

<style></style>