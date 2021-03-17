import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 全局样式
import './assets/css/global.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'

axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
