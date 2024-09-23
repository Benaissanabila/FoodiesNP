<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import RestaurantList from './components/RestaurantList.vue';
import NavigationBar from './components/NavigationBar.vue'; // Importation de la NavigationBar
</script>

<template>
  <NavigationBar /> 
  <RestaurantList />
</template>

<style scoped>

</style>

