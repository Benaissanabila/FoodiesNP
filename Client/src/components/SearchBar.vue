<script setup lang='ts'>
import { onMounted } from 'vue';
import { useSearchBarStore } from '@/stores/SearchBarStore'; // Chemin vers ton store Pinia
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface'; // Importation de l'interface IRestaurant

// Initialisation du store
const searchBarStore = useSearchBarStore();

// Liaison des valeurs du store aux variables locales
const searchQuery = searchBarStore.searchQuery;
const filteredRestaurants = searchBarStore.getFilteredRestaurants as IRestaurant[]; // Typage des restaurants filtrés
const loading = searchBarStore.loading;

// Actions du store
const updateSearchQuery = searchBarStore.updateSearchQuery;

// Récupérer les restaurants lors de la montée du composant
onMounted(() => {
  searchBarStore.loadRestaurants();
});

</script>

<template>
  <div>
    <!-- Barre de recherche pour entrer le nom ou le type de cuisine -->
    <input 
      type="text" 
      v-model="searchQuery" 
      @input="updateSearchQuery(($event.target as HTMLInputElement).value || '')" 
      placeholder="Search by name or cuisine..." 
    />
    <button @click="updateSearchQuery(searchQuery)">Search</button>

    <!-- Affichage du loader pendant le chargement des restaurants -->
    <div v-if="loading">
      <p>Loading restaurants...</p>
    </div>

    <!-- Affichage des résultats de recherche -->
    <div v-if="filteredRestaurants.length && !loading">
      <h3>Search Results:</h3>
      <ul>
        <li v-for="(restaurant, index) in filteredRestaurants" :key="restaurant._id">
          <img :src="restaurant.RestoPhoto" alt="Restaurant photo" width="100" height="60" />
          <strong>{{ restaurant.name }}</strong> - {{ restaurant.cuisineType || 'Cuisine Type Not Available' }} <br/>
          {{ restaurant.address }} <br/>
          {{ restaurant.schedule }} <br/>
          {{ restaurant.phoneNumber || 'Phone Number Not Available' }} <br/><br/>
        </li>
      </ul>
    </div>

    <!-- Message si aucun résultat trouvé -->
    <div v-else-if="!loading">
      <p>No results found</p>
    </div>
  </div>
</template>

<style scoped>
/* Ajoute des styles ici si nécessaire */
</style>
