/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/5/23
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/5/23 herbluo created
 */
const _ = require('lodash');

/**
 * 错误
 */
class Left {
    constructor(d) {
        this.__value = d;
    }

    static of(d) {
        return new Left(d);
    }

    map() {
        return this;
    }
}

/**
 * 任何数据的容器
 * 容器指的是FP中的容器
 */
class DataContainer {
    constructor(d) {
        this.__value = d;
    }

    static of(d) {
        return new DataContainer(d);
    }

    map(func) {
        return DataContainer.of(func(this.__value))
    }


    scan(func, array) {
        return DataContainer.of(func(array, this.__value))
    }

    ['try'](func) {
        const d = func(this.__value);
        return d instanceof Left ? d : DataContainer.of(d);
    }

}

export {
    DataContainer
};


/**
 * 反柯里化
 * @param f
 * @param g
 */
export const compose = (f, g) => x => f(g(x));

/**
 * 返回自身
 */
const self = d => d;

/**
 * 第一条链（用于处理服务端返回的数据）
 * 将服务器数据转化成 group数组 并返回
 *
 * 说明：服务器返回了多组数据（减少http请求数），所以需要分组
 * 该函数返回的数据可以缓存并且建议缓存
 *
 * @param key
 * @param. data 第二阶 需处理的数据
 *      （服务端数据）
 *      （如返回数据为page数据，需预处理为数组）
 */
export const dataGroupChain = (key = 'index') => data =>
    _.chain(data) // 服务端原始数据
        .forEach(a => a.timestamp || (a.timestamp = new Date().getTime())) // 增加时间戳信息
        .groupBy(key) // 对数据按index进行分组
        .map(self) // 将集合对象object转换成数组对象Array
        .thru(d => _.zip(...d))
        .value();

export const blockUtil = {
    mapping: {
        index2type: ['left', 'right', 'center'],
        type2index: {'left': 0, 'right': 1, 'center': 2},
    }
};


/**
 * 预设的data处理方式
 */
export function getDefaultDataHandlerMapping() {
    return {
        server: {
            /**
             * 将服务器返回的数据中的 head里的 type转化成文字
             *
             * 一阶函数
             * 不纯：
             * 将传入参数.head.type重置
             *
             * @param data
             */
            before: data =>
                (data.head.content.forEach(c => c.type = blockUtil.mapping.index2type[c.type]), data),

            /**
             * data 为服务器返回的原始数据
             * 以极有家API为原型编写
             *
             * 二阶函数
             * 不纯：
             * 将传入数据的head和content重置
             *
             * @param originalData 第一阶 配置参数
             * @param. data 第二阶 需要处理的数据
             * @return 处理完毕的 data
             */
            handlerSnippet: ({originalData}) => data => {

                // group and zip data
                let head = dataGroupChain('type')(data.head.content);
                let content = dataGroupChain()(data.content.content);

                // concat original data and current data
                originalData.head && (
                    head = originalData.head.concat(head));
                originalData.content && (
                    content = originalData.content.concat(content));

                data.head = head;
                data.content = content;
                return data;
            },

            /**
             * 持久化groups数据
             *
             * 二阶函数
             * 纯
             *
             * @param daoHandler
             */
            after: ({daoHandler}) => data => {

                let t_data = {...data};

                setTimeout(() => {

                    const filterUndefined = key => data => {
                        return _.chain(data)
                            .flatten()
                            .thru(f_data => {
                                const n_data = [];
                                f_data.forEach(d => d !== undefined && n_data.push(d));
                                return n_data;
                            })
                            .groupBy(key)
                            .map(self)
                            .thru(d => _.zip(...d))
                            .value();
                    };

                    t_data.head = filterUndefined('type')(t_data.head);

                    t_data.content = filterUndefined('index')(t_data.content);

                    daoHandler(JSON.stringify(t_data));

                }, 0);

                return data;
            }
        },

        storage: {
            /**
             * 对于超期的数据，
             * 仅仅保证下次加载时不再使用
             *
             * 二阶函数
             * 纯
             *
             * @param daoDeleteHandler
             * @param daoSetHandler
             */
            before: ({daoDeleteHandler, daoSetHandler}) => data => {

                // 浅复制，便于重设head content
                const n_data = {...data};

                setTimeout(() => {
                    let effectiveNum = undefined;

                    /**
                     * 过滤期满数据
                     *
                     * 不纯
                     * 操作了外部的effectiveNum
                     *
                     * @return {*}
                     * @param key
                     */
                    const deleteExpire = (key = 'index') => data => {
                        return _.chain(data)
                            .flatten() // 拍平分组后的数据
                            .thru(f_data => { // 过滤过期数据
                                const n_data = [];
                                f_data.forEach(d => {
                                    (d && d.timestamp && new Date().getTime() - d.timestamp < 1000 * 60 * 60 * 24 * 5/*五天*/)
                                    && n_data.push(d)
                                });
                                effectiveNum = n_data.length;
                                return n_data;
                            })
                            .groupBy(key) // 重新分组
                            .map(self) // 将object转化成array
                            .thru(d => _.zip(...d))
                            .value();
                    };


                    n_data.head = deleteExpire('type')(n_data.head);
                    let headNum = effectiveNum;
                    n_data.content = deleteExpire()(n_data.content);
                    //noinspection UnnecessaryLocalVariableJS
                    let contentNum = effectiveNum;

                    if (headNum < 4 || contentNum < 4) {
                        daoDeleteHandler();
                    }

                }, 0);

                return data;
            },

            /**
             * 按组别分组的数据 -> zipped数据 -> 单个zipped数据
             *
             * 二阶函数
             * 不纯
             * 增加了placeholder属性
             *
             * @param zippedIndex
             * @param currentData
             * @param i_need_the_zipped_data 使用该参数获取 zipped数据
             * @param. data
             */
            handlerSnippet: ({zippedIndex, currentData, i_need_the_zipped_data}) => data => {
                typeof i_need_the_zipped_data === 'function' && i_need_the_zipped_data(data);

                /*
                 * 里面的数据按照顺序规范排列, 不存在的数据位就空着
                 */
                const head = [], content = [];

                /*
                 * 先加入新数据
                 */
                if (data.head[zippedIndex]) {
                    data.head[zippedIndex].forEach(
                        h => h && (
                            // 对应的位置赋值
                            head[blockUtil.mapping.type2index[h.type]] = h
                        )
                    );
                }
                if (data.content[zippedIndex]) {
                    data.content[zippedIndex].forEach(
                        c => c && (content[c.index - 1] = c)
                    );
                }

                /*
                 * 新数据如果不能填满，使用相同位置的旧数据
                 */
                for (let i = 0; i < 2; i++) {
                    head[i] || (head[i] = currentData.head[i]);
                }
                for (let i = 0; i < 4; i++) {
                    content[i] || (content[i] = currentData.content[i])
                }

                /*
                 * 加入placeholder（加载图片时显示的图片）
                 */
                currentData.head && head.forEach((h, i) => h && (
                    h.placeholder || (h.placeholder = currentData.head[i].img)
                ));
                currentData.content && content.forEach((c, i) => c && (
                    c.placeholder || (c.placeholder = currentData.content[i].img)
                ));

                return {
                    title: data.title,
                    head,
                    content: _.chunk(content, 2)
                };
            },
            nextHandler: 'cache'
        },

        timer: 'storage',


        cache: () => () => {
        }
    };
}

/**
 * 数据处理方案
 *
 * 每个处理器的处理顺序为
 * beforeHandler -> handler (END PROCESS)
 *               -> handlerSnippet -> afterHandler
 *               -> defaultDataHandler -> afterHandler
 *
 * handler: 使用该处理器处理，并终止处理程序（作为最后一个处理器，作收尾工作）
 * handlerSnippet: 使用该处理器处理，之后处理器会按照既定顺序继续使用下一个 handler 处理
 *
 * @param handlers 各类型对应的处理器
 *                  具体见下方的 #数据处理器
 *                  默认实现参考上方的 #预设的data处理方式
 * @return. 二阶函数，顶阶不会有任何返回值，请在处理器内完成数据的处理工作
 */

/**
 * 数据处理器
 * handlers
 *
 * ----------------------------------------------------------------------------------------------------
 *
 * 只支持处理以下五种类型处理器： ['error', 'server', 'storage', 'timer', 'cache']
 *
 * 处理器一般情况下为object，
 *
 * 但也允许为string，string代表该处理器和其它处理器相同，string的值为其它处理器的名字
 *
 * ----------------------------------------------------------------------------------------------------
 *
 * object类型的处理器可以包含以下几个属性：
 *
 *  ['before', 'handlerSnippet', 'handler', 'after'] 称之为处理函数
 *
 *  nextHandler: string 指定了下一个处理器的名字
 *
 * ----------------------------------------------------------------------------------------------------
 *
 * 这几个属性的详细解释为：
 *
 * *: object 使用默认的处理方法，属性的值为默认方法的（配置参数）
 *
 * handler: function 使用该处理器处理，并 _终止_ 处理程序（该处理器作为最后一个处理器，作收尾工作）
 *
 * handlerSnippet: function 使用该处理器处理，之后处理器会 _继续_ 按照某顺序使用 下一个处理器 处理
 *
 * before: function 在 handlerSnippet 之前预处理数据
 *
 * after: 在 handlerSnippet 之后处理数据
 *
 * nextHandler: string 指向下一个处理器，如不指定，按照'server' -> 'storage' -> 'timer' -> 'cache' 的顺序处理
 *
 * ----------------------------------------------------------------------------------------------------
 */
let handler;
export default handler = handlers => {

    /*
     * 处理 handlers
     * （格式化，拼装 handlers）
     */

    // 存储格式化处理器组
    const formatedHandlers = [];

    ['error', 'server', 'storage', 'timer', 'cache'].forEach(type => {

        // 自定义的处理器，将自定义处理器的字符串指向对应的函数
        let c_handler = handlers[type];
        typeof c_handler === 'string' && (c_handler = handlers[c_handler]);

        // 获取内置的处理器
        const d_handler_mapping = getDefaultDataHandlerMapping();
        let d_handler = d_handler_mapping[type];

        if (typeof d_handler === 'string') {
            // 指向其它处理器，因为已经降过阶，不必重复
            d_handler = d_handler_mapping[d_handler];
        } else {
            // 为所有需降阶的方法降阶
            _.forEach(c_handler, (method, methodKey) => {
                if (typeof method === 'object') {
                    d_handler[methodKey] = d_handler[methodKey](method);
                    delete c_handler[methodKey];
                }
            });
        }

        // 往处理器组里追加处理器
        formatedHandlers.push({
            before: self,
            handlerSnippet: self,
            after: self,
            ...d_handler, // 使用内置处理器覆盖
            ...c_handler, // 使用可定义处理器覆盖
        });
    });


    /*
     * 使用 格式化好的 handlers
     * 处理data数据
     */

    const typeMapping = {error: 0, server: 1, storage: 2, timer: 3, cache: 4, exit: -1};

    return type => data => {

        let typeIndex = typeMapping[type];

        // 使用容器包裹处理程序
        let container = DataContainer.of(data);

        formatedHandlers.forEach((handler, index) => {

            // 如果需处理的类型与当前类型一致
            if (index === typeIndex) {

                // 下一个处理器
                typeIndex = handler.nextHandler ? typeMapping[handler.nextHandler] : typeIndex + 1;

                container = container
                // 预处理器
                    .map(handler.before)
                    // 最终处理器 如果存在 处理完后终止整个处理器的运行
                    .try(data => handler.handler ? Left.of(handler.handler(data)) : data)
                    // 主处理器 如果不存在，使用预定义的
                    .map(handler.handlerSnippet)
                    // 尾处理器
                    .map(handler.after)
            }
        });
    };
};