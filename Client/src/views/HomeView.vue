<script setup lang="ts">
import RestaurantList from '../components/RestaurantList.vue'
import NavigationBar from '../components/NavigationBar.vue'
import Map from '@/components/Map.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <div class="page-container">
    <div class="content-wrap">
      <NavigationBar />
      <Map />
      <RestaurantList />
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrap {
  flex: 1; 
  display: flex;
  flex-direction: column;
}


</style>
