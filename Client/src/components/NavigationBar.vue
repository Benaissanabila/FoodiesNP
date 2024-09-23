<script setup lang='ts'> 
import SearchBar from './SearchBar.vue';
</script>

<template>
  <nav>
    <SearchBar /> 
  </nav>
</template>

<style scoped>
nav {
  padding: 10px;
  position: fixed; 
  top: 0;
  width: 100%; 
  z-index: 1000;
}
</style>