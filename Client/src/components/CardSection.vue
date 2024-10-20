

<script setup lang="ts">
import { ref, computed } from 'vue';
import RestaurantCard from './RestaurantCard.vue';
import SortComponent from './SortComponent.vue';
import FilterComponent from './FilterComponent.vue';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface';

const restaurantStore = useRestaurantStore();
const props = defineProps<{
  restaurants: IRestaurant[];
}>();
const currentIndex = ref(0);

const filteredAndSortedRestaurants = computed(() => restaurantStore.filteredAndSortedRestaurants);

const visibleRestaurants = computed(() => {
  return filteredAndSortedRestaurants.value.slice(currentIndex.value, currentIndex.value + 3);
});

const scrollLeft = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const scrollRight = () => {
  if (currentIndex.value < filteredAndSortedRestaurants.value.length - 3) {
    currentIndex.value++;
  }
};
</script>

<template>
  <!-- Conteneur pour SortComponent et FilterComponent -->
  <div class="controls-container">
    <FilterComponent />
    <SortComponent />
  </div>

  <!-- Section des cartes avec scroll -->
  <div class="card-section">
    <button class="scroll-button left" @click="scrollLeft" :disabled="currentIndex === 0">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
        <path fill="currentColor"
          d="M20.834 8.037L9.64 14.5c-1.43.824-1.43 2.175 0 3l11.194 6.463c1.43.826 2.598.15 2.598-1.5V9.537c0-1.65-1.17-2.326-2.598-1.5"
        />
      </svg>
    </button>
    <div class="restaurant-cards">
      <RestaurantCard
        v-for="restaurant in visibleRestaurants"
        :key="restaurant._id"
        :restaurant="restaurant"
      />
    </div>
    <button class="scroll-button right" @click="scrollRight" :disabled="currentIndex >= filteredAndSortedRestaurants.length - 3">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
        <path fill="currentColor"
          d="M11.166 23.963L22.36 17.5c1.43-.824 1.43-2.175 0-3L11.165 8.037c-1.43-.826-2.598-.15-2.598 1.5v12.926c0 1.65 1.17 2.326 2.598 1.5z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.controls-container {
  position: absolute;
  top: 72%;
  right: 15%;
  z-index: 100;
  display: flex;
  gap: 10px;
}

.card-section {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  padding-top: 10px;
  padding-bottom: 30px;
}

.restaurant-cards {
  display: flex;
  gap: 10px;
  overflow: hidden;
  width: 100%;
  justify-content: center;
  max-width: 1100px;
  flex-wrap: nowrap;
}

.scroll-button {
  background-color: #00bcd4;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  z-index: 1;
}

.scroll-button.left {
  left: 30px;
}

.scroll-button.right {
  right: 40px;
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

@media (max-width: 768px) {
  .restaurant-cards {
    border-radius: 10px;
    width: 60%;
    max-width: 100%;
  }

  .restaurant-cards > * {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .scroll-button {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }

  .scroll-button.left {
    left: 80px;
  }

  .scroll-button.right {
    right: 80px;
  }

  .controls-container {
    top: 65%;
    right: 10px;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .restaurant-cards > * {
    flex: 0 0 100%;
  }

  .scroll-button {
    width: 25px;
    height: 25px;
    font-size: 14px;
  }

  .controls-container {
    top: 60%;
    right: 5px;
  }
}
</style>