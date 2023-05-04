import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import type { RouteRecordRaw } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as unknown as RouteRecordRaw[]
})

export default router
