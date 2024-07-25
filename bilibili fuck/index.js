// ==UserScript==
// @name         bilibili-fuck
// @namespace    http://tampermonkey.net/
// @version      2024-07-24
// @description  去你妈的bilibili推荐!,我要学习!!!
// @match        https://www.bilibili.com/
// @author       XyGodCyx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlhttpRequest
// @connect     api.bilibili.com
// ==/UserScript==

// @match        *://*.bilibili.com/*
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
    // 顶部的检查去广告横幅
    adblock_tips: {
      select: '.adblock-tips',
      value: null,
      status: 'normal',
    },
    // 右上角的换一换按钮
    feed_roll_btn: {
      select: '.feed-roll-btn',
      value: null,
      status: 'normal',
    },
    // 右下角的反馈按钮组
    palette_button_outer: {
      select: '.palette-button-outer.palette-feed4',
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
    feed_card1: {
      // 因为去除了轮播图,所以第五个元素的样式会受到影响,所以需要调整
      select: '.feed-card:nth-child(6)',
      value: null,
      status: 'normal',
      wantAddStyle: {
        marginTop: '40px',
      },
    },
    feed_card2: {
      // 因为去除了轮播图,所以第五个元素的样式会受到影响,所以需要调整
      select: '.feed-card:nth-child(7)',
      value: null,
      status: 'normal',
      wantAddStyle: {
        marginTop: '40px',
      },
    },
  }
  const needPushCustomChildrenDom = {
    // 主页面的推荐视频容器
    is_version8: {
      select: '.is-version8',
      value: null,
      status: 'normal',
    },
  }
  const allDom = {
    ...shouldKillDom,
    ...updateStyleDom,
    ...needPushCustomChildrenDom,
  }

  let panel = null
  const bodyOverflowStyle = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  createInitLargerPanel()
  window.onload = async function () {
    // deleteAllChild()
    setTimeout(removeAllAD, 3)
    setTimeout(initAllDom, 6)
    setTimeout(hideShouldKill, 9)
    setTimeout(initUpdateStyleDom, 12)
    setTimeout(updateStyle, 15)
    setTimeout(async () => {
      const response = await sendRequest()
      console.log(response.data)
      const result = response.data.result[11]
      pushCustomChildren(result)
      setTimeout(() => {
        panel.remove()
        document.body.style.overflow = bodyOverflowStyle
      }, 10)
    }, 20)
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

  let targetNode = document.querySelector('.left-entry') // 假设你要监听的元素的类名是 .left-entry

  let config = { childList: true, subtree: true }

  let callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
      }
    }
  }

  let observer = new MutationObserver(callback)

  observer.observe(targetNode, config)

  function deleteAllChild() {
    for (let key in needPushCustomChildrenDom) {
      const element = needPushCustomChildrenDom[key]
      element.value.innerHTML = ''
    }
  }
  function pushCustomChildren(result) {
    deleteAllChild()
    console.log(result)
    console.log(needPushCustomChildrenDom.is_version8)
    setTimeout(() => {
      const data = result.data
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item.release_status !== 0) {
          continue
        }
        const card = createVideoCard(item)
        if (needPushCustomChildrenDom.is_version8.value.firstChild) {
          // 如果有子节点，将新元素插入到第一个子节点之前
          needPushCustomChildrenDom.is_version8.value.insertBefore(
            card,
            needPushCustomChildrenDom.is_version8.value.firstChild
          )
        } else {
          // 如果没有子节点，直接将新元素添加到父元素中
          needPushCustomChildrenDom.is_version8.value.appendChild(card)
        }
      }

      setTimeout(async () => {
        await initUpdateStyleDom()
        updateStyle()
      }, 30)
    }, 30)
  }
  function createVideoCard(item) {
    let { arcurl, pic, upic, mid, description, title, duration, play, danmaku, author, pubdate } =
      item
    const parser = new DOMParser()

    const cardHtml = `
     <div
      data-v-7b96dfea=""
      class="feed-card">
      <div
        data-v-7b96dfea=""
        class="bili-video-card is-rcmd enable-no-interest"
        data-report="tianma.2-2-4.click"
        style="--cover-radio: 56.25%">
        <div class="bili-video-card__skeleton hide">
          <div class="bili-video-card__skeleton--cover"></div>
          <div class="bili-video-card__skeleton--info">
            <div class="bili-video-card__skeleton--right">
              <p class="bili-video-card__skeleton--text"></p>
              <p class="bili-video-card__skeleton--text short"></p>
              <p class="bili-video-card__skeleton--light"></p>
            </div>
          </div>
        </div>
        <!---->
        <!--内容区域 -->
         <div class="bili-video-card__wrap __scale-wrap">
      <div
        class="bili-video-card__no-interest"
        style="display: none">
        <div class="bili-video-card__no-interest--inner">
          <div class="bili-video-card__no-interest--left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 36 36"
              width="36"
              height="36"
              class="no-interest-icon"
              fill="currentColor">
              <path
                d="M3 18C3 9.715724999999999 9.715724999999999 3 18 3C26.284274999999997 3 33 9.715724999999999 33 18C33 26.284274999999997 26.284274999999997 33 18 33C9.715724999999999 33 3 26.284274999999997 3 18zM12.796710000000001 12.694004999999999C12.358049999999999 12.253995 11.645745 12.2529 11.205735 12.691575C10.765709999999999 13.130234999999999 10.764615 13.842555 11.20329 14.282565000000002L13.41144 16.494975L11.20329 18.7074C10.764615 19.147350000000003 10.765709999999999 19.8597 11.205735 20.298375C11.645745 20.73705 12.358049999999999 20.735925 12.796710000000001 20.295975L15.2682 17.81895C15.99795 17.087175000000002 15.99795 15.902775000000002 15.2682 15.17097L12.796710000000001 12.694004999999999zM24.794325 12.691575C24.354300000000002 12.2529 23.64195 12.253995 23.203274999999998 12.694004999999999L20.7318 15.17097C20.00205 15.902775000000002 20.00205 17.087175000000002 20.7318 17.81895L23.203274999999998 20.295975C23.64195 20.735925 24.354300000000002 20.73705 24.794325 20.298375C25.234274999999997 19.8597 25.2354 19.147350000000003 24.796725000000002 18.7074L22.588575 16.494975L24.796725000000002 14.282565000000002C25.2354 13.842555 25.234274999999997 13.130234999999999 24.794325 12.691575zM15.900974999999999 24.68535C16.843875 23.425575000000002 17.722649999999998 23.257199999999997 18 23.257199999999997C18.277350000000002 23.257199999999997 19.15605 23.425575000000002 20.099025 24.68535C20.471024999999997 25.182975 21.176025 25.284675 21.67365 24.912675C22.171274999999998 24.540599999999998 22.273049999999998 23.8356 21.900975 23.33805C20.5938 21.591 19.082024999999998 21.007199999999997 18 21.007199999999997C16.917900000000003 21.007199999999997 15.406125 21.591 14.09898 23.33805C13.72692 23.8356 13.82871 24.540599999999998 14.326305 24.912675C14.823929999999999 25.284675 15.5289 25.182975 15.900974999999999 24.68535z"
                fill="currentColor"></path></svg
            ><span class="no-interest-title">不感兴趣</span
            ><span class="no-interest-desc">将减少此类内容推荐</span>
          </div>
          <div class="bili-video-card__no-interest--right">
            <div class="revert-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="revert-icon"
                fill="currentColor">
                <path
                  d="M8.28032 2.46967C8.57321 2.76257 8.57321 3.23744 8.28032 3.53033L4.81065 7L8.28032 10.46965C8.57321 10.76255 8.57321 11.23745 8.28032 11.53035C7.98743 11.8232 7.51254 11.8232 7.21966 11.53035L3.57321 7.88389C3.08505 7.39573 3.08505 6.60428 3.57321 6.11612L7.21966 2.46967C7.51254 2.17678 7.98743 2.17678 8.28032 2.46967z"
                  fill="currentColor"></path>
                <path
                  d="M3.75 7C3.75 6.58579 4.08579 6.25 4.5 6.25L14.25 6.25C17.97795 6.25 21 9.27208 21 13C21 16.72795 17.97795 19.75 14.25 19.75L7.5 19.75C7.08579 19.75 6.75 19.4142 6.75 19C6.75 18.5858 7.08579 18.25 7.5 18.25L14.25 18.25C17.1495 18.25 19.5 15.8995 19.5 13C19.5 10.10052 17.1495 7.75 14.25 7.75L4.5 7.75C4.08579 7.75 3.75 7.41421 3.75 7z"
                  fill="currentColor"></path>
              </svg>
              撤销
            </div>
          </div>
        </div>
      </div>
      <a
        class="bili-video-card__image--link"
        href="${arcurl}"
        target="_blank"
        data-spmid="333.1007"
        data-mod="tianma.2-1-3"
        data-idx="click"
        ><div class="bili-video-card__image __scale-player-wrap bili-video-card__image--hover">
          <div class="bili-video-card__image--wrap">
            <div class="bili-watch-later--wrap">
              <div
                class="bili-watch-later bili-watch-later--pip watch-later-fade-enter-to"
                style="display: none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bili-watch-later__icon">
                  <path
                    d="M10 3.1248000000000005C6.20305 3.1248000000000005 3.1250083333333336 6.202841666666667 3.1250083333333336 9.999833333333335C3.1250083333333336 13.796750000000001 6.20305 16.874833333333335 10 16.874833333333335C11.898291666666667 16.874833333333335 13.615833333333333 16.106291666666667 14.860625 14.861916666666666C15.104708333333335 14.617916666666666 15.500416666666668 14.617958333333334 15.7445 14.862041666666668C15.9885 15.106166666666669 15.988416666666668 15.501916666666666 15.744333333333334 15.745958333333334C14.274750000000001 17.215041666666668 12.243041666666667 18.124833333333335 10 18.124833333333335C5.512691666666667 18.124833333333335 1.8750083333333334 14.487125 1.8750083333333334 9.999833333333335C1.8750083333333334 5.512483333333334 5.512691666666667 1.8748000000000002 10 1.8748000000000002C14.487291666666668 1.8748000000000002 18.125 5.512483333333334 18.125 9.999833333333335C18.125 10.304458333333333 18.108208333333334 10.605458333333333 18.075458333333337 10.901791666666668C18.0375 11.244916666666667 17.728625 11.492291666666667 17.385583333333333 11.454333333333334C17.0425 11.416416666666667 16.795083333333334 11.107541666666668 16.833000000000002 10.764458333333334C16.860750000000003 10.513625000000001 16.875 10.2585 16.875 9.999833333333335C16.875 6.202841666666667 13.796958333333333 3.1248000000000005 10 3.1248000000000005z"
                    fill="currentColor"></path>
                  <path
                    d="M15.391416666666666 9.141166666666667C15.635458333333334 8.897083333333335 16.031208333333332 8.897083333333335 16.275291666666668 9.141166666666667L17.5 10.365875L18.72475 9.141166666666667C18.968791666666668 8.897083333333335 19.364541666666668 8.897083333333335 19.608625 9.141166666666667C19.852666666666668 9.385291666666667 19.852666666666668 9.780958333333334 19.608625 10.025083333333333L18.08925 11.544416666666669C17.763833333333334 11.869833333333334 17.236208333333334 11.869833333333334 16.91075 11.544416666666669L15.391416666666666 10.025083333333333C15.147333333333334 9.780958333333334 15.147333333333334 9.385291666666667 15.391416666666666 9.141166666666667z"
                    fill="currentColor"></path>
                  <path
                    d="M12.499333333333334 9.278375C13.05475 9.599 13.05475 10.400666666666668 12.499333333333334 10.721291666666668L9.373916666666666 12.525791666666668C8.818541666666667 12.846416666666666 8.124274999999999 12.445583333333333 8.124274999999999 11.804291666666668L8.124274999999999 8.1954C8.124274999999999 7.554066666666667 8.818541666666667 7.153233333333334 9.373916666666666 7.473900000000001L12.499333333333334 9.278375z"
                    fill="currentColor"></path></svg
                ><span
                  class="bili-watch-later__tip--lab"
                  style="display: none"
                  >添加至稍后再看</span
                ><!---->
              </div>
            </div>
            <picture class="v-img bili-video-card__cover"
              ><!--[-->
              <source
                srcset="
                  ${pic}@672w_378h_1c_!web-home-common-cover.avif
                "
                type="image/avif" />
              <source
                srcset="
                  ${pic}@672w_378h_1c_!web-home-common-cover.webp
                "
                type="image/webp" />
              <img
                src="${pic}@672w_378h_1c_!web-home-common-cover"
                alt="${description}"
                loading="eager"
                onload="fsrCb()"
                onerror="typeof window.imgOnError === 'function' &amp;&amp; window.imgOnError(this)" /><!--]--></picture
            >
            <div
              class="v-inline-player"
              data-player-seek-time="0"></div>
          </div>
          <div class="bili-video-card__mask">
            <div class="bili-video-card__stats">
              <div class="bili-video-card__stats--left">
                <!--[--><span class="bili-video-card__stats--item"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="#ffffff"
                    class="bili-video-card__stats--icon">
                    <!--[-->
                    <path
                      d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                      fill="currentColor"></path>
                    <path
                      d="M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z"
                      fill="currentColor"></path>
                    <!--]--></svg
                  ><span class="bili-video-card__stats--text">${play}</span></span
                ><!--]--><span class="bili-video-card__stats--item"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="#ffffff"
                    class="bili-video-card__stats--icon">
                    <!--[-->
                    <path
                      d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                      fill="currentColor"></path>
                    <path
                      d="M15.875 10.75L9.875 10.75C9.46079 10.75 9.125 10.4142 9.125 10C9.125 9.58579 9.46079 9.25 9.875 9.25L15.875 9.25C16.2892 9.25 16.625 9.58579 16.625 10C16.625 10.4142 16.2892 10.75 15.875 10.75z"
                      fill="currentColor"></path>
                    <path
                      d="M17.375 14.75L11.375 14.75C10.9608 14.75 10.625 14.4142 10.625 14C10.625 13.5858 10.9608 13.25 11.375 13.25L17.375 13.25C17.7892 13.25 18.125 13.5858 18.125 14C18.125 14.4142 17.7892 14.75 17.375 14.75z"
                      fill="currentColor"></path>
                    <path
                      d="M7.875 10C7.875 10.4142 7.53921 10.75 7.125 10.75L6.625 10.75C6.21079 10.75 5.875 10.4142 5.875 10C5.875 9.58579 6.21079 9.25 6.625 9.25L7.125 9.25C7.53921 9.25 7.875 9.58579 7.875 10z"
                      fill="currentColor"></path>
                    <path
                      d="M9.375 14C9.375 14.4142 9.03921 14.75 8.625 14.75L8.125 14.75C7.71079 14.75 7.375 14.4142 7.375 14C7.375 13.5858 7.71079 13.25 8.125 13.25L8.625 13.25C9.03921 13.25 9.375 13.5858 9.375 14z"
                      fill="currentColor"></path>
                    <!--]--></svg
                  ><span class="bili-video-card__stats--text">${danmaku}</span></span
                >
              </div>
              <span class="bili-video-card__stats__duration">${duration}</span>
            </div>
          </div>
          <div
            style="display: none"
            class="bili-video-card__progress"></div></div
      ></a>
      <div
        style=""
        class="bili-video-card__info __scale-disable">
        <!--[--><!----><!--]-->
        <div class="bili-video-card__info--right">
          <!--[-->
          <div
            class="bili-video-card__info--no-interest"
            style="display: none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="bili-video-card__info--no-interest--icon"
              fill="currentColor">
              <!--[-->
              <path
                d="M13.62335 5.49835C13.62335 6.3949 12.8966 7.12171 12 7.12171C11.10345 7.12171 10.37665 6.3949 10.37665 5.49835C10.37665 4.6018 11.10345 3.875 12 3.875C12.8966 3.875 13.62335 4.6018 13.62335 5.49835zM13.62345 18.4985C13.62345 19.3951 12.8966 20.12195 12 20.12195C11.10335 20.12195 10.3765 19.3951 10.3765 18.4985C10.3765 17.60185 11.10335 16.875 12 16.875C12.8966 16.875 13.62345 17.60185 13.62345 18.4985zM12 13.62485C12.89745 13.62485 13.62495 12.89735 13.62495 11.99995C13.62495 11.1025 12.89745 10.375 12 10.375C11.10255 10.375 10.37505 11.1025 10.37505 11.99995C10.37505 12.89735 11.10255 13.62485 12 13.62485z"
                fill="currentColor"></path>
              <!--]-->
            </svg>
          </div>
          <!----><!--]-->
          <h3
            class="bili-video-card__info--tit"
            title="${description || title}">
            <a
              href="${arcurl}"
              target="_blank"
              data-spmid="333.1007"
              data-mod="tianma.2-1-3"
              data-idx="click"
              >${description || title}
            </a>
          </h3>
          <div class="bili-video-card__info--bottom">
            <!--[--><a
              class="bili-video-card__info--owner"
              href="//space.bilibili.com/${mid}"
              target="_blank"
              data-spmid="333.1007"
              data-mod="tianma.2-1-3"
              data-idx="click"
              ><!----><span
                class="bili-video-card__info--author"
                title="${author}"
                >${author}</span
              ><span class="bili-video-card__info--date">· ${pubdate}</span></a
            ><!--]-->
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
    `
    return parser.parseFromString(cardHtml, 'text/html').body.firstChild
  }

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
      const element = dom[key]
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
  function initAllDom() {
    return new Promise((resolve, reject) => {
      getDom(allDom, 0)
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

  function sendRequest() {
    return new Promise(async (resolve, reject) => {
      const url = `https://api.bilibili.com/x/web-interface/wbi/search/all/v2?__refresh__=true
    &_extra=&context=&
    page=1&
    page_size=42&
    order=&duration=&from_source=&from_spmid=333.337&platform=pc&highlight=1&single_column=0&keyword=${'vue'}&qv_id=Q19CuQMsYh7C4N31px8aVfO7xtSBWEGS&ad_resource=5646&source_tag=3&web_location=1430654&w_rid=52c5174af1034c1f5f6da1af639e4024&wts=1721877692`
      const response = await GM.xmlHttpRequest({
        method: 'GET',
        url,
        headers: {
          'Host': 'api.bilibili.com',
          'Origin': 'https://search.bilibili.com/',
          'Referer': 'https://search.bilibili.com/',
          'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': 'Windows',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
        },
        // responseType: 'json',
      })
      resolve(JSON.parse(response.responseText))
    })
  }
})()
