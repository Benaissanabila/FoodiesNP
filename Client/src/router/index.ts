import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailsRestaurant from '@/views/DetailsRestaurant.vue'
import LoginView from '../views/LoginView.vue'
import CreateAccount from '@/views/CreateAccount.vue';
import ProfileView from '@/views/ProfileView.vue';
import CreateRestaurant from '@/views/CreateRestaurant.vue';
import { useUserStore } from '@/stores/UserStore';
import TwoFAView from '@/views/TwoFAView.vue';
import ReviewPage from '@/views/ReviewPage.vue';
import MesReservationsPage from '@/views/MesReservationsPage.vue';
import MyRestaurantsList from '@/views/MyRestaurantsList.vue'
import EditRestaurant from '@/views/EditRestaurant.vue';

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
      component: DetailsRestaurant,
      meta: { requiresAuth: true }
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
    },
    {
      path: '/create-restaurant',
      name: 'CreateRestaurant',
      component: CreateRestaurant
    },
    {
      path: '/two-fa',
      name: 'TwoFA',
      component: TwoFAView
    },
    {
      path: '/restaurant/:id/review/:reservationId',
      name: 'Review',
      component: ReviewPage
    },
    {
      path: '/mes-reservations',
      name: 'MesReservations',
      component: MesReservationsPage 
    },
    {
      path: '/my-restaurants',
      name: 'MyRestaurants',
      component: MyRestaurantsList
    },
    {
      path: '/edit-restaurant/edit/:id',
      name: 'EditRestaurant',
      component: EditRestaurant,
    }
  

  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
