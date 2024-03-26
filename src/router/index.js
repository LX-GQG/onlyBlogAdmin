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
      title: 'only后台'
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
        name: "Admin",
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
      {
        path: "/user/user",
        name: "User",
        icon: 'User',
        component: () => import("@/views/user/user.vue"),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        children:[
          
        ]
      },
      {
        path: "/tag/tag",
        name: "Tag",
        icon: 'Discount',
        component: () => import("@/views/tag/tag.vue"),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        children:[
          
        ]
      },
      {
        path: "/detect/detect",
        name: "Detected",
        icon: 'Mouse',
        component: () => import("@/views/detect/detect.vue"),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        children:[
          
        ]
      },
      {
        path: "/detect/echart",
        name: "Echart",
        icon: 'Mouse',
        component: () => import("@/views/detect/echart.vue"),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        children:[
          
        ]
      },
      {
        path: "/lottery/lottery",
        name: "Lottery",
        icon: 'Present',
        component: () => import("@/views/lottery/lottery.vue"),
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
