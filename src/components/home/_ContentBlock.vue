<!--
    负责渲染主页中的所有block

    @author herbluo
    change logs:
    2017/4/20 herbluo created
-->

<style scoped>
    .row {
        /*flex-direction: row;*/
        height: 200px;
    }
    .dd {
        width: 20px;
        height: 20px;
        background-color: red;
        margin: 20px;
    }
</style>

<script>
    export default {
        name: 'content-block',
        render(createElement) {
            /*
             * 列合并式结构
             * [
             *  [1, 1, 2],
             *  [3, 4, 4]
             * ]
             */
            /*
             * 行合并式结构
             * [
             *  [1, 2, 3],
             *  [1, 4, 5]
             * ]
             */
            /*
             * [
             *  [1, 1, 2, 3],
             *  [1, 1, 4, 5]
             * ]
             */
            /*
             * [
             *  [1, 1, 2, 3],
             *  [1, 1, 4, 5],
             *  [6, 7, 8, 9]
             * ]
             */
            // [
            //  [[2, 1], [1, 1]],
            //  [[1, 1], [2, 1]]
            // ]
            // [[1, 2], [1, 1], [1, 1], [1, 1], [1, 1]]
            // [
            //  [[2, 2], [1, 1], [1, 1]],
            //  [[1, 1], [1, 1]]
            // ]

            /*
             * 所有元素的和为布局的总格子数量
             * 三维数组 layout
             * layout.length - layout[0][0][1]  为需渲染的行数（第一次循环）
             */
            function createBlock(flex,) {

            }

            let rLayout = []; // 渲染过的layout
            // 最顶层div节点
            return createElement('div', {attrs: {'class': 'row'}}, Array.apply(null, {}).map(row => {
                console.info(2);
                // 行
                return createElement('div',  row.map(column => {
                    // 列
                    return createElement('div', {
                        attrs: {
                            'class': 'dd',
//                            style: 'width: 20px;height: 20px; margin: 20px; background-color: red;'
                        }
                    })
                }))
            }))
        },
        props: {
            layout: {
                type: Array,
                required: true
            }
        }
    }
</script>