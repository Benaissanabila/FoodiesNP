<script setup lang="ts">
import { onMounted, watch, computed } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore.js'; 
import type { IRestaurant } from '../shared/interfaces/RestaurantInterface.ts';
import { RouterLink } from 'vue-router';
import StarRating from '@/components/StarRating.vue'; // Importez le nouveau composant
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/UserStore';

const props = defineProps<{
  restaurant: IRestaurant;
}>();

const store = useRestaurantStore(); 
const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  store.fetchRestaurantById(props.restaurant._id);
});

// Fonction pour calculer la distance
const getDistance = computed(() => {
  const distance = store.calculateDistanceToRestaurant(props.restaurant);
  return distance === Infinity ? 'N/A' : distance.toFixed(2); // Si la distance est infinie, afficher 'N/A'
});



// Watcher pour surveiller la note globale du restaurant
watch(
  () => store.restaurants.find(r => r._id === props.restaurant._id)?.globalRatingResaurant,
  (newRating) => {
    console.log('Global Rating:', newRating);
    // Vérifier si newRating est un nombre avant de l'assigner
    if (newRating !== undefined) {
      props.restaurant.globalRatingResaurant = newRating;
    } else {
      // Optionnel : définir une valeur par défaut si nécessaire
      props.restaurant.globalRatingResaurant = 0; 
    }
  }
);

const handleRestaurantClick = () => {
  if (userStore.isAuthenticated) {
    router.push({ name: 'restaurantdetails', params: { id: props.restaurant._id } });
  } else {
    router.push({ name: 'Login', query: { redirect: `/restaurantdetails/${props.restaurant._id}` } });
  }
};
</script>

<template>
  <div class="restaurant-card" @click="handleRestaurantClick">
    <img :src="restaurant.RestoPhoto" alt="Photo du restaurant" class="restaurant-image" />
    <div class="restaurant-details">
      <h3>{{ restaurant.name }}</h3>
      <p>{{ restaurant.address }}</p>
      <p>Distance: {{ getDistance }} km</p>
      <StarRating :rating="restaurant.globalRatingResaurant" />
      <p v-if="store.loading">Chargement de la note globale...</p>
      <p v-if="store.error">{{ store.error }}</p>
    </div>
  </div>
</template>

<style scoped>
.restaurant-card {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 8px; 
  width: 35vw; 
  min-width: 200px; 
  height: 140px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff; 
}

.restaurant-image {
  width: 110px; 
  height: 110px; 
  border-radius: 8px;
  margin-right: 10px;
}

.restaurant-details {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
}

h3 {
  font-size: 16px;
  margin: 0;
  font-weight: bold;
  color: #333;
}

p {
  font-size: 12px;
  color: #666;
  margin: 5px 0;
}
</style>
