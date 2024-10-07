import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailsRestaurant from '@/views/DetailsRestaurant.vue'
import LoginView from '../views/LoginView.vue'
import CreateAccount from '@/views/CreateAccount.vue';
import ProfileView from '@/views/ProfileView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/restaurantdetails/:id',
      name: 'restaurantdetails',
      component: DetailsRestaurant
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView, // Route pour la page de login
    },
    {
      path: '/create-account',
      name: 'CreateAccount',
      component: CreateAccount, // Route pour la page de création de compte
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView,
    }
  ]
})

export default router
