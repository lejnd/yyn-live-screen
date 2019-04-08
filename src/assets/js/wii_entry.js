require('../css/common.less')

import Vue from 'vue'
import WiiNoticeBar from 'components/notice-bar/index'

//将你要全局注册的组件写到这里
let components = [WiiNoticeBar]

components.map(component => {
  if (typeof component.name !== 'undefined') {
    try {
      Vue.component(component.name, component)
    } catch (err) {
      console.log(component)
      console.log(err)
    }
  }
})