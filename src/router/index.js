import Vue from 'vue'
import Router from 'vue-router'

import App from '@/App'
import Index from 'pages/index'
import Main from 'pages/main'
import Wxapp from 'pages/wxapp'

Vue.use(Router)

const routes = [{
	path: '/',
	component: Index
}, {
	path: '/guide',
	component: App,
	children: [{
			path: '/',
			component: Main
		}
	]
}, {
	path: '/wxapp',
	component: Wxapp
}]

export default new Router({
	routes
})