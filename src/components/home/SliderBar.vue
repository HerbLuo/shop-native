<!--
    
    @author herbluo
    change logs:
    2017/4/12 herbluo created
-->
<template>
    <div>
        <slider class="slider" interval="2000" auto-play="true">
            <div class="frame" v-if="imgList" v-for="img in imgList">
                <image class="image" resize="cover" :src="img"></image>
            </div>
            <indicator class="indicator"></indicator>
        </slider>
    </div>
</template>

<style scoped>
    .slider {
        width: 750px;
        height: 234px;
    }

    .image {
        width: 750px;
        height: 234px;
    }

    .frame {
        width: 750px;
        height: 234px;
    }

    .indicator {
        position: absolute;
        right: 0;
        bottom: 0;

        width: 750px;
        height: 39px;

        item-color: #888;
        item-selected-color: #F41;
        item-size: 18px;
        opacity: 0.6;
    }
</style>

<script>
    import loadingState from '../../utils/LoadingState'

    export default {
        name: 'slider-bar',
        data() {
            return {
                imgList: null
            }
        },
        beforeCreate() {
            loadingState.loading('slider-bar')
        },
        created() {
            this.ifresh();
//            setTimeout(() => {
                loadingState.ok('slider-bar')
//            }, 2000)
        },
        methods: {
            ifresh() {
                this.imgList = [
                    '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/070424ea7563c9c155e4b7b011627e88d839598d.jpg',
                    '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/5b6705e055c9f50999e9aae7335de79fb0f14f83.jpg',
                    '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/0588b80d1ad288cd2c7aeb7dba87fe8a679905e5.jpg',
                    '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/82c14596dd487ec9aa721f1fca1b2e47e2d75421.jpg',
                    '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/10808eb59782130acb91b120b90c115d2c59ec61.jpg',
                    '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/c5be7a095a0e216d83ace6617b7f25fdc844a9c4.jpg',
                    '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/d0f704b6eb5927096a43991973cd1dcc55933891.jpg',
                    '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/d801144edd05ffd607c0b14be1383af660f6d38a.jpg',
                ]
            }
        }
    }
</script>

<style></style>