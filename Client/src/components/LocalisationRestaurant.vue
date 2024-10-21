<template>
  <div>
    <div class="map-container" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore'; // Ajustez le chemin selon vos fichiers
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface';

// Définition des propriétés du composant
const props = defineProps<{
  restaurantId: string; // Accepter l'ID du restaurant comme prop
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
const mapInstance = ref<mapboxgl.Map | null>(null);
const restaurantStore = useRestaurantStore();
const restaurant = ref<IRestaurant | null>(null);

// Utiliser le token Mapbox
const mapboxToken = 'pk.eyJ1IjoicGF0cmlja2M1MTQiLCJhIjoiY2x3aTlibWh3MDRxZTJscGszYnJoODI2ZSJ9.7abA_VeG2IHewqyfW7iAqw';
mapboxgl.accessToken = mapboxToken;

// Récupérer les données du restaurant lors du montage du composant
onMounted(async () => {
  await restaurantStore.fetchRestaurantById(props.restaurantId); // Récupérer les données du restaurant par ID
  restaurant.value = restaurantStore.restaurants.find(r => r._id === props.restaurantId) || null; // Récupérer les données du restaurant

  if (mapContainer.value && restaurant.value) {
    // Vérifiez que latitude et longitude sont définis
    const longitude = restaurant.value.longitude;
    const latitude = restaurant.value.latitude;

    if (longitude !== undefined && latitude !== undefined) {
      // Créez le tableau avec les coordonnées
      const center: [number, number] = [longitude, latitude]; // Type correct

      // N'initialisez la carte que si nous avons des coordonnées valides
      mapInstance.value = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center, 
        zoom: 10,
      });

      // Ajouter un marqueur pour l'emplacement du restaurant
      new mapboxgl.Marker()
        .setLngLat(center)
        .addTo(mapInstance.value);
    }
  }
});

// Cleanup the map instance when the component is unmounted
onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }
});
</script>

<style scoped>
.map-container {
  margin-top: 100px;
  width: 100%;
  height: 400px; /* Set the desired height for the map */
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
</style>
