<!--
    
    @author herbluo
    change logs:
    2017/6/3 herbluo created
-->
<template>
  <div class="top">
    <div class="logo">
      <div class="logo-image logo-image-test"></div>
    </div>
    <div ref="login" class="login"
         @touchstart="onLoginTouchStart" @touchend="onLoginTouchEnd"
         @click="onLogin"
    >
      <text class="login-text">登 录</text>
    </div>
    <div class="register" @click="onRegister">
      <text class="register-text">新用户注册</text>
    </div>
  </div>
</template>

<style scoped>
  .top {
    align-items: center;
  }

  .logo {
    height: 360px;
    width: 750px;

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

  .login, .register {
    width: 700px;
    height: 84px;

    justify-content: center;
    align-items: center;

    margin-bottom: 60px;

    border-radius: 42px;
  }

  .login-text, .register-text {
    font-size: 32px;
  }

  .login {
    background-image: linear-gradient(to right, #ff9e00, #ff4400);
  }

  .login-text {
    color: white;
  }

  .register {
    border-style: solid;
    border-color: #f40;
    border-width: 1px;
  }

  .register-text {
    color: #ff5e06;
  }
</style>

<script>
  const animation = weex.requireModule('animation')

  export default {
    name: 'user-login-or-register',
    data () {
      return {}
    },
    methods: {
      onLoginTouchStart () {
        const loginEl = this.$refs['login']
        animation.transition(loginEl, {
          styles: {
            opacity: 0.6
          },
          timingFunction: 'ease-in',
          duration: 90
        })
      },
      onLoginTouchEnd () {
        const loginEl = this.$refs['login']
        animation.transition(loginEl, {
          styles: {
            opacity: 1
          },
          duration: 50,
          delay: 50
        })
      },
      onLogin () {
        this.$emit('pageSelected', 'login')
      },
      onRegister () {
        this.$emit('pageSelected', 'register')
      }
    }
  }
</script>

<style></style>