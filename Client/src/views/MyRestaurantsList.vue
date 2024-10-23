
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useRestaurantStore } from '@/stores/RestaurantStore';
  import { useUserStore } from '@/stores/UserStore';
  import { useOwnerStore } from '@/stores/OwnerStore';
  import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface';
  import Logo from '@/components/Logo.vue';
import ProfileButton from '@/components/ProfileButton.vue';
import SettingButton from '@/components/SettingButton.vue';
  
  const router = useRouter();
  const restaurantStore = useRestaurantStore();
  const userStore = useUserStore();
 
  
  onMounted(async () => {
    if (userStore.isAuthenticated) {
      await restaurantStore.fetchRestaurantsByOwner();
    }
  });
  
  const restaurants = computed(() => restaurantStore.restaurants);
  const loading = computed(() => restaurantStore.loading);
  const error = computed(() => restaurantStore.error);
  
  const getRestaurantPhotoUrl = (restaurant: IRestaurant) => {
    const restoPhoto = restaurant.RestoPhoto;
    if (typeof restoPhoto === 'string' && restoPhoto.startsWith('http')) {
      return restoPhoto;
    } else if (typeof restoPhoto === 'string') {
      return `http://localhost:3000/uploads/${restoPhoto}`;
    }
    return '/placeholder-restaurant.png';
  };
  
  const navigateToEdit = (restaurantId: string) => {
  router.push(`/edit-restaurant/edit/${restaurantId}`);
};
  
  const confirmDelete = async (restaurantId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
      try {
        await restaurantStore.deleteRestaurant(restaurantId);
        // Rafraîchir la liste après la suppression
        await restaurantStore.fetchRestaurantsByOwner();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };
  </script>
  <template>
    <div>
    <div class="header">
      <Logo />
      <div class="header-buttons">
        <SettingButton />
        <ProfileButton />
      </div>
    </div>
    <div class="owner-restaurants">
      <h2>Ma liste des Restaurants</h2>
  
      <div v-if="loading" class="loading">Chargement des restaurants...</div>
      <div v-if="error" class="error">{{ error }}</div>
  
      <div v-if="restaurants.length" class="restaurants-container">
        <div class="restaurant-list">
          <div v-for="restaurant in restaurants" :key="restaurant._id" class="restaurant-item">
            <div class="restaurant-content">
              <img :src="getRestaurantPhotoUrl(restaurant)" alt="Photo du restaurant" class="restaurant-photo" />
              <div class="restaurant-info">
                <h3>{{ restaurant.name }}</h3>
                <p><strong>Adresse :</strong> {{ restaurant.address }}</p>
                <p><strong>Type de cuisine :</strong> {{ restaurant.cuisineType }}</p>
                <p v-if="restaurant.priceFork"><strong>Fourchette de prix :</strong> {{ restaurant.priceFork }}</p>
              </div>
              <div class="restaurant-actions">
                <button 
                  @click="navigateToEdit(restaurant._id)" 
                  class="btn-edit"
                >
                  Modifier
                </button>
                <button 
                  @click="confirmDelete(restaurant._id)" 
                  class="btn-delete"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  
      <div v-else-if="!loading && !error" class="no-restaurants">
        Aucun restaurant trouvé pour ce propriétaire.
      </div>
    </div>
</div>
  </template>
  <style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-buttons {
  display: flex;
  gap: 20px;
  align-items: center;
}

  .owner-restaurants {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h2 {
    text-align: center;
    color: #00bcd4;
    font-size: 2em;
    margin-bottom: 30px;
  }
  
  .restaurants-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .restaurant-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .restaurant-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .restaurant-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .restaurant-content {
    display: grid;
    grid-template-columns: 200px 1fr auto;
    gap: 20px;
    padding: 15px;
    align-items: center;
  }
  
  .restaurant-photo {
    width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .restaurant-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .restaurant-info h3 {
    margin: 0;
    color: #333;
    font-size: 1.4em;
  }
  
  .restaurant-info p {
    margin: 0;
    color: #666;
  }
  
  .restaurant-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 15px;
  }
  
  .btn-edit, .btn-delete {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .btn-edit {
    background-color: #00bcd4;
    color: white;
  }
  
  .btn-edit:hover {
    background-color: #77d2de;
  }
  
  .btn-delete {
    background-color: #f44336;
    color: white;
  }
  
  .btn-delete:hover {
    background-color: #da190b;
  }
  
  .loading, .error, .no-restaurants {
    text-align: center;
    padding: 20px;
    font-size: 1.2em;
  }
  
  .error {
    color: #f44336;
  }
  
  @media (max-width: 768px) {
    .restaurant-content {
      grid-template-columns: 1fr;
    }
  
    .restaurant-photo {
      width: 100%;
      height: 200px;
    }
  
    .restaurant-actions {
      flex-direction: row;
      justify-content: center;
      padding: 15px;
    }
  }
  </style>