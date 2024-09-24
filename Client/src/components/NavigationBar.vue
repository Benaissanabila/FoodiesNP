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
  border-bottom: 1px solid #e0e0e0;
  top: 0;
  width: 100%; 
  z-index: 1000;
}
</style>