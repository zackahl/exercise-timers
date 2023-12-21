// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Exercise Timers',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/',
        name: 'Exercise Timers',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'stopwatch',
        name: 'Stopwatch',
        component: () => import('@/views/Stopwatch.vue'),
      },
      {
        path: 'countdown',
        name: 'Countdown',
        component: () => import('@/views/Countdown.vue'),
      },
      {
        path: 'interval',
        name: 'Interval',
        component: () => import('@/views/Interval.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // scroll to anchor
      return {el: to.hash, behavior: 'smooth'}
    } else {
      // scroll to top
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router
