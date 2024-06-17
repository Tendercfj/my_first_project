import { createRouter, createWebHistory } from 'vue-router'
import AppLayOut from '@/components/layout/AppLayOut.vue'
import IndexView from '@/views/IndexViews.vue'
import { useMyTokenStore } from '@/stores/mytoken'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/LoginView.vue')
    },
    {
      path: '/',
      component: AppLayOut,
      meta: { requiresAuth: true, tittle: '首页' },
      children: [
        {
          path: '',
          name: 'home',
          component: IndexView,
          meta: { tittle: '默认页' }
        },
        {
          path: '/menus',
          name: 'menus',
          component: () => import('../views/menu/MenuIndex.vue'),
          meta: { tittle: '菜单列表' }
        },
        {
          path: '/menus/create',
          name: 'menu-create',
          component: () => import('../views/menu/CreateOrEdit.vue'),
          meta: { tittle: '创建菜单' }
        },
        {
          path: '/menus/edit/:id',
          name: 'menu-edit',
          component: () => import('../views/menu/CreateOrEdit.vue'),
          meta: { tittle: '编辑菜单' }
        },
        {
          path: '/resource-category',
          name: 'resource-category',
          component: () => import('../views/resource-category/RescourceCategory.vue'),
          meta: { tittle: '资源分类' }
        },
        {
          path: '/resources',
          name: 'resources',
          component: () => import('../views/resources/RescourcesIndex.vue'),
          meta: { tittle: '资源列表' }
        },
        {
          path: '/roles',
          name: 'roles',
          component: () => import('../views/roles/RolesIndex.vue'),
          meta: { tittle: '角色列表' }
        },
        {
          path: '/roles/alloc-menus/:roleId',
          name: 'alloc-menus',
          component: () => import('../views/roles/AllocMenus.vue'),
          props: true /* 动态路由参数，将路径中的id当成属性接受 */,
          meta: { tittle: '分配菜单' }
        },
        {
          path: '/roles/alloc-resources/:roleId',
          name: 'alloc-resources',
          component: () => import('../views/roles/AllocRescources.vue'),
          props: true /* 动态路由参数，将路径中的id当成属性接受 */,
          meta: { tittle: '分配资源' }
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('../views/users/UsersIndex.vue'),
          meta: { tittle: '用户列表' }
        },
        {
          path: '/courses',
          name: 'courses',
          component: () => import('../views/courses/CoursecIndex.vue'),
          meta: { tittle: '课程列表' }
        },
        {
          path: '/courses/content/:courseId',
          name: 'course-content',
          component: () => import('../views/courses/CourseContent.vue'),
          props: true /* 动态路由参数，将路径中的id当成属性接受 */,
          meta: { tittle: '章节与课时' }
        },
        {
          path: '/courses/create',
          name: 'courses-create',
          component: () => import('../views/courses/CreateOrEidt.vue'),

          meta: { tittle: '创建课程' }
        },
        {
          path: '/courses/edit/:courseId',
          name: 'course-edit',
          component: () => import('../views/courses/CreateOrEidt.vue'),
          props: true /* 动态路由参数，将路径中的id当成属性接受 */,
          meta: { tittle: '编辑课程' }
        },
        {
          path: '/:xxx(.*)*',
          component: () => import('../views/ErrorPage.vue')
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
          meta: { tittle: '关于' }
        }
      ]
    }
  ]
})
/* 
/aa/bb/cc/dd
/aa
/aa/bb
/aa/bb/cc
/aa/bb/cc/dd
*/
router.beforeEach((to, from, next) => {
  // 路由守卫，判断是否需要登录
  if (to.matched.some((record) => record.meta?.requiresAuth)) {
    const store = useMyTokenStore()
    if (!store.token?.access_token) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
  }
  next()
})
export default router
