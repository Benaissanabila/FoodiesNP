<script setup lang="ts">
import RestaurantList from '../components/RestaurantList.vue'
import NavigationBar from '../components/NavigationBar.vue'
import Map from '@/components/Map.vue'
</script>

<template>
  <NavigationBar />
  <Map></Map>

  <RestaurantList />
</template>

<style scoped></style>
