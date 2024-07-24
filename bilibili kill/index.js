// ==UserScript==
// @name         bilibili-fuck
// @namespace    http://tampermonkey.net/
// @version      2024-07-24
// @description  去你妈的bilibili推荐!,我要学习!!!
// @author       XyGodCyx
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  const shouldKillDom = {
    headerChannel: {
      select: '.header-channel',
      value: null,
      status: 'normal',
    },
    biliHeader__channel: {
      select: '.bili-header__channel',
      value: null,
      status: 'normal',
    },
    carousel_container: {
      select: '.recommended-swipe',
      value: null,
      status: 'normal',
    },
  }

  const updateStyleDom = {
    large_header: {
      select: '.large-header',
      value: null,
      status: 'normal',
      wantAddStyle: {
        marginBottom: '20px',
      },
    },
  }
  let panel = null
  let needRemoveAD = false
  // const bodyOverflowStyle = document.body.style.overflow
  // document.body.style.overflow = 'hidden'
  // createInitLargerPanel()
  window.onload = async function () {
    setTimeout(initShouldKill, 3)
    setTimeout(initUpdateStyleDom, 6)
    setTimeout(hideShouldKill, 9)
    setTimeout(updateStyle, 12)
    setTimeout(removeAllAD, 15)
    // panel.remove()
    // document.body.style.overflow = bodyOverflowStyle
  }
  setInterval(() => {
    removeAllAD()
  }, 200)
  function createInitLargerPanel() {
    panel = document.createElement('div')
    function initStyle() {
      panel.style.width = '100vw'
      panel.style.height = '100vh'
      panel.style.zIndex = 2147483647
      panel.style.position = 'absolute'
      panel.style.top = 0
      panel.style.left = 0
      panel.style.display = 'flex'
      panel.style.alignItems = 'center'
      panel.style.justifyContent = 'center'
      panel.style.backgroundColor = 'rgba(0,0,0,255)'
      panel.style.fontSize = '100px'
      panel.textContent = '正在净化bilibili...'
      panel.style.overflow = 'hidden'
      panel.style.color = '#ffffff'
    }
    initStyle()
    document.body.appendChild(panel)
  }

  // 选择你要监听的元素
  let targetNode = document.querySelector('.left-entry') // 假设你要监听的元素的类名是 .left-entry

  // 配置MutationObserver
  let config = { childList: true, subtree: true }

  // 创建一个回调函数，当有变化时执行
  let callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log('子节点被添加或移除')
        // 你可以在这里添加具体的处理逻辑
      }
    }
  }

  // 创建一个MutationObserver实例并传入回调函数
  let observer = new MutationObserver(callback)

  // 开始监听目标节点
  observer.observe(targetNode, config)

  // 监听滚动事件
  // window.addEventListener('scroll', judgmentScroll)
  function removeAllAD() {
    let rcmdCard = document.querySelectorAll('.bili-video-card.is-rcmd')
    rcmdCard.forEach((item) => {
      if (
        item.children.length === 1 &&
        !item.children[0].classList.contains('bili-video-card__skeleton')
      ) {
        if (item.parentNode.classList.contains('feed-card')) {
          item.parentNode.remove()
        } else {
          item.remove()
        }
      }
    })
  }
  function getDom(dom, count) {
    // count 防止死循环 如果获取5次还获取不到说明有问题
    for (let key in dom) {
      let element = dom[key]
      element.value = document.querySelector(element.select)
    }
  }

  function initUpdateStyleDom() {
    return new Promise((resolve, reject) => {
      getDom(updateStyleDom, 0)
      resolve(true)
    })
  }

  function initShouldKill() {
    return new Promise((resolve, reject) => {
      getDom(shouldKillDom, 0)
      resolve(true)
    })
  }
  function hideShouldKill() {
    for (let key in shouldKillDom) {
      let element = shouldKillDom[key]
      if (!isElementExist(element)) {
        continue
      }
      element.value.style.display = 'none'
      element.value.style.opacity = 0
      element.value.style.visiblity = 'hidden'
      element.value.remove()
      element.status = 'hidden'
    }
  }
  function updateStyle() {
    for (let key in updateStyleDom) {
      let element = updateStyleDom[key]
      if (!isElementExist(element)) {
        continue
      }
      for (let styleKey in element.wantAddStyle) {
        element.value.style[styleKey] = element.wantAddStyle[styleKey]
      }
    }
  }
  function isElementExist(element) {
    return element.value
  }
})()
