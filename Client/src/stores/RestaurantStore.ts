import { defineStore } from 'pinia'
import axios from 'axios'
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface'
import type { IComment } from '@/shared/interfaces/CommentInterface'
import mapboxgl from 'mapbox-gl'

export const useRestaurantStore = defineStore('Restaurant', {
  state: () => ({
    searchQuery: '', 
    restaurants: <IRestaurant[]>([]),
    restaurantMarkers: [] as any[],
    comments: <IComment[]>([]),
    loading: true, 
    error: null as string | null, 
  }),

  getters: {
    // Getter pour récupérer tous les restaurants
    getAllRestaurants(state) {
      return state.restaurants
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
        const lowerCaseQuery = state.searchQuery.toLowerCase()
        return state.restaurants.filter(
          (restaurant: { name: string; cuisineType?: string }) =>
            restaurant.name.toLowerCase().includes(lowerCaseQuery) ||
            restaurant.cuisineType?.toLowerCase().includes(lowerCaseQuery)
        )
      }
      return state.restaurants
    },
    
  },

  actions: {
    // Action pour mettre à jour la requête de recherche
    updateSearchQuery(query: string) {
      this.searchQuery = query
    },

    // Action pour récupérer les restaurants via l'API
    async loadRestaurants() {
      this.loading = true
      this.error = null;
      try {
        // Récupération des restaurants via axios
        const response = await axios.get('http://localhost:3000/restaurants')
        this.restaurants = response.data // Stocke les données récupérées
      } catch (error) {
        console.error("Erreur lors de la récupération des restaurants:", error);
        this.error = "Erreur lors de la récupération des restaurants";
      } finally {
        this.loading = false
      }
    },
//Action pour recuperer un commentaire d'un restaurant 
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
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`http://localhost:3000/restaurants/${id}`)
        const restaurant = response.data
        // Ajout du restaurant à la liste si ce n'est pas déjà le cas
        if (!this.restaurants.find((r) => r._id === id)) {
          this.restaurants.push(restaurant)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du restaurant:', error)
        this.error = 'Erreur lors de la récupération du restaurant'
      } finally {
        this.loading = false
      }
    },
     // Method to geocode an address
     async geocodeAddress(address: string) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoicGF0cmlja2M1MTQiLCJhIjoiY2x3aTlibWh3MDRxZTJscGszYnJoODI2ZSJ9.7abA_VeG2IHewqyfW7iAqw`
        );
        const data = response.data;
        if (data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          return { longitude, latitude };
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
      return null;
    },

    // Action to update restaurant markers on the map for filtered restaurants
async updateRestaurantMarkers(map: mapboxgl.Map, filteredRestaurants: IRestaurant[]): Promise<void>  {
  // Remove old markers
  this.restaurantMarkers.forEach((marker: mapboxgl.Marker) => marker.remove());
  this.restaurantMarkers = [];

  // Ajouter des marqueurs pour les restaurants filtrés
  for (const restaurant of filteredRestaurants) {
    const coordinates = await this.geocodeAddress(restaurant.address);
    if (coordinates) {
      const marker = new mapboxgl.Marker()
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${restaurant.name}</h3><p>${restaurant.address}</p>`))
        .addTo(map);
      this.restaurantMarkers.push(marker);
    }
  }
},
clearMarkers(map: mapboxgl.Map) {
  this.restaurantMarkers.forEach(marker => marker.remove());
  this.restaurantMarkers = [];
},
    
  }
})
