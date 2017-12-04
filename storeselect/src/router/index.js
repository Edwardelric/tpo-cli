import Vue from 'vue'
import Router from 'vue-router'
const storeSelect = resolve => require(['../components/storeselect'], resolve);
const index = resolve => require(['../components/index'], resolve);
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/storeselect',
      name: 'storeselect',
      meta: {
        title: '门店选择'
      },
      component: storeSelect
    },
    {
      path: '/',
      name: 'storeselect',
      meta: {
        title: '门店首页'
      },
      component: index
    }
  ]
});

const title = '门店选择';

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : title;
  next();
})

export default router;
