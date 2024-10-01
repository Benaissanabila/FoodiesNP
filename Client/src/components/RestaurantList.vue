<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import imageSrc from '@/assets/RestoImg.jpg'; // Assurez-vous que ce chemin est correct
import CardSection from './CardSection.vue';
import { useI18n } from 'vue-i18n'
import SortComponent from './SortComponent.vue';
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface';
import { RouterLink } from 'vue-router';

const { t} = useI18n()
const store = useRestaurantStore();
const showRestaurants = ref(false); // État pour gérer l'affichage de la liste

onMounted(() => {
  store.loadRestaurants(); // Chargez tous les restaurants au montage
  // Obtenir la position de l'utilisateur
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        store.setUserLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Erreur lors de l'obtention de la localisation : ", error);
      }
    );
  }
});

const viewCompleteList = () => {
  showRestaurants.value = true;
};

const closeRestaurants = () => {
  showRestaurants.value = false;
};
const sortedRestaurants = computed(() => store.sortedRestaurants);

const getDistance = (restaurant: IRestaurant) => {
  const distance = store.calculateDistanceToRestaurant(restaurant);
  return distance === Infinity ? 'N/A' : distance.toFixed(2);
};
</script>

<template>
  <div class="top-restaurants">
    <div class="left-section">
      <h2>{{ t('discoverTop100') }}</h2>
      <button @click="viewCompleteList">{{ t('viewCompleteList') }} ></button>
    </div>
    <div class="right-section">
      <img :src="imageSrc" :alt="t('topRestaurantsImage')" class="top-image" />
    </div>
  </div>
  <!-- Nouvelle div pour afficher la liste des restaurants -->
  <div class="restaurants-list" v-if="showRestaurants">
    <div class="close-button" @click="closeRestaurants">✖</div> <!-- Bouton pour fermer la liste -->
    <h3>{{ t('restaurantsList') }}</h3>
    <SortComponent />
    <div v-if="store.loading">{{ t('loadingRestaurants') }}</div>
    <div v-if="store.error">{{ store.error }}</div>
    <div v-for="restaurant in store.sortedRestaurants" :key="restaurant._id" class="restaurant-card">
      <RouterLink :to="{ name: 'restaurantdetails', params: { id: restaurant._id } }"><img :src="restaurant.RestoPhoto" :alt="t('restaurantPhoto')" class="restaurant-image" />
      </RouterLink><div class="restaurant-details">
        <h3>{{ restaurant.name }}</h3>
        <p>{{ restaurant.address }}</p>
        <p>{{ t('cuisineType') }}: {{ restaurant.cuisineType }}</p>
        <p>
      Distance: {{ getDistance(restaurant) }} km
    </p>
        <div class="rating">
          <div class="stars">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ filled: star <= restaurant.globalRatingResaurant }"
            >
              ★
            </span>
          </div>
          <p v-if="!store.loading && !store.error">
            {{ t('globalRating') }}: {{ restaurant.globalRatingResaurant.toFixed(1) }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <CardSection :restaurants="store.sortedRestaurants" />
</template>

<style scoped>
.top-restaurants {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #00bcd4; /* Couleur de fond */
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
button {
  border: none; /* Enlève la bordure */
  background-color: transparent; /* Vous pouvez également changer la couleur de fond */
  color: #ffffff; /* Changez la couleur du texte selon votre design */
  cursor: pointer; /* Change le curseur au survol */
  
}

.left-section {
  flex: 1;
}
.left-section .button {
  border-radius: none;
}

.right-section {
  flex: 1;
  display: flex;
  justify-content: flex-end; /* Aligne l'image à droite */
}

.top-image {
  width: 100%; /* Ajustez la largeur selon vos besoins */
  max-width: 200px; /* Limite la largeur maximale de l'image */
  border-radius: 8px; /* Arrondir les coins de l'image */
}

.restaurants-list {
  padding: 20px;
  background-color: rgb(150, 150, 150); /* Couleur de fond de la liste des restaurants */
  border-radius: 8px; /* Arrondir les coins */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 20px; /* Marge au-dessus de la liste */
}

.restaurant-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  width: 200px; /* Ajustez selon vos besoins */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.restaurant-image {
  width: 100%;
  border-radius: 8px;
}

.restaurant-details {
  margin-top: 10px;
}

h3 {
  font-size: 16px;
  margin: 0;
}

p {
  font-size: 12px;
  color: #000000;
}

.stars {
  display: flex; /* Aligne les étoiles en ligne */
}

.star {
  font-size: 20px; /* Taille des étoiles */
  color: #ccc; /* Couleur par défaut des étoiles */
}

.star.filled {
  color: gold; /* Couleur des étoiles remplies */
}

.close-button {
  cursor: pointer;
  font-size: 24px;
  text-align: right;
  margin-bottom: 10px; /* Marge en bas pour espacer le bouton du contenu */
}
</style>


