import Vue from 'vue';
import Router from 'vue-router';
import Home from '../pages/home';
import About from '../pages/about';
import HelloWorld from '../pages/helloWorld';
import NotFound from '../pages/notFound'

Vue.use(Router);

const router = new Router({
  // vue-router有hash和history两种模式
  // 其实更推荐使用history模式，但是使用history模式的话需要后端配合，这边的demo不涉及后端所以先用hash模式了
  // 参考：https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90
  // mode: 'history',
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/helloworld',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
        title: 'helloworld page'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        title: 'about page'
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: 'page not found'
      }
    }
  ]
});

// 注册全局后置钩子
router.afterEach((to, from) => {
  // 当页面路由变化时同步修改title
  const defaultTitle = '一个用 vue + webpack 搭建的脚手架框架';
  document.title = to.meta.title || defaultTitle;
});

export default router;