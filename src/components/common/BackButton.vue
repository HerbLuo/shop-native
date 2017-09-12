<!--
    
    @author herbluo
    change logs:
    2017/6/3 herbluo created
-->
<template>
  <div class="button" @click="onClick">
    <image ref="image" class="image" @load="onImageLoad"
           src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/back-alpha.png"
    ></image>
  </div>
</template>

<style scoped>
  .button {
    width: 100px;
    height: 100px;

    justify-content: center;
    align-items: center;
  }

  .image {
    width: 50px;
    height: 50px;

    background-color: #fffffe;
  }

</style>

<script>
  import _debounce from 'lodash/debounce'

  const animation = weex.requireModule('animation')

  export default {
    name: 'back-button',
    methods: {
      onImageLoad () {
        setTimeout(() => {
          animation.transition(this.$refs['image'], {
            styles: {backgroundColor: '#333'}
          })
        }, 100)
      },

      onClick: _debounce(function () {
        const imageEl = this.$refs['image']

        animation.transition(imageEl, {
          styles: {backgroundColor: '#ddd'},
          duration: 230,
          timingFunction: 'ease-in'
        }, () => {
          animation.transition(imageEl, {
            styles: {backgroundColor: '#333'},
            duration: 230,
            timingFunction: 'ease-out'
          })
        })

        this.$emit('back')
      }, 200, {leading: true, trailing: false})
    }
  }
</script>

<style></style>