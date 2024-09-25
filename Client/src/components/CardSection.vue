<script setup lang="ts">
import { ref, computed } from 'vue'
import RestaurantCard from './RestaurantCard.vue' // Importation du composant RestaurantCard
import type { IRestaurant } from '../shared/interfaces/RestaurantInterface.ts'

const props = defineProps<{
  restaurants: IRestaurant[]
}>()

const currentIndex = ref(0) // Index actuel pour le carrousel

// Calculer les restaurants visibles en fonction de l'index actuel
const visibleRestaurants = computed(() => {
  return props.restaurants.slice(currentIndex.value, currentIndex.value + 3)
})

// Fonction pour faire défiler à gauche
const scrollLeft = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// Fonction pour faire défiler à droite
const scrollRight = () => {
  if (currentIndex.value < props.restaurants.length - 3) {
    currentIndex.value++
  }
}
</script>

<template>
  <div class="card-section">
    <button class="scroll-button left" @click="scrollLeft" :disabled="currentIndex === 0">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
        <path
          fill="currentColor"
          d="M20.834 8.037L9.64 14.5c-1.43.824-1.43 2.175 0 3l11.194 6.463c1.43.826 2.598.15 2.598-1.5V9.537c0-1.65-1.17-2.326-2.598-1.5"
        />
      </svg>
    </button>
    <div class="restaurant-cards">
      <RestaurantCard
        v-for="(restaurant, index) in visibleRestaurants"
        :key="restaurant._id"
        :restaurant="restaurant"
      />
    </div>
    <button
      class="scroll-button right"
      @click="scrollRight"
      :disabled="currentIndex >= restaurants.length - 3"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
        <path
          fill="currentColor"
          d="M11.166 23.963L22.36 17.5c1.43-.824 1.43-2.175 0-3L11.165 8.037c-1.43-.826-2.598-.15-2.598 1.5v12.926c0 1.65 1.17 2.326 2.598 1.5z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.card-section {
  display: flex;
  justify-content: center; /* Centre la section horizontalement */
  align-items: center;
  width: 100%;
  margin: 0 auto; /* Centre la section avec une marge automatique */
  position: relative; /* Nécessaire pour positionner les flèches correctement */
  padding: 0 10px; /* Réduit le remplissage à gauche et à droite */
}

.restaurant-cards {
  display: flex;
  gap: 10px; /* Espace entre les cartes */
  overflow: hidden; /* Masque les cartes qui débordent */
  width: 100%; /* Prend toute la largeur disponible */
  justify-content: center;
  max-width: 1200px; /* Limite la largeur pour ne pas que tout s'étire trop sur des grands écrans */
}

.scroll-button {
  background-color: #00bcd4;
  border: none;
  border-radius: 50%; /* Rend le bouton circulaire */
  width: 40px; /* Réduit la taille des boutons */
  height: 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: absolute; /* Permet de positionner les flèches à gauche et à droite */
  top: 50%; /* Centre verticalement par rapport aux cartes */
  transform: translateY(-50%); /* Ajustement pour un parfait centrage vertical */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px; /* Ajuste la taille de la flèche */
  z-index: 1; /* Assurez-vous que les flèches sont au-dessus des cartes */
}

.scroll-button.left {
  left: 10px; /* Positionne la flèche à gauche */
}

.scroll-button.right {
  right: 10px; /* Positionne la flèche à droite */
}

.scroll-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.scroll-button:hover {
  background-color: #77d2de;
}

svg {
  color: white;
}


</style>
