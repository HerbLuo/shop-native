/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/7/12
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/7/12 herbluo created
 */
/* *********
 import
 ********* */
import '../../utils/log'
import api from '../../api'
import dao from '../../dao'
import {get} from '../../utils/app/app-fetch'
import * as loader from '../../utils/app/loader'
import * as handler from '../../utils/app/handler'
import {hasProps} from '../../utils/class-util'

import _zip from 'lodash/zip'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import _unionBy from 'lodash/unionBy'

/* *********
 variables
 ********* */
const actions = {}
const mutations = {}
const getters = {}

/* *********
 actions
 ********* */

/**
 * 拉取极有家
 */
const FETCH_JIYOUJIA = 'FETCH_JIYOUJIA'
actions[FETCH_JIYOUJIA] = function ({commit}) {
  // .
  return fetch(
    '[STORE/BLOCK/JIYOUJIA]',
    blockJiyoujia,
    {
      daoGet: ::dao.get__ji_you_jia_groups,
      daoSet: ::dao.set__ji_you_jia_groups,
      daoRemove: ::dao.remove__ji_you_jia_groups
    },
    ::api.url.getJiyoujia
  ).then(() => {
    commit(UPDATE_JIYOUJIA, {block: blockJiyoujia})
  })
}

/**
 * 拉取淘抢购
 */
const FETCH_RUSHBUY = 'FETCH_RUSHBUY'
actions[FETCH_RUSHBUY] = function ({commit}) {
  // .
  return fetch(
    '[STORE/BLOCK/RUSHBUY]',
    blockRushbuy,
    {
      daoGet: ::dao.get__rush_buy_groups,
      daoSet: ::dao.set__rush_buy_groups,
      daoRemove: ::dao.remove__rush_buy_groups
    },
    ::api.url.getRushbuy
  ).then(() => {
    commit(UPDATE_RUSHBUY, {block: blockRushbuy})
  })
}

/* *********
 mutations
 ********* */
/**
 * 刷新极有家的状态
 * payload.zippedData zippedData的长度可能不到4
 * payload.index
 */
const UPDATE_JIYOUJIA = 'UPDATE_JIYOUJIA'
mutations[UPDATE_JIYOUJIA] = function (state, payload) {
  // .
  /** @type Block */ let block = payload.block

  /** @type UIData */ let uiData =
    block.currentData$Zipped.toUIData(block.currentZipIndex)

  uiData.formatData(state.ji_you_jia)

  state.ji_you_jia = uiData.data
}

/**
 * 刷新淘抢购的状态
 * @type {string}
 */
const UPDATE_RUSHBUY = 'UPDATE_RUSHBUY'
mutations[UPDATE_RUSHBUY] = function (state, payload) {
  // .
  let block = payload.block

  let uiData = block.currentData$Zipped.toUIData(block.currentZipIndex)

  uiData.formatData(state.rush_buy)

  state.rush_buy = uiData.data
}

/* *********
 private function
 ********* */

/**
 * 复制blockData（浅复制）
 * @param blockData {BlockData_ | GroupedData_ | ZippedData_}
 * @return {BlockData_|*}
 */
function _copyBlockData (blockData) {
  return {
    id: blockData.id,
    name: blockData.name,
    title: blockData.title,
    columnType: blockData.columnType
  }
}

/**
 * 封装从服务端获取来的block数据
 *
 * 主要功能:
 * 1. 检测数据是否合法
 * 2. 语义化服务端数据
 * 3. 将自身转化未GroupedData
 */
class ServerData {
  /** ServerData_ */ data

  /**
   * 构造serverData
   * 并检测参数的合法性
   *
   * @param serverData_, 必需存在 'title', 'head', 'content'属性
   *                    head 或 content可以 空值
   *                    如 非空，则必须存在 content属性且为数组类型
   */
  constructor (serverData_) {
    // 简单判断
    if (!hasProps(serverData_, ['title', 'head', 'content'])) {
      console.error('serverData无法构造，类型不兼容，Simple， %s', serverData_)
      throw new Error('serverData无法构造，类型不兼容，Simple')
    }

    // 检查head和content
    if (!ServerData._checkContent(serverData_.head) ||
      !ServerData._checkContent(serverData_.content)) {
      console.error('serverData无法构造，类型不兼容，full， %s', serverData_)
      throw new Error('serverData无法构造，类型不兼容，full')
    }

    this.data = serverData_
  }

  /**
   * 语义化 部分属性值
   *
   * @return {ServerData}
   */
  formatType () {
    const head = this.data.head
    head && head.content.forEach(hc => {
      hc.type = ServerData._typeMapping.index2type[hc.type]
    })
    return this
  }

  /**
   * 增加时间戳信息
   *
   * @return {ServerData}
   */
  addTimestamp () {
    const data = this.data
    const {head, content} = data

    head && handler.addTimestamp(head)
    content && handler.addTimestamp(content)

    return this
  }

  get pageSize () {
    const data = this.data
    const {head, content} = data
    return Math.max(
      head ? head.totalPages : 0,
      content ? content.totalPages : 0)
  }

  /**
   * 转换为GroupedData
   *
   * @return {GroupedData}
   */
  toGroupedData () {
    const data = this.data

    let headGrouped = data.head
      ? handler.group('type')(data.head.content) // 服务端原始数据
      : null

    let contentGrouped = data.content
      ? handler.group()(data.content.content)
      : null

    let groupedData_ = data
    groupedData_.head = headGrouped
    groupedData_.content = contentGrouped

    return new GroupedData(groupedData_)
  }

  /*
   * 检测head，content
   * head和content可以为 null || undefined
   * 如果不为 n || u
   * 则其content属性必须存在且为数组
   */
  static _checkContent (headOrContent) {
    if (!headOrContent) {
      return true
    }
    return headOrContent.content instanceof Array
  }

  /*
   * 数据转换
   */
  static _typeMapping = {
    index2type: ['left', 'right', 'center'],
    type2index: {'left': 0, 'right': 1, 'center': 2}
  }
}

/**
 * 分组后的数据
 *
 * 优势：便于遍历，便于存储，便于组合，便于转换，整体充当中间角色的作用
 *
 * 具体方法有
 * 1. 过滤过期数据（该对象的data属性可直接存储到闪存中，使用构造函数重新构造该对象）
 * 2. 链接其它GroupedData（该对象可以存储到内存中，当拉取了下一页对象后，使用该方法组合新旧数据）
 * 3. 转换为ZippedData
 * 等
 */
class GroupedData {
  /** @type {GroupedData_} */ data

  /*
   * 使用data引用原对象
   * 格式化后的原对象必然包括['title', 'head', 'content']属性
   * 其中，head，content都可能为空
   * 但如果非空，则其必然包括 head: {0, 1}; content: {0, 1, 2, 3} 2个或4个属性
   */
  /**
   * 构造GroupedData
   * 并检测参数的合法性
   *
   * @param groupedData_ 必需存在 'title', 'head', 'content'属性
   *                     head 或 content可以 空值
   *                     如 非空，则其必需为
   *                       head: {0: Array ,1: Array}
   *                       content: {0: Array, 1, Array, 2: Array, 3: Array}
   *                       其中Array可以为 null, undefined, []
   */
  constructor (groupedData_) {
    // 简单判断
    if (!hasProps(groupedData_, ['title', 'head', 'content'])) {
      console.error('gropedData 无法构造，类型不兼容, %s', groupedData_)
      throw new Error('gropedData 无法构造，类型不兼容')
    }

    // 格式化并检测数据是否合法
    if (!GroupedData._formatGrouped(groupedData_)) {
      console.error('gropedData 无法构造，类型不兼容, %s', groupedData_)
      throw new Error('gropedData 无法构造，类型不兼容')
    }

    this.data = groupedData_
  }

  /**
   * 过滤期满数据(5天)
   *
   * @return {GroupedData}
   */
  deleteExpire () {
    const data = this.data
    const {head, content} = data

    head && (
      data.head = GroupedData._deleteExpire(head)
    )
    content && (
      data.content = GroupedData._deleteExpire(content)
    )

    return this
  }

  static EMPTY = 0
  static NORMAL = 1
  static FULL = 2

  /**
   * 检测数据书否为空
   * 主要用于检测过滤后的数据是否为空
   *
   * @return {*}
   */
  whatsDataEmpty () {
    const data = this.data
    const {head, content} = data

    let countOfHead = head ? GroupedData._countOfEmptyGroup(head) : 2
    let countOfContent = content ? GroupedData._countOfEmptyGroup(content) : 4

    // 检测是否 不存在有用数据
    if (countOfHead >= 2 && countOfContent >= 4) {
      if (countOfHead > 2 || countOfContent > 4) {
        console.warn(
          '[block] 分组超过了2组或4组，head: %s, content %s',
          countOfHead,
          countOfContent
        )
      }
      return GroupedData.EMPTY
    }

    if (countOfHead > 0 || countOfContent > 0) {
      return GroupedData.NORMAL
    }

    return GroupedData.FULL
  }

  /**
   * 链接另一个groupedData
   * 注意，重复数据将被自动去除 TODO 还未实现
   *
   * @param groupedData {GroupedData}
   * @return {GroupedData}
   */
  concat (groupedData) {
    if (!groupedData) {
      return this
    }

    // notnull
    let group1 = this.data
    let group2 = groupedData instanceof GroupedData
      ? groupedData.data
      : groupedData
    let result = _copyBlockData(group1)

    result.head = {}
    result.content = {}

    for (let i = 0; i <= 1; i++) {
      let groupHead1 = group1.head && group1.head[i]
      let groupHead2 = group2.head && group2.head[i]

      // head2未定义，使用head1；否则，将head2与（head1 || []）链接
      result.head[i] = groupHead2
        ? _unionBy(groupHead1, groupHead2, 'id')
        : groupHead1
      result.head[i] = result.head[i] || []
    }

    for (let i = 0; i <= 3; i++) {
      let groupContent1 = group1.content && group1.content[i]
      let groupContent2 = group2.content && group2.content[i]

      // content2未定义，使用content1；否则，将content2与（content1 || []）链接
      result.content[i] = groupContent2
        ? _unionBy(groupContent1, groupContent2, 'id')
        : groupContent1
      result.content[i] = result.content[i] || []
    }

    return new GroupedData(result)
  }

  /**
   * 转换为ZippedData
   *
   * @return {ZippedData}
   */
  toZippedData () {
    const data = this.data
    let zippedData_ = _copyBlockData(data)
    zippedData_.head = _zip(..._map(data.head, handler.self))
    zippedData_.content = _zip(..._map(data.content, handler.self))
    return new ZippedData(zippedData_)
  }

  /*
   * 格式化并检测数据是否合法
   */
  static _formatGrouped (groupedData_) {
    const head = groupedData_.head
    if (head) {
      for (let i = 0; i < 2; i++) {
        head[i] = head[i] || []
        if (!(head[i] instanceof Array)) {
          return false
        }
      }
    }
    const content = groupedData_.content
    if (content) {
      for (let i = 0; i < 4; i++) {
        content[i] = content[i] || []
        if (!(content[i] instanceof Array)) {
          return false
        }
      }
    }
    return true
  }

  /*
   * 过滤期满数据
   */
  static _deleteExpire (headOrContent) {
    for (let k in headOrContent) {
      if (headOrContent.hasOwnProperty(k)) {
        headOrContent[k] = handler.expireDataFilter()(headOrContent[k])
      }
    }
    return headOrContent
  }

  /*
   * 统计组员为空的组有多少个
   */
  static _countOfEmptyGroup (headOrContent) {
    let size = 0
    for (let k in headOrContent) {
      if (headOrContent.hasOwnProperty(k)) {
        if (!headOrContent[k]) {
          console.warn('[block] 分组后的数据存在异常组（非数组组）')
          headOrContent[k] = []
          size++
        }
        if (headOrContent[k].length === 0) {
          size++
        }
      }
    }
    return size
  }
}

/**
 * ZippedData已经和呈现在UI上的数据(UIData)比较相似了，
 * 不过它存储了多组UI数据
 */
class ZippedData {
  /** @type ZippedData_ */ data

  constructor (zippedData_) {
    // 简单判断
    if (!hasProps(zippedData_, ['title', 'head', 'content'])) {
      console.error('zippedData 无法构造，类型不兼容, %s', zippedData_)
      throw new Error('zippedData 无法构造，类型不兼容')
    }

    // 检查head和content
    if (!ZippedData._checkContent(zippedData_.head) ||
      !ZippedData._checkContent(zippedData_.content)) {
      console.error('zippedData 无法构造，类型不兼容, %s', zippedData_)
      throw new Error('zippedData 无法构造，类型不兼容')
    }

    this.data = zippedData_
  }

  get zipLength () {
    const data = this.data
    const {head, content} = data

    return Math.max(head ? head.length : 0, content ? content.length : 0)
  }

  toUIData (index) {
    if (index >= this.zipLength) {
      console.error(this)
      throw new Error('无法转换到UIData，原因是参数index超上限')
    }

    const data = this.data
    const {head, content} = data

    let uiData_ = _copyBlockData(data)

    if (head && head.length > index) {
      uiData_.head = head[index]
    }
    if (content && content.length > index) {
      uiData_.content = content[index]
    }

    return new UIData(uiData_)
  }

  static _checkContent (headOrContent) {
    if (!headOrContent) {
      return true
    }

    if (!(headOrContent instanceof Array)) {
      return false
    }

    for (let i in headOrContent) {
      if (headOrContent.hasOwnProperty(i)) {
        if (!(headOrContent[i] instanceof Array)) {
          return false
        }
      }
    }
    return true
  }
}

/**
 * 显示在UI上的数据，
 */
class UIData {
  /** @type {UnhandledUIData_ | UIData} */ data

  constructor (uiData) {
    this.data = uiData
  }

  /**
   * 格式化UIData
   *
   * @param oldUIData {UIData}
   * @return {UIData}
   */
  formatData (oldUIData) {
    const data = this.data
    const {head, content} = data

    const oldData = (oldUIData instanceof UIData) ? oldUIData.data : oldUIData
    const oldHeadData = oldData && oldData.head
    const oldContentData = oldData && oldData.content

    let nHead = []
    for (let i = 0; i < 2; i++) {
      if (!head && !oldHeadData) { // 该组数据本就不存在
        break
      }
      if (!head) { // 该组数据已用完
        console.log(oldHeadData)
        nHead = oldHeadData // 使用旧数据填充
        break
      }

      // 如果新数据存在，如果新数据不足，使用旧数据
      if (head[i]) {
        nHead[i] = head[i]
      } else {
        if (!oldHeadData) {
          console.error('head不足2且没有前置数据，可能是服务器返回了异常的数据')
          throw new Error('head不足2且没有前置数据，可能是服务器返回了异常的数据')
        }
        nHead[i] = oldHeadData[i]
      }

      // 添加placeholder
      !_isEmpty(oldHeadData) && (
        nHead[i].placeholder = oldHeadData[i].img
      )
    }
    data.head = nHead

    let nContent = []
    for (let i = 0; i < 2; i++) {
      if (!content && !oldContentData) {
        break
      }
      if (!content) {
        nContent = oldContentData
        break
      }

      nContent[i] = []
      for (let j = 0; j < 2; j++) {
        // 如果新数据存在，如果新数据不足，使用旧数据
        if (content[2 * i + j]) {
          nContent[i][j] = content[2 * i + j]
        } else {
          if (!oldContentData) {
            console.error('content不足4且没有前置数据，可能是服务器返回了异常的数据')
            throw new Error('content不足4且没有前置数据，可能是服务器返回了异常的数据')
          }
          nContent[i][j] = oldContentData[i][j]
        }

        // 添加placeholder
        !_isEmpty(oldContentData) &&
        !_isEmpty(oldContentData[i]) && (
          nContent[i][j].placeholder = oldContentData[i][j].img
        )
      }
    }
    data.content = nContent

    return this
  }
}

class Block {
  /**
   * 旧数据，已经使用过的数据
   * 便于行数据来临后，组合新旧数据
   *
   * @type {null | GroupedData}
   */
  oldData$Grouped = null

  /**
   * 当前数据，GroupedData Zip后的数据
   * Zip过的数据可以用很多次
   *
   * @type {null | ZippedData}
   */
  currentData$Zipped = null

  /**
   * 设置page的大小
   * @param size
   */
  set pageSize (size) {
    this._page.size = size
  }

  /**
   * 尝试将zip置为下一组
   *
   * @return {boolean} 是否成功置为下一组
   */
  nextZip () {
    const zip = this._zip

    // 未初始化时
    if (this.isFirstRequest()) {
      zip.index = 0
      return false
    }

    zip.index++

    return zip.index < this._zipLength - 1 // zip数是否充足
  }

  /**
   * 将page置为下一页（如果当前page存在的话）
   *
   * @return {number|undefined} 当前页，为负代表最后一页
   */
  nextPage () {
    const page = this._page
    const {size, index} = page

    // 未初始化时
    if (this.isFirstRequest()) {
      page.index = 0
      return undefined
    }

    if (index >= size - 1) {
      const t = index
      page.index = 0
      this._zip.index = 0 // 只有在page未最后一页，（且zip为最后一页，必然）才能重置zip
      return -t
    }

    return page.index++
  }

  /**
   * 是否为第一次请求（数据是否未初始化）
   *
   * （第一次请求时，先尝试从闪存拉取数据）
   *
   * 之后的请求从服务器拉取并拼接到原有数据中
   *
   * @return boolean 是否未第一次请求
   */
  isFirstRequest () {
    return !this.oldData$Grouped
  }

  /**
   * 得到当前的page
   *
   * @return {number}
   */
  get currentPage () {
    return this._page.index | 0
  }

  /**
   * 得到当前的zip的index（第几组zip）
   *
   * @return {number}
   */
  get currentZipIndex () {
    return this._zip.index | 0
  }

  get _zipLength () {
    return this.currentData$Zipped ? this.currentData$Zipped.zipLength : 0
  }

  _zip = {
    index: undefined // 从0开始
  }

  _page = {
    size: undefined,
    index: undefined // 分页，从0开始
  }
}

/**
 * 过滤闪存中的超期数据
 * 不依赖于外部变量
 *
 * @param block {Block}
 * @param removeBlockFromDao$Func {Function}
 */
function storageFilter (block, removeBlockFromDao$Func) {
  return (
    /**
     * @param groupedData_ {GroupedData_}
     * @return {boolean|ZippedData}
     *         false表示舍弃本次数据，
     *         true表示不处理本次数据，
     *         object代表替换的对象
     */
    groupedData_ => {
      if (
        typeof groupedData_ !== 'object' ||
        !groupedData_.head ||
        !groupedData_.content
      ) {
        return false
      }

      let groupedData = new GroupedData(groupedData_)

      // 过滤期满数据
      groupedData.deleteExpire()

      // 数据是否为空
      let whatsDataEmpty = groupedData.whatsDataEmpty()

      // 检测是否 不存在有用数据
      if (whatsDataEmpty === GroupedData.EMPTY) {
        removeBlockFromDao$Func()
        return false
      }

      // 保存groupedData，以便新来数据能与旧数据混合
      block.oldData$Grouped = groupedData

      // 数据长度不足，服务器补足
      if (whatsDataEmpty === GroupedData.NORMAL) {
        return false
      }

      // zip and return
      return groupedData.toZippedData()
    }
  )
}

/**
 * 当服务端数据返回后
 *
 * @param block {Block}
 * @param setBlock2Dao {Function} 将block保存值闪存的api
 */
function serverDataPacked (block, setBlock2Dao) {
  return function (serverData_) {
    if (!serverData_ || !serverData_.title) {
      console.log(serverData_)
      console.error('服务端返回的数据不合规范，由于数据较大使用log记录')
      return 'error'
    }

    serverData_.head = serverData_.head || null
    serverData_.content = serverData_.content || null

    let serverData = new ServerData(serverData_)

    // 记录分页的页数
    block.pageSize = serverData.pageSize

    // 格式化 分组 链接(上一次保存)
    let groupedData = serverData // 服务端获取的数据
      .formatType() // 格式化
      .addTimestamp() // 增加时间戳信息
      .toGroupedData() // 分组并包装为GroupedData
      .concat(block.oldData$Grouped) // 链接上一次保存的GroupedData

    // TODO 缺少数据重复过滤的代码

    // 保存本次分组后的数据，便于与下一组（下一页）数据混合
    block.oldData$Grouped = groupedData

    // 保存数据到闪存
    setBlock2Dao(JSON.stringify(groupedData.data))

    // zip and return
    return groupedData.toZippedData()
  }
}

/**
 * 数据拉取完毕
 *
 * @param block {Block}
 * @return {Function}
 */
function onDataGotten (block) {
  return event => {
    // .
    switch (event.type) {
      case 'error':
        event.error && console.error(event.error)
        return Promise.reject(event.data)

      case 'storage':
      case 'server':

        /** @type ZippedData */ let zippedData = event.data

        block.currentData$Zipped = zippedData

        return Promise.resolve()
    }

    return Promise.reject(new Error('未知的代码边界'))
  }
}

/**
 * 拉取
 *
 * @param logKey {string}
 * @param block {Block}
 * @param daoGet {Function} 读取数据
 * @param daoSet {Function} 保存到闪存中，参数：blockData: string
 * @param daoRemove {Function} 从闪存移除，参数：无
 * @param api {Function} 传入：(page, aPageSize)； 返回：url 的函数
 *
 * @return {Promise.<*>}
 */
function fetch (logKey, block, {daoGet, daoSet, daoRemove}, api) {
  // 闪存中还有已拉取但还未使用的数据
  if (block.nextZip()) {
    return Promise.resolve()
  }

  // 当前已经是最后一页
  if (block.nextPage() < 0) {
    return Promise.resolve()
  }

  // 是否为第一次fetch
  const isFirstRequest = block.isFirstRequest()

  // 需要获取新数据的情况
  return new Promise((resolve, reject) => {
    loader.load({
      // log key
      logKey,
      // 当该fetch是第一次执行（以block为单位），从闪存拉取数据
      storagePromise: isFirstRequest ? daoGet() : undefined,
      // 第一次拉取只拉取2份数据，第二次拉取（刷新时）全部数据
      serverPromiseFunc: () =>
        get(api(block.currentPage, isFirstRequest ? 2 : -1))
    }, {
      // 过滤闪存数据，过滤一些过期数据
      storageFilter: storageFilter(block, daoRemove),
      // 处理服务端返回的数据
      serverDataPacked: serverDataPacked(block, daoSet),
      // 数据获取完毕
      onDataGotten (event) {
        onDataGotten(block)(event).then(resolve, reject)
      }
    })
  })
}

/**
 * 极有家
 * @type {Block}
 */
let blockJiyoujia = new Block()
typeof window === 'object' && ( // TODO DEBUG
  window.blockJiyoujia = blockJiyoujia
)

/**
 * 淘抢购
 * @type {Block}
 */
let blockRushbuy = new Block()
typeof window === 'object' && ( // TODO DEBUG
  window.blockRushbuy = blockRushbuy
)

/* *********
 export
 ********* */

export default {
  state: {
    ji_you_jia: {
      head: [],
      content: []
    },
    rush_buy: {
      content: []
    }
  },
  getters: {
    ...getters
  },
  mutations,
  actions
}

export {FETCH_JIYOUJIA, FETCH_RUSHBUY}
