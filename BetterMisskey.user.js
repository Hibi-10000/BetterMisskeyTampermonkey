// ==UserScript==
// @name         Better Misskey
// @namespace    http://tampermonkey.net/
// @version      0.3.1-hibi.1b
// @description  include等にお好みのMisskeyインスタンスを入力して利用してください
// @author       kaonasi_biwa, Hibi_10000
// @homepage     https://github.com/Hibi-10000/BetterMisskeyTampermonkey
// @icon         https://www.google.com/s2/favicons?sz=64&domain=misskey-hub.net
// @updateURL    https://github.com/Hibi-10000/BetterMisskeyTampermonkey/releases/latest/download/BetterMisskey.user.js
// @downloadURL  https://github.com/Hibi-10000/BetterMisskeyTampermonkey/releases/latest/download/BetterMisskey.user.js
// @grant        none
// @match        *://mi.ablaze.one/*
// @match        *://misskey.io/*
// @match        *://misskey.04.si/*
// @match        *://ktnfm.com/*
// @match        *://otoya.space/*
// @match        *://misskey.sda1.net/*
// @match        *://misskey.dev/*
// @match        *://submarin.online/*
// @match        *://m.komefura.com/*
// @match        *://misskey.flowers/*
// @match        *://voskey.icalo.net/*
// ==/UserScript==

// fork from https://github.com/kaonasi-biwa/BetterMisskeyTampermonkey/

'use strict';
let articleClick = true; //ノートクリックでTwitterのように拡大表示できるようにする
let followIconClick = true; //フォロー・フォロワー一覧でアイコンクリックだけでプロフィール表示できるようにする
let rnUseQuote = false; //RNを引用RNを使ったものにする

let observer = new MutationObserver(observerFunc)
let observerRoot = document.querySelector("#misskey_app,#app")
const observerConfig = { childList: true, subtree: true }

function observerFunc() {
    document.querySelector("#misskey_app > div > div > div:nth-child(2) > div._pageContainer > div > div > div[data-sticky-container-header-height]").onclick = closeClick
    document.querySelector("#misskey_app > div > div > div:nth-child(1) > div").onclick = closeClick
    observer.disconnect();
    if (articleClick) {
        let icons = document.querySelectorAll(`[tabindex] > :is(article,div) [href^="/@"][title]:not(.misskeyKaonasi)`)
        for (let elem of icons) {
            if (elem.parentElement.querySelector(`header [href^="/notes/"]`) != null) {
                elem.parentElement.onclick = eventClick
            }
            elem.classList.add("misskeyKaonasi")
        }
    }
    if (followIconClick && location.host != "submarin.online") {
        let followIcons = document.querySelectorAll(":is(.avatar,span[title]):not(.misskeyKaonasi):not(a > *)")
        for (let elem of followIcons) {
            elem.onclick = avatarClick
            elem.style.cursor = "pointer"
            elem.classList.add("misskeyKaonasi")
        }
    }
    if (rnUseQuote) {
        let rnIcon = document.querySelectorAll(`[role="menuitem"][tabindex="0"]:not(.misskeyKaonasi) > .ti-fw.xh8pZ.ti.ti-repeat`)
        for (let elem of rnIcon) {
            let base = elem.parentElement.parentElement
            elem.parentElement.outerHTML = elem.parentElement.outerHTML
            base.children[0].classList.add("misskeyKaonasi")
            base.children[0].addEventListener(
                'click',
                rnClick,
                true
            )
        }
    }
    observer.observe(observerRoot, observerConfig)
}

const setStyle = () => {
    const newStyle = document.createElement("style")
    newStyle.classList.add("bmCSS")
    const css_style = `
/* ナビゲーションバーがアイコンの時にクリックスポットを広げる */
#misskey_app > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) {
    padding: 0;
    margin: 15px auto;
}
#misskey_app > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > button {
    width: auto;
    padding: 5px 7.5%;
}
#misskey_app > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > button > img {
    width: 100%;
}
#misskey_app > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(2) {
    width: 54px;
    margin: 0 auto auto auto;
    flex: 0;
}
#misskey_app > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(3) {
    width: 52px;
    margin: 20px auto 0 auto;
    padding: 0;
}
#misskey_app > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(3) > button:nth-child(2) {
    margin: auto;
}
`
    const textNode = document.createTextNode(css_style)
    newStyle.appendChild(textNode)
    document.querySelector("head").appendChild(newStyle)
}

function eventClick(event) {
    if (event.target.tagName == "SUMMARY") return
    if (event.target.tagName == "ARTICLE" || event.target.tagName == "DIV" || event.target.tagName == "FOOTER" || event.target.tagName == "HEADER") {
        //event.currentTarget.querySelector(`header [href^="/notes/"]`).click()
        //const popups = document.querySelectorAll(`#misskey_app > div > div.xpAOc > div.xnMEB._shadow > div.xbt7a > span.xaEYs > button [class~="ti-x"]`)
        //if (popups.length != 0) for (let popup of popups) popup.parentElement.click()
        const clickEvent = document.createEvent('MouseEvents')
        clickEvent.initEvent("mousedown", true, true)
        event.currentTarget.parentElement.querySelector(`footer [class~="ti-dots"]`).parentElement.dispatchEvent(clickEvent)
        setTimeout(() => {
            document.querySelector(`#misskey_app > div > div.xc6MI.xEzLL > div.xr8AW > div > div > button [class~="ti-info-circle"]`).parentElement.click()
        }, 0);
    }
    event.stopPropagation()
    event.stopImmediatePropagation()
    event.preventDefault()
}

function closeClick(event) {
    if (event.target.tagName == "SUMMARY") return
    if (event.target.tagName == "DIV") {
        const popups = document.querySelectorAll(`#misskey_app > div > div.xpAOc > div.xnMEB > div.xbt7a > span.xaEYs > button > [class~="ti-x"]`)
        if (popups.length != 0) for (let popup of popups) popup.parentElement.click()
    }
    event.stopPropagation()
    event.stopImmediatePropagation()
    event.preventDefault()
}

function avatarClick(event) {
    (event.currentTarget.parentElement.querySelector("a.name") ?? event.currentTarget.parentElement.querySelector(`a[href^="/@"]`))?.click()
}

function rnClick(event) {
    event.currentTarget.nextElementSibling.click()
    window.setTimeout(() => document.querySelector(`[data-cy-open-post-form-submit=""]`).click(),100)
    event.stopPropagation()
    event.stopImmediatePropagation()
    event.preventDefault()
}

const setObs = () => {
    if (!observerRoot && document.querySelector("#misskey_app,#app")) {
        observerRoot = document.querySelector("#misskey_app,#app")
    }
    if (observerRoot) {
        observer.observe(observerRoot, observerConfig)
    }
    else {
        window.setTimeout(setObs, 1000)
    }
}

(function() {
    'use strict';
    setObs();
    //setStyle();
})();
