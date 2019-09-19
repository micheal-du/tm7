import Vue from 'vue'
import Router from 'vue-router'
/*引入资源请求插件*/
import axios from 'axios';

/*使用axios插件*/
Vue.prototype.$axios = axios;

Vue.use(Router)

import goodsmen from '@/components/goodsMen'
import notice from '@/components/notice'
import classfy from '@/components/classfy'
import tag from '@/components/tag'
import ansmenger from '@/components/ansMenger'
import setting from '@/components/setting'
import order from '@/components/order'
import login from '@/components/login'
import test from '@/components/test'
import poster from '@/components/poster'
import timeline from '@/components/timeline'
import postmould from '@/components/postmould'
import discount from '@/components/discount'
import gift from '@/components/gift'
import payset from '@/components/payset'
import salegoods from '@/components/salegoods'
import pay from '@/components/pay'

export const constantRouterMap = [
	{
      path: '/goodsmen/:ID',
      name: 'goodsmen',
      component: goodsmen,
},
	{
      path: '/',
      name: 'notice',
      component: notice,
},
	{
      path: '/classfy',
      name: 'classfy',
      component: classfy,
},
{
      path: '/tag',
      name: 'tag',
      component: tag,
},
{
      path: '/ansmenger',
      name: 'ansmenger',
      component: ansmenger,
},
{
      path: '/setting',
      name: 'setting',
      component: setting,
},
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/test',
    name: 'test',
    component: test,
  },
{
      path: '/order/:ID',
      name: 'order',
      component: order,
},
  {
    path: '/poster',
    name: 'poster',
    component: poster,
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: timeline,
  },
  {
    path: '/postmould',
    name: 'postmould',
    component: postmould,
  },
  {
    path: '/discount',
    name: 'discount',
    component: discount,
  },
  {
    path: '/gift',
    name: 'gift',
    component: gift,
  },
  {
    path: '/payset',
    name: 'payset',
    component: payset,
  },
  {
    path: '/payset',
    name: 'payset',
    component: payset,
  },
  {
    path: '/salegoods',
    name: 'salegoods',
    component: salegoods,
  },
  {
    path: '/pay',
    name: 'pay',
    component:pay,
  },
  {
    path: '/leve',
    name: 'leve',
    component: ()=>import('@/components/leve.vue'),
  },
  {
    path: '/refund',
    name: 'refund',
    component: ()=>import('@/components/refund.vue'),
  },
  {
    path: '/paysuce',
    name: 'paysuce',
    component: ()=>import('@/components/paysuce.vue'),
  },
  {
    path: '/compsutions',
    name: 'compsutions',
    component: ()=>import('@/components/compsutions.vue'),
  },
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

