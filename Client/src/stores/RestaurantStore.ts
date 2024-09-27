import { defineStore } from 'pinia';
import axios from 'axios';
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface';
import type { IComment } from '@/shared/interfaces/CommentInterface';
import mapboxgl from 'mapbox-gl';

export const useRestaurantStore = defineStore('Restaurant', {
  state: () => ({
    searchQuery: '',
    restaurants: [] as IRestaurant[],
    restaurantMarkers: [] as mapboxgl.Marker[],
    comments: [] as IComment[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // Getter pour récupérer tous les restaurants
    getAllRestaurants(state) {
      return state.restaurants;
    },
    // Getter pour les restaurants triés par note globale
    sortedRestaurants(state) {
      return [...state.restaurants].sort((a, b) => {
        return b.globalRatingResaurant - a.globalRatingResaurant; // Tri décroissant
      });
    },
    // Getter pour un restaurant par son ID
    getRestaurantById: (state) => (id: string) => {
      return state.restaurants.find((restaurant) => restaurant._id === id);
    },
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
      if (this.restaurants.length > 0) return; // Ne fait rien si les restaurants sont déjà chargés
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3000/restaurants');
        this.restaurants = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des restaurants:', error);
        this.error = 'Erreur lors de la récupération des restaurants';
      } finally {
        this.loading = false;
      }
    },
    

    // Nouvelle action pour charger les emplacements des restaurants
    async loadRestaurantLocations(map: mapboxgl.Map) {
      await this.loadRestaurants(); // Récupérer les restaurants
      this.updateRestaurantMarkers(map, this.getAllRestaurants); // Mettre à jour les marqueurs sur la carte
    },

    // Action pour récupérer un commentaire d'un restaurant
    async fetchCommentsByRestaurantId(restaurantId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`http://localhost:3000/restaurants/${restaurantId}/comments`);
        this.comments = response.data; // Stocke les commentaires récupérés
      } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
        this.error = 'Erreur lors de la récupération des commentaires';
      } finally {
        this.loading = false;
      }
    },

    // Action pour récupérer un seul restaurant par ID
    async fetchRestaurantById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`http://localhost:3000/restaurants/${id}`);
        const restaurant = response.data;
        // Ajout du restaurant à la liste si ce n'est pas déjà le cas
        if (!this.restaurants.find((r) => r._id === id)) {
          this.restaurants.push(restaurant);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du restaurant:', error);
        this.error = 'Erreur lors de la récupération du restaurant';
      } finally {
        this.loading = false;
      }
    },

    // Action pour mettre à jour les marqueurs de restaurant sur la carte pour les restaurants filtrés
   // Mettre à jour les marqueurs des restaurants sur la carte
   updateRestaurantMarkers(map: mapboxgl.Map, restaurants: IRestaurant[]) {
    // Supprimer les marqueurs existants
    this.clearMarkers(map)

    // Ajouter de nouveaux marqueurs
    restaurants.forEach((restaurant) => {
      if (restaurant.latitude && restaurant.longitude) {
        const marker = new mapboxgl.Marker()
          .setLngLat([restaurant.longitude, restaurant.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(restaurant.name)) // Ajouter un popup avec le nom du restaurant
          .addTo(map)

        // Ajouter le marqueur au tableau pour une gestion future
        this. restaurantMarkers.push(marker)
      }
    })
  },

  // Fonction pour supprimer tous les marqueurs de la carte
  clearMarkers(map: mapboxgl.Map) {
    this. restaurantMarkers.forEach((marker) => marker.remove()) // Supprimer chaque marqueur
    this. restaurantMarkers = [] // Réinitialiser le tableau des marqueurs
  }
}

   
});
