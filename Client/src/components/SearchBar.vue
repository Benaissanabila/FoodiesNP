// SearchBar.vue
<script setup lang='ts'>
import { ref } from 'vue';
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
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    // Si le champ est vide, on supprime les marqueurs
    restaurantStore.updateSearchQuery(''); // Remettre la recherche à vide dans le store
    if (props.onSearch) {
      props.onSearch(); // Appeler la fonction pour supprimer les marqueurs
    }
    return;
  }

  // Mettre à jour la requête de recherche dans le store
  restaurantStore.updateSearchQuery(searchQuery.value);

  // Charger les restaurants après la mise à jour de la recherche
  await restaurantStore.loadRestaurants();

  // Une fois la recherche terminée, déclencher la mise à jour des marqueurs
  if (props.onSearch) {
    props.onSearch(); // Appeler la fonction pour mettre à jour les marqueurs dans la carte
  }
};
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
