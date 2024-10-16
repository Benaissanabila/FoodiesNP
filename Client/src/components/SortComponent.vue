<script setup lang="ts">
import { ref } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import { useI18n } from 'vue-i18n';

const restaurantStore = useRestaurantStore();
const { t } = useI18n();

const selectedSort = ref(restaurantStore.sortBy);
const isSortMenuOpen = ref(false);

const sortOptions = [
  { value: 'rating', label: 'sort.rating' },
  { value: 'name', label: 'sort.name' },
  { value: 'distance', label: 'sort.distance' }
];

const toggleSortMenu = () => {
  isSortMenuOpen.value = !isSortMenuOpen.value;
};

const onSortChange = () => {
  restaurantStore.setSortBy(selectedSort.value as 'rating' |'distance');
  isSortMenuOpen.value = false;
};
</script>

<template>
  <div class="sort-component">
    <button @click="toggleSortMenu" class="sort-button">
      {{ t('sort.label') }}
      <span :class="['arrow', { 'up': isSortMenuOpen }]">▼</span>
    </button>
    <div v-if="isSortMenuOpen" class="sort-menu">
      <label v-for="option in sortOptions" :key="option.value">
        <input type="radio" v-model="selectedSort" :value="option.value" @change="onSortChange">
        {{ t(option.label) }}
      </label>
    </div>
  </div>
</template>

<style scoped>
.sort-component {
  position: relative;
  display: inline-block;
}

.sort-button {
  background-color: #00bcd4;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.sort-menu {
  position: absolute;
  bottom: 100%; /* Change this from top to bottom */
  left: 0;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px -8px 16px 0px rgba(0,0,0,0.2); /* Adjust shadow for upward opening */
  z-index: 1;
  border-radius: 5px;
  overflow: hidden;
  padding: 10px;
  margin-bottom: 5px; /* Add some space between button and menu */
}

.sort-menu label {
  display: block;
  margin: 5px 0;
}

.arrow {
  display: inline-block;
  transition: transform 0.3s;
}

.arrow.up {
  transform: rotate(180deg);
}
</style>