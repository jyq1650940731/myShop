import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 全局样式
import './assets/css/global.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编译器
import VueQuillEditor from 'vue-quill-editor'

import axios from 'axios'

axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

// 将富文本编译器, 注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.filter('dataFormat', originVal => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, 0)
  const d = (dt.getDate() + '').padStart(2, 0)

  const hh = (dt.getHours() + '').padStart(2, 0)
  const mm = (dt.getMinutes() + '').padStart(2, 0)
  const ss = (dt.getSeconds() + '').padStart(2, 0)

  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
