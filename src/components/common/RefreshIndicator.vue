<!--
    
    @author herbluo
    change logs:
    2017/4/22 herbluo created
-->
<!--suppress JSUnresolvedVariable -->
<template>
    <div class="rel">
        <image
                class="bg-image"
                src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/refresh-indicator.png"
        ></image>
        <div class="refresh-indicator">
            <text class="text">{{canTouchMove ? '松开刷新' : '下拉刷新'}}</text>
        </div>
    </div>
</template>

<style scoped>
    .rel {
        width: 750px;
        height: 120px;
        position: relative;
    }
    /*.bg-image {*/
        /*width: 750px;*/
        /*height: 1335px;*/
        /*position: absolute;*/
        /*left: 0;*/
        /*bottom: 0;*/
    /*}*/
    .refresh-indicator {
        width: 750px;
        height: 120px;
        justify-content: center;
        align-items: center;
    }

    .text {
        color: #ddd;
    }

</style>

<script>
    export default {
        name: 'refresh-indicator',
        props: {
            canTouchMove: {
                type: Boolean, /* show or hide */
                'default': false
            }
        },
    }
</script>

<style></style>