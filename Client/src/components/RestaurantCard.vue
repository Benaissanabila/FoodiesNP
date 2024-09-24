<script lang="ts" setup>
  // Imports
  import { defineProps, computed } from 'vue';
  import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface';  
  import type { IComment } from '@/shared/interfaces/CommentInterface';        
  
  // Props definition for the restaurant passed into the component
  defineProps<{
    restaurant: IRestaurant;
    comments: IComment[];   // List of comments for the restaurant
  }>();
  
  
 
  </script>

<template>
    <div class="restaurant-card">
      <img :src="restaurant.RestoPhoto" alt="Restaurant Photo" class="restaurant-photo" />
  
      <div class="restaurant-info">
        <h2>{{ restaurant.name }}</h2>
        <p>{{ restaurant.address }}</p>
  
        <div class="restaurant-rating">
          <!-- On affiche toujours 5 étoiles vides -->
          
        </div>
      </div>
    </div>
  </template>
  
  
  
  <style scoped>
  .restaurant-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 16px;
    max-width: 300px;
  }
  
  .restaurant-photo {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
  }
  
  .restaurant-info {
    text-align: center;
    margin-top: 16px;
  }
  
  .restaurant-rating {
    margin-top: 10px;
    color: #ddd; /* Couleur des étoiles vides */
    font-size: 20px;
  }
  
  .star {
    color: #ddd; /* Étoiles vides par défaut */
  }
  
  .star.filled {
    color: #FFD700; /* Couleur dorée pour les étoiles remplies */
  }
  </style>
  