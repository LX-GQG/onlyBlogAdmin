/*
 * @Author: LX_DUG
 * @Date: 2022-11-24 20:51:51 
 * @LastEditors: LX_DUG
 * @LastEditTime: 2023-01-29 15:36:18
 * @Description: description
 */
import { createRouter, createWebHistory } from 'vue-router'

export const menuRouter = [
  {
    path: "/permissions/user",
    name: "User",
    icon: 'UserFilled',
    component: () => import("@/views/permissions/user.vue"),
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
    },
    child:[
      
    ]
  },
  {
    path: "/permissions/role",
    name: "Role",
    icon: 'SwitchFilled',
    component: () => import("@/views/permissions/role.vue"),
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
    },
    child:[
      
    ]
  },
//   {
//     path: "/musicSource",
//     name: "MusicSource",
//     icon: 'Headset',
//     component: () => import("@/views/musicSource/musicSource.vue"),
//     meta: {
//       requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
//     },
//     child:[
      
//     ]
//   },
//   {
//     path: "/songList",
//     name: "songList",
//     component: () => import("@/views/songList/songList.vue"),
//     meta: {
//       requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
//     },
//     hidden: true,
//     child:[
      
//     ]
//   },
]

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '玥愔管理后台'
    },
    component: () => import('@/views/login.vue')
  },
  {
    path: "",
    name: "index",
    component: () => import("@/views/index.vue"),
    children: [
      {
        path: "/permissions/user",
        name: "User",
        icon: 'UserFilled',
        component: () => import("@/views/permissions/user.vue"),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        children:[
          
        ]
      },
      {
        path: "/permissions/role",
        name: "Role",
        icon: 'SwitchFilled',
        component: () => import("@/views/permissions/role.vue"),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        children:[
          
        ]
      },
      {
        path: "/article/article",
        name: "Article",
        icon: 'Tickets',
        component: () => import("@/views/article/article.vue"),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        children:[
          
        ]
      },
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
  {
    path: "/404",
    component: () => import("@/views/error/404.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
