<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore.js'; 
import type { IRestaurant } from '../shared/interfaces/RestaurantInterface.ts';
import { RouterLink } from 'vue-router';

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
    <RouterLink to="/restaurantdetails"><img :src="restaurant.RestoPhoto" alt="Photo du restaurant" class="restaurant-image" /></RouterLink>
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
        <p class="rating-value">{{ restaurant.globalRatingResaurant.toFixed(1) }}</p> <!-- Afficher la note à côté des étoiles -->
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

.rating {
  display: flex;
  align-items: center;
}

.stars {
  display: flex;
}

.star {
  font-size: 24px; /* Taille des étoiles */
  color: #ccc; /* Couleur par défaut pour les étoiles vides */
}

.star.filled {
  color: #ffcc00; /* Couleur pour les étoiles remplies */
}

.rating-value {
  margin-left: 5px; /* Espace entre les étoiles et la note */
  font-weight: bold; /* Mettre la note en gras */
  color: #333; /* Couleur de la note */
}

.rating p {
  margin-left: 10px; /* Espace entre les étoiles et les messages de chargement/erreur */
}
</style>
