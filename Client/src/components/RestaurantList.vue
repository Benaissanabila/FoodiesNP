<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type {Restaurant} from '../shared/interfaces/RestaurantInterface.ts'
import axios from 'axios';

// Déclaration de la variable pour stocker les restaurants
const restaurants = ref<Restaurant[]>([]);  

const loading = ref(true);

// Fonction pour récupérer les restaurants depuis l'API
const fetchRestaurants = async () => {
  try {
    const response = await axios.get('http://localhost:3000/restaurants');
    restaurants.value = response.data; // Stocke les restaurants récupérés
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
  } finally {
    loading.value = false; // Désactive le loader après la récupération
  }
};

// Utilisation de onMounted pour exécuter la requête lorsque le composant est monté
onMounted(fetchRestaurants);
</script>

<template>
  <div>
    <h2>Liste des Restaurants</h2>

    <!-- Loader pendant le chargement -->
    <div v-if="loading">Chargement des restaurants...</div>

    <!-- Affichage des restaurants -->
    <ul v-else>
      <li v-for="restaurant in restaurants" :key="restaurant._id">
        <h3>{{ restaurant.name }}</h3>
        <p>Adresse: {{ restaurant.address }}</p>
        <p>Cuisine: {{ restaurant.cuisineType }}</p>
        <img :src="restaurant.RestoPhoto" alt="Photo du restaurant" width="200">
      </li>
    </ul>
  </div>
</template>

<style scoped>
h2 {
  font-size: 24px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
img {
  border-radius: 8px;
  margin-top: 10px;
}
</style>
