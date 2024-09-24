<script setup lang='ts'>
import { onMounted, computed, ref } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore'; // Utilisation du store mis à jour
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface'; // Importation de l'interface IRestaurant

// Initialisation du store
const restaurantStore = useRestaurantStore();

// Liaison des valeurs du store aux variables locales
const searchQuery = ref(''); // Define searchQuery as a reactive reference
const filteredRestaurants = computed(() => restaurantStore.getFilteredRestaurants as IRestaurant[]); // Typage des restaurants filtrés
const loading = computed(() => restaurantStore.loading);
const showResults = ref(false); // Flag pour contrôler l'affichage des résultats

// Actions du store
const performSearch = () => {
  // Ne pas effectuer la recherche si le champ de recherche est vide
  if (!searchQuery.value.trim()) {
    showResults.value = false;
    return;
  }

  console.log('Searching for:', searchQuery.value); // Debug: Affiche la requête de recherche
  restaurantStore.updateSearchQuery(searchQuery.value); // Met à jour la requête dans le store
  showResults.value = true; // Afficher les résultats après la recherche

  // Debug: Vérifiez les restaurants filtrés
  console.log('Filtered Restaurants:', filteredRestaurants.value);
};

// Récupérer les restaurants lors de la montée du composant
onMounted(() => {
  restaurantStore.loadRestaurants();
});
</script>

<template>
  <div>
    <!-- Barre de recherche pour entrer le nom ou le type de cuisine -->
    <input 
      type="text" 
      v-model="searchQuery" 
      @keyup.enter="performSearch"  
      placeholder="Search by name or cuisine..." 
    />
    <button @click="performSearch">Search</button> <!-- Lance la recherche en cliquant sur le bouton -->

    <!-- Affichage des résultats de recherche uniquement après une recherche -->
    <div v-if="filteredRestaurants.length && !loading && showResults">
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
    <div v-else-if="!loading && showResults">
      <p>No results found</p>
    </div>
  </div>
</template>

<style scoped>
/* Ajoute des styles ici si nécessaire */
</style>
