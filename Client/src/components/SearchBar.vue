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
  <div class="search-bar">
    <div class="input-container">
      <img 
        src="@/assets/image/search.svg" 
        alt="Search"
        class="search-icon"
        @click="performSearch"
      />
      <input 
        type="text" 
        v-model="searchQuery" 
        @keyup.enter="performSearch"  
        :placeholder="t('searchPlaceholder')" 
      />
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
}

.input-container {
  display: flex;
  align-items: center; /* Aligne verticalement l'icône et l'input */
  position: relative; /* Pour le positionnement de l'icône */
}

.input-container input {
  padding: 10px 50px 10px 10px; /* Padding pour laisser de l'espace pour l'icône */
  border: 1px solid #ccc;
  border-radius: 20px;
  width: 100%; /* Ajuste selon vos besoins */
  height: auto;
}

.search-icon {
  position: absolute; /* Positionnement absolu */
  right: 10px; /* Ajustez selon vos besoins */
  width: 30px; /* Ajustez la taille selon vos besoins */
  height: 30px; /* Ajustez la taille selon vos besoins */
  cursor: pointer; /* Changer le curseur pour indiquer que c'est cliquable */
}
</style>
