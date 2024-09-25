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
    
    <!-- Menu normal pour les écrans de bureau -->
    <div class="center desktop-only">
      <SearchBar />
    </div>

    <!-- Menu hamburger pour les écrans mobiles -->
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
}

.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }
}
</style>
