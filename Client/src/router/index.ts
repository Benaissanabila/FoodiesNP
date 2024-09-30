import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailsRestaurant from '@/views/DetailsRestaurant.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/restaurantdetails',
      name: 'restaurantdetails',
      component: DetailsRestaurant
    }
  ]
})

export default router
