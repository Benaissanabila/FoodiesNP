<template>  
    <div class="share-component">
      <img 
        src="@/assets/image/share.svg" 
        alt="Share Icon" 
        @click="toggleShareOptions" 
        class="share-icon" 
      />
    
      <!-- Section de partage -->
      <div v-if="showShareOptions" class="share-options">
        <div class="share-header">
          <button @click="toggleShareOptions" class="close-button">X</button>
        </div>
        <div class="share-buttons">
          <img 
            src="@/assets/image/messenger.svg" 
            alt="Messenger" 
            @click="shareOnMessenger" 
            class="share-icon" 
          />
          <img 
            src="@/assets/image/instagram.svg" 
            alt="Instagram" 
            @click="shareOnInstagram" 
            class="share-icon" 
          />
          <img 
            src="@/assets/image/facebook.svg" 
            alt="Facebook" 
            @click="shareOnFacebook" 
            class="share-icon" 
          />
          <img 
            src="@/assets/image/twitter.svg" 
            alt="Twitter" 
            @click="shareOnTwitter" 
            class="share-icon" 
          />
          <img 
            src="@/assets/image/whatsapp.svg" 
            alt="WhatsApp" 
            @click="shareOnWhatsApp" 
            class="share-icon" 
          />
          <img 
            src="@/assets/image/link.svg" 
            alt="Copie Link" 
            @click="copyLink"
            class="share-icon" 
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const currentUrl = window.location.href; // Récupérer l'URL actuelle
  const showShareOptions = ref(false); // État pour afficher/cacher les options de partage
  
  // Fonction pour basculer l'affichage des options de partage
  const toggleShareOptions = () => {
    showShareOptions.value = !showShareOptions.value;
  };
  
  // Fonction pour partager sur Messenger
  const shareOnMessenger = () => {
    const messengerUrl = `https://www.messenger.com/share/?link=${encodeURIComponent(currentUrl)}`;
    window.open(messengerUrl, '_blank');
  };
  
  // Fonction pour partager sur Instagram
  const shareOnInstagram = () => {
    alert("Pour partager sur Instagram, copiez le lien et collez-le dans votre publication.");
  };
  
  // Fonction pour partager sur Facebook
  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, '_blank');
  };
  
  // Fonction pour partager sur Twitter
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterUrl, '_blank');
  };
  
  // Fonction pour partager sur WhatsApp
  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  // Fonction pour copier le lien dans le presse-papiers
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Lien copié dans le presse-papiers !");
    } catch (error) {
      console.error("Erreur lors de la copie du lien :", error);
    }
  };
  </script>
  
  <style scoped>
  .share-component {
    position: relative;
    display: inline-block;
    padding: 15px;
  }
  .share-icon {
    cursor: pointer;
    width: 40px; /* Ajustez la taille selon vos besoins */
    height: 40px;
    margin-right: 10px; /* Espace entre les icônes */
    transition: transform 0.2s ease; /* Ajoute une transition douce */
  }
  
  /* Effet de survol */
  .share-icon:hover {
    transform: scale(1.1); /* Agrandit l'icône lors du survol */
    opacity: 0.8; /* Change l'opacité lors du survol */
  }
  
  .share-options {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 4px 4px 5px #00bbd482;
    padding: 10px;
    border-radius: 5px;
    left: -320px; /* Positionne à gauche */
    width: auto; /* Largeur automatique pour la section de partage */
    z-index: 100; /* Assurez-vous que la section est au-dessus d'autres éléments */
  }
  
  .share-header {
    display: flex;
    justify-content: space-between; /* Espace entre le titre et le bouton de fermeture */
    align-items: center; /* Centrer verticalement */
  }
  
  .close-button {
    background: none;
    border: none;
    color: #666666; /* Couleur du bouton de fermeture */
    cursor: pointer;
    font-weight: bold; /* Pour le rendre plus visible */
    margin-left: auto; /* Aligne le bouton de fermeture à droite */
  }
  
  .share-buttons {
    display: flex; /* Changez de colonne à ligne */
    flex-direction: row; /* Affichez les boutons en ligne */
    gap: 10px; /* Espace entre les icônes */
  }
  </style>
  