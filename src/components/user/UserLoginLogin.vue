<!--
    
    @author herbluo
    change logs:
    2017/6/3 herbluo created
-->
<template>
  <div class="top">
    <div class="logo" @click="onLogoClick">
      <div class="logo-image logo-image-test"></div>
    </div>
    <input ref="usernameInput"
           class="input username-input"
           maxlength="15"
           :value="username"
           @change="onUsernameChange"
           placeholder="手机/会员名/邮箱"/>
    <div class="line"></div>
    <div>
      <input
          v-if="passwordHidden"
          ref="passwordInput"
          class="input password-input"
          type="password"
          :value="password"
          @input="onPasswordInput"
          placeholder="请输入密码"/>
      <input
          v-if="!passwordHidden"
          ref="passwordInput"
          :value="password"
          class="input password-input"
          @input="onPasswordInput"
          placeholder="请输入密码"/>
      <div class="line"></div>
      <image
          v-if="passwordHidden"
          class="password-hidden"
          @click="hidePassword"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/password-hide.png"
      ></image>
      <image
          v-if="!passwordHidden"
          class="password-hidden"
          @click="hidePassword"
          placeholder="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/password-hide.png"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/password-look.png"
      ></image>
    </div>
    <div class="re-psd">
      <text class="re-psd-text">忘记密码</text>
    </div>
    <div class="login-btn" @click="onLoginBtnClick">
      <text class="login-btn-text">登 录</text>
      <div v-if="!couldLogin" class="login-btn-mask"></div>
    </div>
  </div>
</template>

<style scoped>
  .top {
    align-items: center;
  }

  .logo {
    height: 260px;
    width: 750px;
    padding-top: 20px;

    justify-content: center;
    align-items: center;
  }

  .logo-image {
    width: 160px;
    height: 160px;
  }

  .logo-image-test {
    border-radius: 80px;
    background-image: linear-gradient(to top left, #ffa602, #f40);
  }

  .input {
    width: 700px;

    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;

    margin-top: 88px;

    font-size: 32px;
    color: #222;

    /*noinspection CssUnknownProperty*/
    placeholder-color: #bbb;
  }

  .line {
    width: 700px;
    height: 1px;

    border-bottom-style: solid;
    border-bottom-color: #f40;
    border-bottom-width: 1px;
  }

  .password-hidden {
    width: 52px;
    height: 30px;

    position: absolute;
    right: 10px;
    bottom: 15px;
  }

  .re-psd {
    width: 700px;
    padding-right: 10px;

    margin-top: 58px;
    align-items: flex-end;
  }

  .re-psd-text {
    color: #333;
    font-size: 28px;
  }

  .login-btn {
    margin-top: 88px;

    width: 680px;
    height: 82px;

    justify-content: center;
    align-items: center;

    border-radius: 41px;
    background-image: linear-gradient(to right, #ffa100, #f40);
  }

  .login-btn-text {
    font-size: 32px;
    color: white;
  }

  .login-btn-mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    background-color: #fff;
    opacity: 0.5;
  }

</style>

<script>
  import _debounce from 'lodash/debounce'
  import {loginByUsnAndPsd} from '../../utils/app/login'

  const modal = weex.requireModule('modal')

  export default {
    name: 'user-login-login',
    data () {
      return {
        passwordHidden: true,
        username: '',
        password: '',
        couldLogin: false
      }
    },
    methods: {
      onLogoClick () {
        this.$refs['usernameInput'].blur()
        this.$refs['passwordInput'].blur()
      },

      hidePassword () {
        this.passwordHidden = !this.passwordHidden
      },
      onUsernameChange (event) {
        this.username = event.value
        this.checkInput()
      },
      onPasswordInput (event) {
        this.password = event.value
        this.checkInput()
      },
      checkInput () {
        this.couldLogin = !!(this.username && this.password)
      },
      /**
       * 按下登录按钮
       * @return {Promise.<void>}
       */
      onLoginBtnClick: _debounce(function () {
        // 密码长度不够时， 不允许登录
        if (!this.couldLogin) {
          return
        }

        loginByUsnAndPsd(this.username, this.password)
          .then((state) => {
            if (state) {
              this.$emit('loginSuccess')
              return
            }
            modal.confirm({
              message: '用户名或密码不正确',
              okTitle: '确定',
              cancelTitle: '找回密码'
            }, t => t === '找回密码' && this.rePsd())
          })
          .catch(::console.error)
        // ..
      }, 200, {leading: true, trailing: false}),

      /**
       * 找回密码
       */
      rePsd () {
        console.info('找回密码')
      }
    }
  }
</script>

<style></style>