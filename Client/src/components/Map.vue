<script setup lang="ts">
import { ref, onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Récupérer la clé API Mapbox
const mapboxToken = "pk.eyJ1IjoicGF0cmlja2M1MTQiLCJhIjoiY2x3aTlibWh3MDRxZTJscGszYnJoODI2ZSJ9.7abA_VeG2IHewqyfW7iAqw";

// Initialisation des états pour la carte
const mapContainer = ref<HTMLElement | null>(null);
const map = ref<mapboxgl.Map | null>(null);

// Coordonnées par défaut pour le viewport
const viewport = {
  longitude: -73.5673, // Coordonnées pour Montréal
  latitude: 45.5017,
  zoom: 10,
};

onMounted(() => {
  if (mapContainer.value) {
    // Initialisation de la carte avec la clé API
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      accessToken: mapboxToken, // Utilisation de la clé API
    });
  }
});
</script>

<template>
  <div class="map-container">
    <!-- Conteneur de la carte -->
    <div ref="mapContainer" class="map"></div>
    <!-- Conteneur de la section des cartes -->
    <CardSection />
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  top: -118px;
  width: 100vw;
  height: 100vh; /* Prend toute la hauteur de l'écran */
}

.map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

</style>
