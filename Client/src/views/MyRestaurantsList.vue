<template>
  <div class="owner-restaurants">
    <h2>Ma liste des Restaurants</h2>

    <!-- Afficher un message de chargement si les données sont en cours de récupération -->
    <div v-if="loading" class="loading">Chargement des restaurants...</div>

    <!-- Afficher un message d'erreur s'il y a un problème -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Afficher la liste des restaurants s'ils sont disponibles -->
    <div v-if="restaurants.length">
      <ul class="restaurant-list">
        <li v-for="restaurant in restaurants" :key="restaurant._id" class="restaurant-item">
          <img :src="getRestaurantPhotoUrl(restaurant)" alt="Photo du restaurant" class="restaurant-photo" />
          <div class="restaurant-info">
            <h3>{{ restaurant.name }}</h3>
            <p>{{ restaurant.address }}</p>
            <p>Type de cuisine : {{ restaurant.cuisineType }}</p>
            
          </div>
        </li>
      </ul>
    </div>

    <!-- Afficher un message si aucun restaurant n'est trouvé -->
    <div v-else-if="!loading && !error" class="no-restaurants">Aucun restaurant trouvé pour ce propriétaire.</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import { useUserStore } from '@/stores/UserStore';
import { useOwnerStore } from '@/stores/OwnerStore';
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface';

// Créer les stores nécessaires
const restaurantStore = useRestaurantStore();
const userStore = useUserStore();
const ownerStore = useOwnerStore();

// Récupérer les restaurants du propriétaire lors du montage du composant
onMounted(async () => {
  if (userStore.isAuthenticated) {
    // Appel à l'action pour récupérer les restaurants du owner lié à l'utilisateur connecté
    await restaurantStore.fetchRestaurantsByOwner();
  }
});

// Calculer les restaurants, le statut de chargement et les erreurs à partir du store
const restaurants = computed(() => restaurantStore.restaurants);
const loading = computed(() => restaurantStore.loading);
const error = computed(() => restaurantStore.error);

// Fonction pour récupérer l'URL de la photo du restaurant
const getRestaurantPhotoUrl = (restaurant:IRestaurant) => {
  const restoPhoto = restaurant.RestoPhoto;
  // Vérifier si RestoPhoto est une chaîne et commence par "http"
  if (typeof restoPhoto === 'string' && restoPhoto.startsWith('http')) {
    return restoPhoto; // URL complète, retourner directement
  } else if (typeof restoPhoto === 'string') {
    // Construire l'URL à partir du nom de fichier
    return `http://localhost:3000/uploads/${restoPhoto}`;
  } else {
    return '/placeholder-restaurant.png'; // Valeur par défaut
  }
};
</script>

<style scoped>
.owner-restaurants {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  color: #00bcd4;
  font-size: 2em;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  color: #777;
  font-size: 1.2em;
}

.error {
  color: red;
  text-align: center;
  font-size: 1.2em;
}

.no-restaurants {
  text-align: center;
  font-size: 1.2em;
  color: #777;
}

.restaurant-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
}

.restaurant-item {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.restaurant-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.restaurant-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.restaurant-info h3 {
  font-size: 1.5em;
  margin: 10px 0;
  color: #333;
}

.restaurant-info p {
  margin: 5px 0;
  color: #555;
  font-size: 1em;
}

@media (max-width: 768px) {
  .restaurant-item {
    width: 100%;
  }

  h2 {
    font-size: 1.5em;
  }
}
</style>
