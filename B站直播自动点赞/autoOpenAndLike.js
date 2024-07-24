const puppeteer = require('puppeteer');

(async () => {
	// 启动 Chrome 浏览器
	const browser = await puppeteer.launch({ headless: false });

	// 打开新页面
	const page = await browser.newPage();

	// 转到指定网址
	await page.goto('https://live.bilibili.com/1758151881?live_from=81011');
	const like_btn = await page.$$eval('.like-btn', (like_btn) => {
		return like_btn[0];
	});
	// console.log(like_btn);
	if (like_btn) {
		const ev = new MouseEvent('click');
		setInterval(() => {
			like_btn.dispatchEvent(ev);
		}, 300);
	}
	// 关闭浏览器
	// await browser.close();
})();
