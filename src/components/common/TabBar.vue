<!--

    @author herbluo
    change logs:
    2017/3/14 herbluo created
-->
<template>
  <div>
    <div class="tabbar" ref="tabbar">
      <div class="tab" v-for="(tab, index) in tabs" @click="tabClick(index)">
        <template v-if="tab.isActived">
          <text class="tab-icon actived">{{tab.iconActived}}</text>
          <text class="tab-text actived">{{tab.name}}</text>
        </template>
        <template v-else>
          <text class="tab-icon">{{tab.icon}}</text>
          <text class="tab-text">{{tab.name}}</text>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .tabbar {
    position: fixed;
    bottom: 0;
    left: 0;

    width: 750px;
    height: 108px;

    flex-direction: row;
    align-items: center;

    border-top-width: 1px;
    border-color: #CCC;
    border-style: solid;

    background-color: #FFF;
  }

  .tab {
    height: 108px;
    flex: 1;

    justify-content: space-between;
    align-items: center;
  }

  .tab-icon, .tab-text {
    color: #606060;
  }

  /*noinspection CssNoGenericFontName*/
  .tab-icon {
    margin-top: 10px;
    font-family: tabbaricon;
    font-size: 50px;
  }

  .actived {
    color: #f40
  }

  .tab-text {
    font-size: 24px;
    margin-bottom: 6px;
  }

</style>

<script>
  import _debounce from 'lodash/debounce'
  import {platform} from '../../utils/global'

  // eslint-disable-next-line
  const tab = {} // TODO ONLY FOR DE WARN

  export default {
    name: 'tab-bar',
    props: ['routerName'],
    data () {
      return {
        // eslint-disable-next-line
        platform,
        imgbase: 'http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/',
        tabs: [{
          name: '首页',
          routerName: 'HomeHome',
          icon: '\ue604',
          iconActived: '\ue635',
          isActived: this.routerName === 'HomeHome'
        }, {
          name: '微淘',
          routerName: 'HomeTalk',
          icon: '\ue62b',
          iconActived: '\ue62b',
          isActived: this.routerName === 'HomeTalk'
        }, {
          name: '问大家',
          routerName: 'HomeQA',
          icon: '\ue643',
          iconActived: '\ue617',
          isActived: this.routerName === 'HomeQA'
        }, {
          name: '购物车',
          routerName: 'HomeCar',
          icon: '\ue68c',
          iconActived: '\ue68c',
          isActived: this.routerName === 'HomeCar'
        }, {
          name: '我',
          routerName: 'HomeUser',
          icon: '\ue636',
          iconActived: '\ue636',
          isActived: this.routerName === 'HomeUser'
        }]
      }
    },
    methods: {
      tabClick: _debounce(function (index) {
        const currentTab = this.tabs[index]
        // 已经激活的tab不必再次激活
        if (currentTab.isActived) {
          return
        }

        // 路由导航
        setTimeout(() => {
          this.push(currentTab.routerName)
        }, 0)
      }, 200, {leading: true, trailing: false})
    }
  }
</script>
