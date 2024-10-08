<script setup lang="ts">
import { ref } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import { useI18n } from 'vue-i18n'; // Importer i18n pour la traduction

const restaurantStore = useRestaurantStore();
const selectedSort = ref(restaurantStore.sortBy);

const { t } = useI18n(); // Utiliser la fonction de traduction

const onSortChange = () => {
  restaurantStore.setSortBy(selectedSort.value as 'rating' | 'distance');
};
</script>

<template>
  <div class="sort-component">
    <label for="sort-select">{{ t('sort.label') }} :</label> <!-- Utilisation de la traduction -->
    <select id="sort-select" v-model="selectedSort" @change="onSortChange">
      <option value="rating">{{ t('sort.rating') }}</option> <!-- Traduction pour 'Note' -->
      <option value="nom">{{ t('sort.nom') }}</option> <!-- Traduction pour 'Note' -->
      <option value="distance">{{ t('sort.distance') }}</option> <!-- Traduction pour 'Distance' -->
     
    </select>
  </div>
</template>

<style scoped>
.sort-component {
  margin-bottom: 20px;
}

select {
  margin-left: 10px;
  padding: 5px;
  border-radius: 5px;
}
</style>
