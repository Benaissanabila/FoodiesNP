<script setup lang="ts">
import { defineProps, onMounted, watch, watchEffect } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore.js'; 
import type { IRestaurant } from '../shared/interfaces/RestaurantInterface.ts';

const props = defineProps<{
  restaurant: IRestaurant;
}>();

const store = useRestaurantStore(); 

onMounted(() => {
  store.fetchRestaurantById(props.restaurant._id);
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
    <img :src="restaurant.RestoPhoto" alt="Photo du restaurant" class="restaurant-image" />
    <div class="restaurant-details">
      <h3>{{ restaurant.name }}</h3>
      <p>{{ restaurant.address }}</p>
      <div class="rating">
        <div class="stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= restaurant.globalRatingResaurant }"
          >
            ★
          </span>
        </div>
        <p v-if="store.loading">Chargement de la note globale...</p>
        <p v-if="store.error">{{ store.error }}</p>
      </div>
    </div>
  </div>
</template>



<style scoped>
.restaurant-card {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
  width: 40vw; /* Proportional width */
  min-width: 280px; /* Minimum width */
  height: 160px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff; /* White background */
}

.restaurant-image {
  width: 70px;
  height: 85%;
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

.rating {
  display: flex;
  align-items: center;
}

.stars {
  display: flex;
}

.star {
  font-size: 24px; /* Size of the stars */
  color: #ccc; /* Default color for empty stars */
}

.star.filled {
  color: #ffcc00; /* Color for filled stars */
}

.rating p {
  margin-left: 10px; /* Space between stars and loading/error messages */
}
</style>
