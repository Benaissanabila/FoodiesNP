<template>
    <div class="rating">
      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ filled: star <= rating }"
        >
          ★
        </span>
      </div>
      <p class="rating-value">{{ rating.toFixed(1) }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    rating: number; // Prop pour la note globale
  }>();
  </script>
  
  <style scoped>
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
  .rating {
  display: flex; /* Met tout sur la même ligne */
  align-items: center; /* Aligne verticalement les étoiles et la note */
}
  
  .rating-value {
    margin-left: 10px;
    font-weight: bold; /* Mettre la note en gras */
    color: #3f3f3f; /* Couleur de la note */
    padding-top: 4px;
  }
 
  </style>
  