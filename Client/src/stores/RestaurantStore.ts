import { defineStore } from 'pinia';
import axios from 'axios';
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface';
import type { IComment } from '@/shared/interfaces/CommentInterface';
import mapboxgl from 'mapbox-gl';
import { useUserStore } from '@/stores/UserStore';
import { useOwnerStore } from '@/stores/OwnerStore';
axios.defaults.withCredentials = true;

// Fonctions utilitaires en dehors du store
function calculateDistance(userLocation: { latitude: number; longitude: number }, restaurant: IRestaurant): number {
  if (!restaurant.latitude || !restaurant.longitude) return Infinity;

  const R = 6371; // Rayon de la Terre en km
  const dLat = deg2rad(restaurant.latitude - userLocation.latitude);
  const dLon = deg2rad(restaurant.longitude - userLocation.longitude);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(userLocation.latitude)) * Math.cos(deg2rad(restaurant.latitude)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance en km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}


export const useRestaurantStore = defineStore('Restaurant', {
  state: () => ({
    searchQuery: '',
    restaurants: [] as IRestaurant[],
    restaurantMarkers: [] as any[],
    comments: [] as IComment[],
    loading: false,
    error: null as string | null,
    userRestaurants: [] as IRestaurant[],
    userLocation: null as { latitude: number; longitude: number } | null,
    sortBy: 'rating' as string,
    owner: null as string | null,
    filters: {
      category: '',
      minRating: 0,
      priceFork: '',
    }
  }),

  getters: {
    // Getter pour récupérer tous les restaurants
    getAllRestaurants(state) {
      return state.restaurants;
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
    sortedRestaurants: (state) => {
      let sorted = [...state.restaurants];
      if (state.sortBy === 'rating') {
        sorted.sort((a, b) => b.globalRatingResaurant - a.globalRatingResaurant);
      }if(state.sortBy === 'name'){
        sorted.sort((a, b) => a.name.localeCompare(b.name))
      }
        else if (state.sortBy === 'distance' && state.userLocation) {
        sorted.sort((a, b) => {
          const distanceA = calculateDistance(state.userLocation!, a);
          const distanceB = calculateDistance(state.userLocation!, b);
          return distanceA - distanceB;
        });
      }
      return sorted;
    },
    filteredAndSortedRestaurants(state) {
      let filtered = state.restaurants.filter(restaurant => {
        const categoryMatch = !state.filters.category || restaurant.cuisineType === state.filters.category;
        const ratingMatch = restaurant.globalRatingResaurant >= state.filters.minRating;
        const priceMatch = !state.filters.priceFork || restaurant.priceFork === state.filters.priceFork;
        return categoryMatch && ratingMatch && priceMatch;
      });

      if (state.sortBy === 'rating') {
        filtered.sort((a, b) => b.globalRatingResaurant - a.globalRatingResaurant);
      } else if (state.sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (state.sortBy === 'distance' && state.userLocation) {
        filtered.sort((a, b) => {
          const distanceA = calculateDistance(state.userLocation!, a);
          const distanceB = calculateDistance(state.userLocation!, b);
          return distanceA - distanceB;
        });
      }

      return filtered;
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
      console.log('Fetching restaurant with ID:', id); // Ajoutez un log
      try {
        const response = await axios.get(`http://localhost:3000/restaurants/${id}`);
        console.log('Restaurant data:', response.data); // Ajoutez un log
        const restaurant = response.data;
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
   
  updateRestaurantMarkers(map: mapboxgl.Map, restaurants: IRestaurant[]) {
    this.clearMarkers(map);
  
    restaurants.forEach((restaurant) => {
      if (restaurant.latitude && restaurant.longitude) {
        // Création du contenu HTML du popup
        const popupContent = `
         <div class="popup-content">
    <h3>${restaurant.name}</h3>
    <img 
        src="${restaurant.RestoPhoto}" 
        alt="Photo du restaurant" 
        class="restaurant-image" 
        onclick="location.href='/restaurantdetails/${restaurant._id}'" 
        style="cursor: pointer; max-width: 100px; height:100px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);" 
    />
</div>
        `;
  
        // Création du marqueur et ajout du popup
        const marker = new mapboxgl.Marker()
          .setLngLat([restaurant.longitude, restaurant.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
          .addTo(map);
  
        // Ajout du marqueur au tableau pour une gestion future
        this.restaurantMarkers.push(marker);
      }
    });
  },
  


  // Fonction pour supprimer tous les marqueurs de la carte
  clearMarkers(map: mapboxgl.Map) {
    this. restaurantMarkers.forEach((marker) => marker.remove()) // Supprimer chaque marqueur
    this. restaurantMarkers = [] // Réinitialiser le tableau des marqueurs
  },
  setUserLocation(latitude: number, longitude: number) {
    this.userLocation = { latitude, longitude };
  },

  setSortBy(sortType: 'rating' | 'distance') {
    this.sortBy = sortType;
  },
  calculateDistanceToRestaurant(restaurant: IRestaurant): number {
    if (this.userLocation) {
      return calculateDistance(this.userLocation, restaurant);
    }
    return Infinity;
  },
 
  async createRestaurant(formData: any) {
    try {
      const response = await axios.post('http://localhost:3000/restaurants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const newRestaurant = response.data;
      this.restaurants.push(newRestaurant);
      return newRestaurant;
    } catch (error) {
      console.error('Erreur lors de la création du restaurant:', error);
      throw error;
    }
  },


  setFilters(filters: { category: string; minRating: number; priceFork: string }) {
    this.filters = filters;
  },


  async loadUserRestaurants() {
    const userStore = useUserStore();
    if (!userStore.user || !userStore.user._id) {
      console.error('Utilisateur non connecté ou ID non disponible');
      this.error = 'Utilisateur non connecté';
      return;
    }

    this.loading = true;
    this.error = null;
    try {
      const response = await axios.get<IRestaurant[]>(`http://localhost:3000/restaurants/owner/${userStore.user._id}`);
      this.userRestaurants = response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erreur Axios lors de la récupération des restaurants de l\'utilisateur:', error.response?.data || error.message);
        this.error = error.response?.data?.message || error.message || 'Erreur lors de la récupération des restaurants';
      } else {
        console.error('Erreur inconnue lors de la récupération des restaurants de l\'utilisateur:', error);
        this.error = 'Une erreur inattendue s\'est produite';
      }
    } finally {
      this.loading = false;
    }
  },
  async deleteRestaurant(id: string) {
    this.loading = true;
    this.error = null;
    try {
      await axios.delete(`http://localhost:3000/restaurants/${id}`);
      this.restaurants = this.restaurants.filter(restaurant => restaurant._id !== id);
      this.userRestaurants = this.userRestaurants.filter(restaurant => restaurant._id !== id);
    } catch (error) {
      console.error('Erreur lors de la suppression du restaurant:', error);
      this.error = 'Erreur lors de la suppression du restaurant';
    } finally {
      this.loading = false;
    }
  },

  // Vous pouvez ajouter une méthode pour la mise à jour si nécessaire
  async updateRestaurant(id: string, updatedData: Partial<IRestaurant>) {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.put(`http://localhost:3000/restaurants/${id}`, updatedData);
      const updatedRestaurant = response.data;
      const index = this.restaurants.findIndex(r => r._id === id);
      if (index !== -1) {
        this.restaurants[index] = updatedRestaurant;
      }
      const userIndex = this.userRestaurants.findIndex(r => r._id === id);
      if (userIndex !== -1) {
        this.userRestaurants[userIndex] = updatedRestaurant;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du restaurant:', error);
      this.error = 'Erreur lors de la mise à jour du restaurant';
    } finally {
      this.loading = false;
    }
  },
  // Action pour récupérer les restaurants d'un owner
  async fetchRestaurantsByOwner() {
    this.loading = true;
    this.error = null;

    try {
      const userStore = useUserStore(); // Utiliser UserStore pour récupérer l'utilisateur connecté
      const ownerStore = useOwnerStore(); // Utiliser OwnerStore pour récupérer l'owner lié à l'utilisateur

      // Vérifie si l'utilisateur est connecté et si son _id est défini
      const userId = userStore.user?._id;

      if (!userId) {
        this.error = 'ID utilisateur manquant';
        return; // Sortir de la fonction si l'ID est manquant
      }

      // Récupérer le owner associé à l'utilisateur
      await ownerStore.fetchOwnerByUser(userId); // Utiliser l'ID avec la vérification

      // Si un owner est trouvé, récupérer les restaurants associés à cet owner
      if (ownerStore.owner) {
        const ownerId = ownerStore.owner._id;
        console.log("ownerid",ownerId)
        const response = await axios.get<IRestaurant[]>(`http://localhost:3000/restaurants/owner/${ownerId}`);
        this.restaurants = response.data;
      } else {
        this.error = 'Aucun propriétaire trouvé pour cet utilisateur';
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
      this.error = 'Erreur lors de la récupération des restaurants';
    } finally {
      this.loading = false;
    }
  },
},



   
});
