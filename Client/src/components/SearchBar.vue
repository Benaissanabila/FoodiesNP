<!-- SearchBar.vue -->
<script setup lang='ts'>
import { ref, watch } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore'; // Utilisation du store
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const restaurantStore = useRestaurantStore(); // Utilisation du store

// Liaison des valeurs du store aux variables locales
const searchQuery = ref(''); // Valeur réactive pour le champ de recherche

// Prop reçue pour déclencher la mise à jour des marqueurs
const props = defineProps({
  onSearch: Function // Fonction de mise à jour des marqueurs
});

// Actions du store
const performSearch = () => {
  if (!searchQuery.value.trim()) {
    return;
  }

  // Mettre à jour la requête de recherche dans le store et filtrer les restaurants
  restaurantStore.updateSearchQuery(searchQuery.value);
  
  // Une fois la recherche terminée, déclencher la mise à jour des marqueurs
  if (props.onSearch) {
    props.onSearch(); // Appeler la fonction pour mettre à jour les marqueurs dans la carte
  }
};

// Surveiller le changement des restaurants filtrés
watch(() => restaurantStore.getFilteredRestaurants, () => {
  if (props.onSearch) {
    props.onSearch(); // Appeler la fonction pour mettre à jour les marqueurs à chaque changement
  }
});
</script>

<template>
  <div>
    <!-- Barre de recherche pour entrer le nom ou le type de cuisine -->
    <input 
      type="text" 
      v-model="searchQuery" 
      @keyup.enter="performSearch"  
      :placeholder="t('searchPlaceholder')" 
    />
    <button @click="performSearch">{{ t('search') }}</button>
  </div>
</template>

<style scoped>
/* Ajoute des styles ici si nécessaire */
</style>
