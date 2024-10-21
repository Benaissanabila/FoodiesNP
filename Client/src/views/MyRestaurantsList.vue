<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const restaurantStore = useRestaurantStore();
const router = useRouter();

const { userRestaurants, loading, error } = storeToRefs(restaurantStore);

onMounted(async () => {
    console.log(userStore)
    console.log(restaurantStore)
  if (userStore.isAuthenticated) {
    await restaurantStore.loadUserRestaurants();
  } else {
    // Rediriger vers la page de connexion ou afficher un message d'erreur
    console.error('Utilisateur non connecté');
    // Par exemple : router.push('/login');
  }
});

const getImageUrl = (photoPath: string | null | File): string => {
  if (typeof photoPath === 'string') {
    return `http://localhost:3000/uploads/${photoPath}`;
  } else if (photoPath instanceof File) {
    return URL.createObjectURL(photoPath);
  }
  return '/default-restaurant-image.jpg';
};

const editRestaurant = (id: string) => {
  router.push(`/edit-restaurant/${id}`);
};

const deleteRestaurant = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
    try {
      await restaurantStore.deleteRestaurant(id);
      await restaurantStore.loadUserRestaurants(); // Recharger la liste après suppression
    } catch (error) {
      console.error('Erreur lors de la suppression du restaurant:', error);
    }
  }
};

const createNewRestaurant = () => {
  router.push('/create-restaurant');
};
</script>


<template>
  <div class="my-restaurants-list">
    <h1>Mes Restaurants</h1>
    <div v-if="loading" class="loading">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      <p>Chargement...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="userRestaurants.length === 0" class="empty-list">
      <p>Vous n'avez pas encore créé de restaurant.</p>
      <button @click="createNewRestaurant" class="edit-button">
        Créer un nouveau restaurant
      </button>
    </div>
    <ul v-else class="restaurant-grid">
      <li v-for="restaurant in userRestaurants" :key="restaurant._id" class="restaurant-card">
        <div class="restaurant-image-container">
          <img :src="getImageUrl(restaurant.RestoPhoto)" :alt="restaurant.name" class="restaurant-image">
          <div class="restaurant-overlay">
            <div class="restaurant-overlay-content">
              <h2>{{ restaurant.name }}</h2>
              <p>{{ restaurant.cuisineType }}</p>
            </div>
          </div>
        </div>
        <div class="restaurant-info">
          <h2 class="restaurant-name">{{ restaurant.name }}</h2>
          <p class="restaurant-cuisine">{{ restaurant.cuisineType }}</p>
          <div class="button-group">
            <button @click="editRestaurant(restaurant._id)" class="edit-button">
              Modifier
            </button>
            <button @click="deleteRestaurant(restaurant._id)" class="delete-button">
              Supprimer
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>


  
  <style scoped>
  .my-restaurants-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .my-restaurants-list h1 {
    font-size: 2.5rem;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .restaurant-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    list-style-type: none;
    padding: 0;
  }
  
  .restaurant-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
  }
  
  .restaurant-card:hover {
    transform: translateY(-5px);
  }
  
  .restaurant-image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  
  .restaurant-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .restaurant-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .restaurant-card:hover .restaurant-overlay {
    opacity: 1;
  }
  
  .restaurant-overlay-content {
    color: white;
    text-align: center;
  }
  
  .restaurant-info {
    padding: 15px;
  }
  
  .restaurant-name {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 5px;
  }
  
  .restaurant-cuisine {
    font-size: 1rem;
    color: #666;
    margin-bottom: 15px;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
  }
  
  .edit-button, .delete-button {
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .edit-button {
    background-color: #3498db;
    color: white;
  }
  
  .edit-button:hover {
    background-color: #2980b9;
  }
  
  .delete-button {
    background-color: #e74c3c;
    color: white;
  }
  
  .delete-button:hover {
    background-color: #c0392b;
  }
  
  .loading, .error, .empty-list {
    text-align: center;
    padding: 20px;
    font-size: 1.2rem;
    color: #666;
  }
  
  .error {
    color: #e74c3c;
  }
  
  @media (max-width: 768px) {
    .restaurant-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>