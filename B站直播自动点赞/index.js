// ==UserScript==
// @name         bilibili live auto like
// @namespace    http://tampermonkey.net/
// @version      2024-06-05
// @description  try to take over the world!
// @author       You
// @match        https://live.bilibili.com/1758151881?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	// Your code here...
	const ev = new MouseEvent('click');
	console.log('auto like start...');
	let like_btn = document.querySelector('.like-btn');
	setInterval(() => {
		if (!like_btn) {
			like_btn = document.querySelector('.like-btn');
		}
		like_btn.dispatchEvent(ev);
	}, 100);
})();
