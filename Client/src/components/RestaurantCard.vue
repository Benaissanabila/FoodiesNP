<script setup lang="ts">
import { onMounted, watch, computed } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore.js'; 
import type { IRestaurant } from '../shared/interfaces/RestaurantInterface.ts';
import { RouterLink } from 'vue-router';
import StarRating from '@/components/StarRating.vue'; // Importez le nouveau composant

const props = defineProps<{
  restaurant: IRestaurant;
}>();

const store = useRestaurantStore(); 

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
</script>

<template>
  <div class="restaurant-card">
    <RouterLink :to="{ name: 'restaurantdetails', params: { id: restaurant._id } }">
      <img :src="restaurant.RestoPhoto" alt="Photo du restaurant" class="restaurant-image" />
    </RouterLink>
    <div class="restaurant-details">
      <h3>{{ restaurant.name }}</h3>
      <p>{{ restaurant.address }}</p>
      <p>
      Distance: {{ getDistance }} km
    </p>
      <StarRating :rating="restaurant.globalRatingResaurant" /> <!-- Utilisation du composant StarRating -->
      
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
  padding: 8px; /* Réduire le remplissage */
  width: 35vw; /* Largeur proportionnelle ajustée */
  min-width: 250px; /* Largeur minimale ajustée */
  height: 140px; /* Hauteur ajustée */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff; /* Fond blanc */
}

.restaurant-image {
  width: 110px; /* Taille de l'image augmentée */
  height: 110px; /* Hauteur automatique pour garder le ratio */
  border-radius: 8px;
  margin-right: 10px;
}

.restaurant-details {
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
