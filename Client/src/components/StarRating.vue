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
  
  .rating-value {
    margin-left: 5px; /* Espace entre les étoiles et la note */
    font-weight: bold; /* Mettre la note en gras */
    color: #333; /* Couleur de la note */
  }
  </style>
  