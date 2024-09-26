// Map.vue
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRestaurantStore } from '@/stores/RestaurantStore'; // Importation du store

const mapboxToken = "pk.eyJ1IjoicGF0cmlja2M1MTQiLCJhIjoiY2x3aTlibWh3MDRxZTJscGszYnJoODI2ZSJ9.7abA_VeG2IHewqyfW7iAqw";
const mapContainer = ref<HTMLElement | null>(null);
const map = ref<mapboxgl.Map | null>(null);
const restaurantStore = useRestaurantStore(); // Utilisation du store

// Coordonnées par défaut pour le viewport
const viewport = {
  longitude: -73.5673,
  latitude: 45.5017,
  zoom: 10,
};

// Fonction pour mettre à jour les marqueurs uniquement pour les restaurants filtrés
const updateMarkers = async () => {
  const currentMap = map.value as mapboxgl.Map | null; // Typage explicite ici
  if (currentMap) {
    try {
      // Utilisation des restaurants filtrés
      const filteredRestaurants = restaurantStore.getFilteredRestaurants;
      await restaurantStore.updateRestaurantMarkers(currentMap, filteredRestaurants); // Passer les restaurants filtrés
    } catch (error) {
      console.error("Error updating restaurant markers:", error);
    }
  }
};

// Initialisation de la carte au montage
onMounted(() => {
  if (mapContainer.value) {
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      accessToken: mapboxToken,
    });

    // Initialement, charger les marqueurs
    updateMarkers();
  }
});

// Surveiller les changements dans les restaurants filtrés pour mettre à jour les marqueurs
watch(
  () => restaurantStore.getFilteredRestaurants,
  () => {
    updateMarkers();
  }
);
</script>

<template>
  <div class="map-container">
    <!-- Conteneur de la carte -->
    <div ref="mapContainer" class="map"></div>
    <!-- Composant SearchBar avec la fonction de mise à jour des marqueurs -->
    <SearchBar :onSearch="updateMarkers" />
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
