<!--
    
    @author herbluo
    change logs:
    2017/4/12 herbluo created
-->
<template>
  <div class="top">
    <div class="iosAdapter" v-if="platform === 'iOS'"></div>
    <div class="topbar">
      <div class="scanner" @click="scanner">
        <image class="scanner-img"
               src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/scanner-v2.png"></image>
        <text class="scanner-text">扫一扫</text>
      </div>
      <div class="search-box">
        <div class="search-bg"></div>
        <div class="search">
          <div class="row">
            <image class="search-image"
                   src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/search.png"></image>
            <!--suppress JSUnresolvedVariable -->
            <text class="search-text">{{hotItem}}</text>
          </div>
          <image class="camera-image"
                 src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/camera.png"></image>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .top {
    background-image: linear-gradient(to right, #F80, #F50);
  }
  .topbar {
    width: 750px;
    height: 100px;

    /*
     * 为什么不加垂直居中
     * 因为推荐所有子组件高度均为100，
     * 这样的好处在于click事件面积大
     */

    flex-direction: row;
  }

  .iosAdapter {
    height: 46px;
    width: 750px;
  }

  .scanner {
    width: 100px;
    height: 100px;
    justify-content: center;
    align-items: center;
  }

  .scanner-img {
    width: 40px;
    height: 40px;
    margin-bottom: 6px;
  }

  .scanner-text {
    font-size: 18px;
    color: white;
  }

  .search-box {
    height: 100px;

    justify-content: center;
  }

  .search-bg {
    width: 560px;
    height: 70px;

    margin-left: 36px;
    border-radius: 35px;

    background-color: #f8f8f8;
    opacity: 0.2;
  }

  .search {
    position: absolute;

    top: 0;
    bottom: 0;
    left: 36px;
    width: 560px;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .search-image {
    width: 36px;
    height: 36px;

    margin-top: 4px;
    margin-left: 20px;
    margin-right: 15px;
  }

  .search-text {
    margin-top: 5px;

    font-size: 30px;
    color: white;
  }

  .camera-image {
    width: 46px;
    height: 46px;

    margin-right: 16px;
  }

  .row {
    flex-direction: row;
  }

</style>

<script>
  import '../../utils/log'
  import {platform} from '../../utils/global'
  import {UriConfig} from '../../utils/app/app-uri-handler'
  import {saveRouterQuery$Promise} from '../../utils/app/app-page-helper'

  const qrview = weex.requireModule('WXQrCode')
  const modal = weex.requireModule('modal')

  export default {
    name: 'entrance-bar',
    data () {
      return {
        platform,
        hotItem: '上铺增高安全护栏'
      }
    },
    created () {
    },
    methods: {
      debugGoto () {
        this.uriHandler('wxshop://router/Item/?query={"id":22,"version":"2.0"}')
      },
      scanner () {
        if (!qrview || !qrview.scanner) {
          this.debugGoto()
          return
        }
        qrview.scanner(({uri}) => {
          modal.toast({message: uri, duration: 2})
          this.uriHandler(uri)
        })
        modal.toast({
          message: '识别中',
          duration: 1
        })
      },
      uriHandler (uri) {
        if (typeof uri !== 'string' || uri.length > 120) {
          console.error('不支持的uri')
        }

        let config
        try {
          config = new UriConfig(uri)
        } catch (e) {
          console.error('无法解析的uri')
          console.error(e)
          return
        }

        if (config.host === 'router') {
          /** @type {RouterUriConfig} */
          try {
            config = config.toRouterUriConfig()
          } catch (e) {
            console.error('无法解析的router类型')
            console.error(e)
            return
          }
          this.routerGoto(config.routerName, config.routerQuery)
          return
        }

        console.warn('暂不支持的uri类型')
        console.warn(config)
      },

      routerGoto (name, query) {
        if (typeof query === 'object') {
          saveRouterQuery$Promise(name, query).then(() => {
            this.push(name)
          }).catch(::console.error)
        }
      }
    }
  }
</script>

<style></style>