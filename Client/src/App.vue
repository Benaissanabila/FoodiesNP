<script setup lang="ts">
import RestaurantList from './components/RestaurantList.vue';
import NavigationBar from './components/NavigationBar.vue';
</script>

<template>
  <NavigationBar /> 
  <div class="content">
    <RestaurantList />
  </div>
</template>

<style scoped>
.content {
  padding-top: 80px; /* Ajuste ce padding selon la hauteur de ta barre de navigation */
}
</style>
