<script setup lang="ts">
import Logo from './Logo.vue';
import SearchBar from './SearchBar.vue';
import ChatButton from './ChatButton.vue';
import SettingButton from './SettingButton.vue';
import ProfileButton from './ProfileButton.vue';
import HamburgerMenu from './HamburgerMenu.vue';  
</script>

<template>
  <nav class="navigation-bar">
    <Logo />
    
    <!-- Barre de recherche visible sur tous les écrans -->
    <div class="center">
      <SearchBar />
    </div>

    <!-- Boutons pour les écrans de bureau -->
    <div class="right-buttons desktop-only">
      <ChatButton />
      <SettingButton />
      <ProfileButton />
    </div>

    <!-- Menu hamburger pour mobile -->
    <div class="mobile-only">
      <HamburgerMenu />
    </div>
  </nav>
</template>

<style scoped>
.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: relative;
  backdrop-filter: blur(2px);
  z-index: 10;

}

.desktop-only {
  display: flex;
}

.right-buttons {
  display: flex;
  gap: 15px; /* Ajustez la valeur selon vos besoins */
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none; /* Masquer les boutons pour mobile */
  }

  .mobile-only {
    display: block; /* Afficher le menu hamburger */
  }
  
  .center {
    flex: 1; /* Permettre à la barre de recherche d'utiliser l'espace disponible */
    display: flex; /* Aligner horizontalement */
  }
}
</style>
