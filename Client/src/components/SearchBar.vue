<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore'; // Utilisation du store mis à jour
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface'; // Importation de l'interface IRestaurant
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// Initialisation du store
const restaurantStore = useRestaurantStore();

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
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        @keyup.enter="performSearch"  
        :placeholder="t('searchPlaceholder')" 
      />
      <!-- Icone loupe cliquable pour lancer la recherche -->
      <img 
        src="@/assets/image/search.svg" 
        alt="Search" 
        class="search-icon" 
        @click="performSearch" 
      />
    </div>

    <!-- Affichage des résultats de recherche uniquement après une recherche -->
    <div v-if="filteredRestaurants.length && !loading && showResults">
      <h3>{{ t('searchResults') }}:</h3>
      <ul>
        <li v-for="(restaurant, index) in filteredRestaurants" :key="restaurant._id">
          <img :src="restaurant.RestoPhoto" :alt="t('restaurantPhoto')" width="100" height="60" />
          <strong>{{ restaurant.name }}</strong> - {{ restaurant.cuisineType || t('cuisineTypeNotAvailable') }} <br/>
          {{ restaurant.address }} <br/>
          {{ restaurant.schedule }} <br/>
          {{ restaurant.phoneNumber || t('phoneNumberNotAvailable') }} <br/><br/>
        </li>
      </ul>
    </div>

    <!-- Message si aucun résultat trouvé -->
    <div v-else-if="!loading && showResults">
      <p>{{ t('noResultsFound') }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Style de la barre de recherche */
.search-container {
  position: relative;
  width: 100%;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  box-sizing: border-box;
  padding-right: 40px; /* Ajout d'espace pour l'icône */
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-68%);
  width: 32px;
  cursor: pointer;
}

/* Conteneur pour les résultats */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
}

li img {
  margin-right: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

li strong {
  font-size: 18px;
  color: #333;
}

h3 {
  margin-bottom: 15px;
  font-size: 24px;
  color: #333;
}

p {
  font-size: 16px;
  color: #666;
}

/* Pour mobile */
@media (max-width: 768px) {
  li {
    flex-direction: column;
    text-align: center;
  }

  li img {
    margin: 0 0 10px 0;
  }

  h3 {
    text-align: center;
  }
}
</style>
