import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welecome from '../components/welecome.vue'
import user from '../components/user/Users.vue'
import rights from '../components/power/Rights.vue'
import roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import order from '../components/order/order.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: './login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welecome',
    children: [
      { path: '/welecome', component: welecome },
      { path: '/users', component: user },
      { path: '/Rights', component: rights },
      { path: '/roles', component: roles },
      { path: '/categories', component: Cate },
      { path: '/Params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: order }
    ]
  }
]
const router = new VueRouter({
  routes
})
// beforeEach导航守卫
// to将要访问的路径
// from 从哪跳转来的
// next 放行 next（'./login'） 强制跳转
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页,直接放行
  if (to.path === '/login') return next()
  // 从sessionStrorage 中获取到 保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})
export default router
