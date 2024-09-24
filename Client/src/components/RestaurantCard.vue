<script setup lang="ts">
import { defineProps } from 'vue';
import type { IRestaurant } from '../shared/interfaces/RestaurantInterface.ts';

// Déclaration des props
const props = defineProps<{
  restaurant: IRestaurant;
}>();
</script>

<template>
  <div class="restaurant-card">
    <img :src="restaurant.RestoPhoto" alt="Photo du restaurant" class="restaurant-image" />
    <div class="restaurant-details">
        <h3>{{ restaurant.name }}</h3>
      <p>{{ restaurant.address }}</p>
      <div class="rating">
        <i class="fa fa-star"></i>
      
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
  width: 40vw; /* Largeur proportionnelle à 30% de la largeur de la fenêtre */
  /* Fixer une largeur maximale pour éviter des cartes trop grandes sur de très grands écrans */
  min-width: 280px; /* Fixer une largeur minimale pour éviter des cartes trop petites sur de petits écrans */
  height: 160px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Légère ombre */
  background-color: #fff; /* Couleur de fond blanche */
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

.rating i {
  color: #ffcc00;
  margin-right: 2px;
}
</style>

