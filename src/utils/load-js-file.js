/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/8/27
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/8/27 herbluo created
 */
const loadJsFile = (src) => {
  const oHead = document.getElementsByTagName('HEAD').item(0)
  const oScript = document.createElement('script')
  oScript.src = src
  oHead.appendChild(oScript)
}

export {
  loadJsFile
}
