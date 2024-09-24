<script setup lang='ts'> 
import SearchBar from './SearchBar.vue';
import ProfileButton from './ProfileButton.vue';
import ChatButton from './ChatButton.vue';
import SettingButton from './SettingButton.vue';
import Logo from './Logo.vue'
</script>

<template>

  <nav class="navigation-bar">
    <Logo />
    <div class="center">
      <SearchBar />
    </div>
    <div class="right-buttons">
   
      <ChatButton />
      <SettingButton /> 
      <ProfileButton />
    </div>
  </nav>
</template>

<style scoped>
.navigation-bar {
  padding: 10px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.center {
  flex-grow: 1;
  display: flex;
  justify-content: center; /* Centrer la barre de recherche */
}

.right-buttons {
  display: flex;
  align-items: center;
}

.right-buttons > * {
  margin-left: 20px; /* Ajoute de l'espace entre les boutons */
}
</style>
