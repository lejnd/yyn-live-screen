module.exports = {
	dest: 'website',
	locales: {
		'/': {
			lang: 'en-US',
			title: 'Wii Mobile UI',
			description: 'Platform group mobile ui framework'
		},
		'/zh/': {
			lang: 'zh-CN',
			title: 'Wii Mobile UI',
			description: '平台组移动端UI框架'
		}
	},
	head: [
		['link', { rel: 'icon', href: `/wiilogo.png` }],
		['link', { rel: 'stylesheet', href: `/doc.css` }],
	],
	serviceWorker: true,
	themeConfig: {
		docsDir: 'docs',
		locales: {
			'/': {
				label: 'English',
				selectText: 'Languages',
				nav: [{
					text: 'Guide',
					link: '/guide/'
				}, {
					text: 'WAU2 Solution',
					link: 'http://doc.wiiqq.com/wau/index.html'
				}],
				sidebar: []
			},
			'/zh/': {
				label: '简体中文',
				selectText: '选择语言',
				nav: [{
					text: '指南',
					link: '/zh/guide/'
				}],
				sidebar: [{
					title: '入门指南',
					collapsable: false,
					children: [
						'/zh/guide/'
					]
				}, {
					title: '组件',
					collapsable: false,
					children: [
						'/zh/guide/compoents/test',
						'/zh/guide/compoents/test2'
					]
				}]
			}
		}
	}
}