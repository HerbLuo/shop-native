/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/8/19
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/8/19 herbluo created
 */
import _reduce from 'lodash/reduce'
import {logLevel} from '../config'

/**
 * 日志等级，转化后的数据类似 {assert:0, error: 1}
 *
 * @type {{string: number}}
 */
const LEVEL_MAP = _reduce([
  'assert',
  'error',
  'warn',
  'info', // 所有未记录的级别，等同于info级别
  'debug'
], (result, value, key) => {
  result[value] = key
  return result
}, {})

const _level = LEVEL_MAP[logLevel]

for (let m in console) {
  if (console.hasOwnProperty(m) && typeof console[m] === 'function') {
    // 日志等级过滤(未指定等级的按info计算)
    if ((LEVEL_MAP[m] || LEVEL_MAP['info']) > _level) {
      console[m] = () => {
      }
    }
  }
}

/*
 * 针对 warn 和 error特殊处理
 */
const fmt = require('util').format
const modal = (() => weex.requireModule('modal'))()

// noinspection JSUndefinedPropertyAssignment, JSUnresolvedVariable
console.oldError = console.oldError || ::console.error
// noinspection JSUndefinedPropertyAssignment, JSUnresolvedVariable
console.oldWarn = console.oldWarn || ::console.warn

const _showErrorDialog = (msg) => {
  const duration = msg.length / 18
  modal.toast({
    message: msg,
    duration: duration < 1 ? 1 : duration
  })
}

const __levelMap = {
  'ERROR': 'red',
  'WARN': 'orange'
}

/**
 * 格式化参数（添加颜色信息）
 * 返回 console.log 可用的的参数数组
 *
 * @param levelStr {'ERROR'|'WARN'}
 * @param args {Arguments}
 * @param args[0] {string}
 * @private
 */
const _formatArgs = (levelStr, args) => {
  args[0] = `[${new Date().getTime()}] ${levelStr} ${args[0]}\n`
  return [
    '%c%s',
    'color:' + __levelMap[levelStr],
    fmt(...args)
  ]
}

/**
 * console.error 参数一样，功能相似 不支持 %c
 *
 */
const printError = function () {
  if (typeof arguments[0] === 'string') {
    console.log(..._formatArgs('ERROR', arguments))
  } else {
    // noinspection JSUnresolvedFunction
    console.oldError(...arguments)
  }
  _showErrorDialog(fmt(...arguments))
}

/**
 * console.warn
 */
const printWarn = function () {
  if (typeof arguments[0] === 'string') {
    console.log(..._formatArgs('WARN', arguments))
  } else {
    // noinspection JSUnresolvedFunction
    console.oldError(...arguments)
  }
}

/*
 * export
 */
console.error = printError
console.warn = printWarn

const Style = {
  styleGray: 'color:gray',
  styleBlue: 'color:blue',
  styleGreen: 'color:green',
  styleRed: 'color:red'
}

const logger = console
export {logger, Style}
