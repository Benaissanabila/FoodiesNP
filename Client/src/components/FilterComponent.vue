
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRestaurantStore } from '@/stores/RestaurantStore';
  import { useI18n } from 'vue-i18n';
  
  const restaurantStore = useRestaurantStore();
  const { t } = useI18n();
  
  const isFilterMenuOpen = ref(false);
  const isCategoryMenuOpen = ref(false);
  const isRatingMenuOpen = ref(false);
  const categories = ref<string[]>([]);
  const selectedCategory = ref('');
  const selectedRating = ref(0);
  
  onMounted(async () => {
    await restaurantStore.loadRestaurants();
    categories.value = [...new Set(
      restaurantStore.getAllRestaurants
        .map(r => r.cuisineType)
        .filter((type): type is string => type !== undefined)
    )];
  });
  
  const toggleFilterMenu = () => {
    isFilterMenuOpen.value = !isFilterMenuOpen.value;
  };
  
  const toggleCategoryMenu = () => {
    isCategoryMenuOpen.value = !isCategoryMenuOpen.value;
  };
  
  const toggleRatingMenu = () => {
    isRatingMenuOpen.value = !isRatingMenuOpen.value;
  };
  
  const applyFilters = () => {
    restaurantStore.setFilters({
      category: selectedCategory.value,
      minRating: selectedRating.value
    });
  };
  </script>
  
  <template>
    <div class="filter-component">
      <button @click="toggleFilterMenu" class="filter-button">
        {{ t('filter.title') }}
        <span :class="['arrow', { 'up': isFilterMenuOpen }]">▼</span>
      </button>
      <div v-if="isFilterMenuOpen" class="filter-menu">
        <div class="filter-section">
          <button @click="toggleCategoryMenu" class="sub-filter-button">
            {{ t('filter.category') }}
            <span :class="['arrow', { 'up': isCategoryMenuOpen }]">▼</span>
          </button>
          <div v-if="isCategoryMenuOpen" class="sub-menu">
            <label v-for="category in categories" :key="category">
              <input type="radio" v-model="selectedCategory" :value="category" @change="applyFilters">
              {{ category }}
            </label>
          </div>
        </div>
        <div class="filter-section">
          <button @click="toggleRatingMenu" class="sub-filter-button">
            {{ t('filter.rating') }}
            <span :class="['arrow', { 'up': isRatingMenuOpen }]">▼</span>
          </button>
          <div v-if="isRatingMenuOpen" class="sub-menu">
            <label v-for="rating in [0, 2, 3, 4]" :key="rating">
              <input type="radio" v-model="selectedRating" :value="rating" @change="applyFilters">
              {{ rating === 0 ? t('filter.anyRating') : `${rating} ${t('filter.starsMinimum')}` }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </template>
  <style scoped>
  .filter-component {
    position: relative;
    display: inline-block;
  }
  
  .filter-button, .sub-filter-button {
    background-color: #00bcd4;
    color: white;
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  
  .filter-menu {
    position: absolute;
    background-color: white;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    border-radius: 5px;
    overflow: hidden;
    padding: 10px;
  }
  
  .filter-section {
    margin: 10px 0;
  }
  
  .sub-menu {
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
    margin-top: 5px;
  }
  
  .sub-menu label {
    display: block;
    margin: 5px 0;
  }
  
  .arrow {
    display: inline-block;
    transition: transform 0.3s;
    margin-left: 10px;
  }
  
  .arrow.up {
    transform: rotate(180deg);
  }
  </style>