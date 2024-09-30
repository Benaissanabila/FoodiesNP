 <script setup lang="ts">
  import { ref } from 'vue';
  import { useRestaurantStore } from '@/stores/RestaurantStore';
  
  const restaurantStore = useRestaurantStore();
  const selectedSort = ref(restaurantStore.sortBy);
  
  const onSortChange = () => {
    restaurantStore.setSortBy(selectedSort.value as 'rating' | 'distance');
  };
  </script><template>
    <div class="sort-component">
      <label for="sort-select">Trier par :</label>
      <select id="sort-select" v-model="selectedSort" @change="onSortChange">
        <option value="rating">Note</option>
        <option value="distance">Distance</option>
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