/*
 * @version:
 * @Author: leaolly
 * @Date: 2023-03-22 09:35:06
 * @LastEditors:
 * @LastEditTime: 2023-06-13 10:14:34
 * @Descripttion: 模块描述
 */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/**  各个模块 */
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/pages/layout'),
      redirect: { name: 'Home' },
      children: [
        {
          path: 'home',
          name: 'Home',
          // 切换登录后进入哪个页面
          // component: () => import('@/pages/home/index'),
          component: () => import('@/pages/homes/index'),
          redirect: { name: 'pageList' },
          children: [
            {
              path: 'page-list',
              name: 'pageList',
              component: () => import('@/pages/home/page-list')
            },
            {
              path: 'my-template',
              name: 'myTemplate',
              component: () => import('@/pages/home/my-template')
            },
            {
              path: 'page-data',
              name: 'pageData',
              component: () => import('@/pages/home/page-data')
            },
            {
              path: 'page-data-detail',
              name: 'pageDataDetail',
              component: () => import('@/pages/home/page-data-detail')
            },
            {
              path: 'template-list',
              name: 'templateList',
              component: () => import('@/pages/home/template-list')
            }
          ]
        },
        {
          path: '/editor',
          name: 'Editor',
          component: () => import('@/pages/editor/Index')
        },
        {
          path: '/template',
          name: 'Template',
          component: () => import('@/pages/template/Index')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/Login'),
      meta: {
        hideHeader: true,
        trust: true,
        noNeedLogin: true
      }
    }
  ]
});
