<!--
    
    @author herbluo
    change logs:
    2017/4/25 herbluo created
-->
<!--suppress JSUnresolvedVariable -->
<template>
    <div class="cheap">
        <split-bar></split-bar>
        <div class="row head">
            <div class="rel" v-for="headBlock in block.head">
                <image :src="headBlock.img" :class="['image-' + headBlock.type]"></image>
                <text v-if="headBlock.type === 'left'" class="text-left">{{headBlock.text}}</text>
                <div v-if="headBlock.type === 'right'" class="text-right-bg">
                    <text class="text-right-text">{{headBlock.text}}</text>
                </div>
            </div>
        </div>
        <div class="title">
            <text class="title-text">{{block.title}}</text>
        </div>
        <div class="content">
            <div v-for="row in block.content" class="row">
                <div v-for="item in row">
                    <image
                            class="content-image"
                            :src="item.img"
                    ></image>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .rel {
        position: relative;
    }

    .cheap {
        position: relative;
    }

    .row {
        flex-direction: row;
        width: 750px;
        justify-content: space-between;
    }

    /*noinspection CssUnusedSymbol*/
    .image-left {
        width: 499px;
        height: 250px;
    }

    /*noinspection CssUnusedSymbol*/
    .image-right {
        width: 250px;
        height: 250px;
    }

    .title {
        position: absolute;
        left: -29px;
        top: 0;
        align-items: center;
        justify-content: center;
        width: 229px;
        height: 58px;
        border-radius: 29px;
        background-image: linear-gradient(to right, #FF0, #FFBC00);
    }

    .title-text {
        color: white;
        font-size: 34px;
        margin-left: 15px;
    }

    .text-left, .text-right-text {
        color: white;
        font-size: 26px;
    }

    .text-left {
        position: absolute;
        bottom: 20px;
        left: 20px;
    }

    .text-right-bg {
        position: absolute;
        bottom: 18px;
        left: 40px;
        width: 170px;
        height: 38px;
        align-items: center;
        justify-content: center;
        border-top-left-radius: 19px;
        border-bottom-right-radius: 19px;
        background-color: rgba(255, 175, 0, 0.7);
    }

    .content {
        background-color: #e8e8e8;
        justify-content: space-between;
        height: 492px;
    }

    .content-image {
        width: 374px;
        height: 245px;
    }
</style>

<script>
    import SplitBar from "./SplitBar.vue";
    export default {
        components: {SplitBar},
        name: 'block-ji-you-jia',
        data() {
            return {
                block: {
                    title: '我淘我家',
                    head: [{
                        type: 'left',
                        img: '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/d05fc28759bd6cc2b0ca5e113875e6a4352ed524.jpg',
                        text: '捷森麦片，让早餐更具鲜活力量',
                    }, {
                        type: 'right',
                        img: '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/77e8826bcacb93d3d20244c57e946683190e5af9.jpg',
                        text: '#深夜食堂'
                    }],
                    content: [[{
                        img: '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/922b2bafacacadf77ab23eed3c89d4481ef24af2.png',
                        index: 1,
                        link: ''
                    }, {
                        img: '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/2adf6dd2b31c938a314500977adf7694709a3c05.png',
                        index: 2,
                        link: ''
                    }], [{
                        img: '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/4afa686615dec3d1d839d92eddbd9058dc473bf8.png',
                        index: 3,
                        link: ''
                    }, {
                        img: '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/2d57ce513ecd21fa0d1b13e2dc2b6823531228e0.png',
                        index: 4,
                        link: ''
                    }]]
                },
            }
        },
        created() {

        }
    }
</script>

<style></style>