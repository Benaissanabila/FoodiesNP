<script setup lang="ts">
import RestaurantList from '../components/RestaurantList.vue'
import NavigationBar from '../components/NavigationBar.vue'
import Map from '@/components/Map.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <NavigationBar />
  <Map></Map>

  <RestaurantList />

  <Footer />
</template>

<style scoped></style>
