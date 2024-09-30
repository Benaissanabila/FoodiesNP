<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useRestaurantStore } from '@/stores/RestaurantStore' // Importation du store
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface'

const mapboxToken = 'pk.eyJ1IjoicGF0cmlja2M1MTQiLCJhIjoiY2x3aTlibWh3MDRxZTJscGszYnJoODI2ZSJ9.7abA_VeG2IHewqyfW7iAqw'
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<mapboxgl.Map>()
const restaurantStore = useRestaurantStore() // Utilisation du store
const userLocationMarker = ref<mapboxgl.Marker | null>(null) // Stockage du marqueur de l'utilisateur

// Coordonnées de la carte par défaut (vue de la planète)
const viewport = {
  longitude: 0, // Coordonnées globales
  latitude: 0,
  zoom: 1 // Vue de la planète
}

// Fonction pour obtenir la position de l'utilisateur
const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        // Centrer la carte sur la position de l'utilisateur
        if (map.value) {
          map.value.setCenter([longitude, latitude])
          map.value.setZoom(14) // Zoom sur l'emplacement de l'utilisateur
        }

        // Création d'un élément HTML pour le marqueur
        const el = document.createElement('div')
        el.className = 'user-location-marker' // Application de la classe CSS personnalisée

        el.style.width = '18px'
        el.style.height = '18px'
        el.style.backgroundColor = 'rgb(16, 87, 241)'
        el.style.borderRadius = '50%'
        el.style.border = '3px solid white'
        el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'

        // Création ou mise à jour du marqueur de l'utilisateur
        if (userLocationMarker.value) {
          userLocationMarker.value.setLngLat([longitude, latitude])
          console.log('Position utilisateur:', position.coords)
        } else {
          userLocationMarker.value = new mapboxgl.Marker(el) // Utilisation de l'élément HTML comme marqueur
            .setLngLat([longitude, latitude])
            .addTo(map.value!)
          console.log('Création du marqueur à la position:', latitude, longitude)
        }
      },
      (error) => {
        console.error("Erreur lors de l'obtention de la localisation : ", error)
      }
    )
  } else {
    console.error("La géolocalisation n'est pas supportée par ce navigateur.")
  }
}

// Fonction pour ajuster la carte pour englober tous les restaurants filtrés
const fitMapToMarkers = (restaurants: IRestaurant[]) => {
  if (restaurants.length === 0 || !map.value) return;

  const bounds = new mapboxgl.LngLatBounds();
  restaurants.forEach((restaurant) => {
    if (restaurant.longitude != null && restaurant.latitude != null) { // Vérifie si les valeurs ne sont pas null ou undefined
      bounds.extend([restaurant.longitude, restaurant.latitude]);
    }
  });

  if (!bounds.isEmpty()) {
    map.value.fitBounds(bounds, {
      padding: 50,
      maxZoom: 14,
    });
  }
};

// Fonction pour récupérer et afficher les restaurants avec leurs emplacements
const getRestaurantLocation = async () => {
  await restaurantStore.loadRestaurants(); // Charger les restaurants via le store
  
  const restaurants = restaurantStore.getAllRestaurants; // Récupérer tous les restaurants
  const mapInstance = map.value as mapboxgl.Map;
  
  if (mapInstance && restaurants) {
    await restaurantStore.updateRestaurantMarkers(mapInstance, restaurants); // Mettre à jour les marqueurs des restaurants
    fitMapToMarkers(restaurants); // Adapter la carte aux marqueurs
  }
};

// Update markers function
const updateMarkers = async () => {
  const currentMap = map.value as mapboxgl.Map;
  if (currentMap) {
    try {
      // Clear existing markers if the search query is empty
      if (!restaurantStore.searchQuery.trim()) {
        restaurantStore.clearMarkers(currentMap);
        return; // Stop if the search is empty
      }

      // Use the filtered restaurants
      const filteredRestaurants = restaurantStore.getFilteredRestaurants;

      // Filter out restaurants without coordinates
      const validRestaurants = filteredRestaurants.filter(
        (restaurant) => restaurant.longitude !== undefined && restaurant.latitude !== undefined
      );

      // Update markers if there are valid restaurants
      if (validRestaurants.length > 0) {
        await restaurantStore.updateRestaurantMarkers(currentMap, validRestaurants);

        // Fit map to valid restaurants
        fitMapToMarkers(validRestaurants as IRestaurant[]);
      } else {
        restaurantStore.clearMarkers(currentMap); // Clear markers if no valid results
      }
    } catch (error) {
      console.error('Error updating restaurant markers:', error);
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
      accessToken: mapboxToken
    })

    // Ne pas charger de marqueurs au démarrage pour garder la carte vide
    restaurantStore.clearMarkers(map.value as any) // Assurez-vous que la carte est vide au début

    // Obtenir la position de l'utilisateur et placer le point bleu
    getUserLocation()

    // Charger et afficher les emplacements des restaurants
    getRestaurantLocation(); 
  }
})

// Surveiller les changements dans les restaurants filtrés pour mettre à jour les marqueurs
watch(
  () => restaurantStore.getFilteredRestaurants,
  async () => {
    await updateMarkers() // Mise à jour des marqueurs après la recherche
  }
)
</script>

<template>
  <div class="map-container">
    <!-- Conteneur de la carte -->
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  top: -118px;
  padding: 0px;
  width: 100vw;
  height: 100vh; /* Prend toute la hauteur de l'écran */
}

.map {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
