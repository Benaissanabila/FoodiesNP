<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import { useRoute } from 'vue-router'; // Importez useRoute
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface'; // Assurez-vous que le chemin est correct
import CommentsList from '@/components/commentsList.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import ReservationTable from '@/components/ReservationTable.vue';
import Footer from '@/components/Footer.vue';

const restaurantStore = useRestaurantStore();
const restaurant = ref<IRestaurant | null>(null); // Type explicite ici

// Utilisez useRoute pour accéder aux paramètres de la route
const route = useRoute();
const restaurantId = route.params.id as string; // Obtenez l'ID du restaurant

// Récupérer le restaurant par son ID lors du montage
onMounted(async () => {
  await restaurantStore.fetchRestaurantById(restaurantId);
  // Vérifier si le restaurant a été récupéré avec succès
  restaurant.value = restaurantStore.restaurants.find(r => r._id === restaurantId) || null;
});
</script>
<template>
  <div>
    <NavigationBar />
    <ReservationTable />
    <CommentsList 
      v-if="restaurant" 
      :restaurantId="restaurant._id" 
      :restaurantName="restaurant.name" 
    />
    <p v-else>Chargement du restaurant...</p> <!-- Message de chargement -->
  </div>
  <Footer />
</template>
<style>
/* Ajoutez vos styles ici si nécessaire */
</style>
