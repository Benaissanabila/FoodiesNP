<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
  <div class="logo-container">
    <RouterLink to="/"></RouterLink><img src="../assets/logoFoodies.png" alt="Logo" class="logo" /> <!-- Remplacez le chemin par celui de votre logo -->
  </div>
</template>

<style>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  width: 100px;
  background-color: none;
  cursor: pointer;
}
</style>
