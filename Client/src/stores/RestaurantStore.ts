import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useSearchBarStore = defineStore("searchBar", {
  state: () => ({
    searchQuery: "", // La requête de recherche
    restaurants: [], // Données des restaurants récupérées via API
    loading: true,  // Indicateur de chargement
  }),

  getters: {
    // Getter qui renvoie les restaurants filtrés par nom ou type de cuisine
    getFilteredRestaurants: (state) => {
      if (state.searchQuery) {
        const lowerCaseQuery = state.searchQuery.toLowerCase();
        return state.restaurants.filter(
          (restaurant: { name: string; cuisineType?: string }) =>
            restaurant.name.toLowerCase().includes(lowerCaseQuery) ||
            restaurant.cuisineType?.toLowerCase().includes(lowerCaseQuery)
        );
      }
      return state.restaurants;
    },
  },

  actions: {
    // Action pour mettre à jour la requête de recherche
    updateSearchQuery(query: string) {
      this.searchQuery = query;
    },

    // Action pour récupérer les restaurants via l'API
    async loadRestaurants() {
        this.loading = true;
        try {
          const response = await axios.get('http://localhost:3000/restaurants');
          this.restaurants = response.data; // Stocke les données récupérées
          console.log('Restaurants loaded:', this.restaurants); // Debug: Vérifie les restaurants récupérés
        } catch (error) {
          console.error('Erreur lors de la récupération des restaurants:', error);
        } finally {
          this.loading = false;
        }
      }
      ,
  },
});
