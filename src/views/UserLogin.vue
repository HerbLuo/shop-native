<!--
    
    @author herbluo
    change logs:
    2017/6/2 herbluo created
-->
<template>
  <div class="top">
    <div class="top-bar">
      <back-button-bg-transparent @back="back"></back-button-bg-transparent>
    </div>
    <!-- 选择登陆或注册 -->
    <user-login-or-register
        v-if="page === 'select'"
        @pageSelected="pageSelected"
    ></user-login-or-register>
    <!-- 登录 -->
    <user-login-login
        v-if="page === 'login'"
        @loginSuccess="onLoginSuccess"
    ></user-login-login>
    <!-- 注册 -->
    <user-login-register
        v-if="page === 'register'"
    ></user-login-register>
  </div>
</template>

<style scoped>
  .top {
  }

  .top-bar {
    height: 100px;
    width: 750px;
  }
</style>

<script>
  import '../utils/log'
  import {readBackPage} from '../utils/app/app-page-helper'

  import BackButton from '../components/common/BackButton.vue'
  import UserLoginOrRegister from '../components/user/UserLoginOrRegister.vue'
  import UserLoginLogin from '../components/user/UserLoginLogin.vue'
  import UserLoginRegister from '../components/user/UserLoginRegister.vue'
  import BackButtonBgTransparent from '../components/common/BackButtonBgTransparent.vue'

  let backPage

  export default {
    components: {
      BackButtonBgTransparent,
      UserLoginRegister,
      UserLoginLogin,
      UserLoginOrRegister,
      BackButton
    },
    name: 'user-login',
    data () {
      return {
        page: 'select'
      }
    },
    created () {
      this.render()
    },
    methods: {
      render () {
        readBackPage().then((_backPage) => {
          backPage = _backPage
        }).catch(::console.error)
      },
      back () {
        console.log('back')
        if (this.page === 'select') {
          this.pop()
        } else {
          this.page = 'select'
        }
      },
      pageSelected (page) {
        // 'login' 'register'
        this.page =
          ({login: 'login', register: 'register'})[page] ||
          'select'
      },
      onLoginSuccess () {
        if (backPage) {
          this.push(backPage)
        } else {
          console.warn('未定义')
        }
      }
    }
  }
</script>

<style></style>