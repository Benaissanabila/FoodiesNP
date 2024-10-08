 <script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRestaurantStore } from '@/stores/RestaurantStore';
  import { useRouter } from 'vue-router';
  import Footer from '@/components/Footer.vue';
  import SettingButton from '@/components/SettingButton.vue';
  import Logo from '@/components/Logo.vue';
  
  const { t } = useI18n();
  const restaurantStore = useRestaurantStore();
  const router = useRouter();
  
  const restaurant = reactive({
    name: '',
    address: '',
    phoneNumber: '',
    cuisineType: '',
    schedule: '',
    RestoPhoto: null as File | null,
  });
  
  const previewImage = ref('');
  const photoInput = ref<HTMLInputElement | null>(null);
  
  const cuisineTypes = [
    'Italien', 'Français', 'Japonais', 'Chinois', 'Mexicain', 'Indien', 'Thaïlandais', 'Américain'
  ];
  
  function triggerPhotoUpload() {
    photoInput.value?.click();
  }
  
  function handlePhotoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      restaurant.RestoPhoto = file;
      previewImage.value = URL.createObjectURL(file);
    }
  }
  
  function uploadMenu() {
    // Implémenter la logique pour téléverser le menu
    console.log('Téléversement du menu');
  }
  
  async function createRestaurant() {
    try {
      // Ici, vous devrez implémenter la logique pour envoyer les données au serveur
      // Utilisez restaurantStore pour cela
      await restaurantStore.createRestaurant(restaurant);
      router.push('/my-restaurants'); // Rediriger vers la liste des restaurants après création
    } catch (error) {
      console.error('Erreur lors de la création du restaurant:', error);
      // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
    }
  }
  </script>
  
  <template>
     <div class="page-container">
    <header class="header">
      <Logo class="logo" />
      <SettingButton class="settings" />
    </header>
    <div class="content-wrap">
      <div class="create-restaurant-container">
        <h1>{{ $t('createMyRestaurant.title') }}</h1>
          
          <div class="photo-container">
            <img :src="previewImage || '/placeholder-restaurant.png'" alt="Restaurant Photo" class="restaurant-photo">
            <button @click="triggerPhotoUpload" class="btn btn-secondary">{{ $t('createMyRestaurant.changePhoto') }}</button>
            <input 
              type="file" 
              ref="photoInput" 
              @change="handlePhotoChange" 
              accept="image/*" 
              style="display: none;"
            >
          </div>
  
          <form @submit.prevent="createRestaurant">
            <div class="form-group">
              <input v-model="restaurant.name" :placeholder="$t('createMyRestaurant.namePlaceholder')" required>
            </div>
            
            <div class="form-group">
              <input v-model="restaurant.address" :placeholder="$t('createMyRestaurant.addressPlaceholder')" required>
            </div>
            
            <div class="form-group">
              <input v-model="restaurant.phoneNumber" :placeholder="$t('createMyRestaurant.phonePlaceholder')" required>
            </div>
            
            <div class="form-group">
              <select v-model="restaurant.cuisineType" required>
                <option value="" disabled selected>{{ $t('createMyRestaurant.cuisineTypePlaceholder') }}</option>
                <option v-for="type in cuisineTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
            
            <div class="form-group">
              <input v-model="restaurant.schedule" :placeholder="$t('createMyRestaurant.schedulePlaceholder')" required>
            </div>
  
            <button type="button" @click="uploadMenu" class="btn btn-secondary">{{ $t('createMyRestaurant.uploadMenu') }}</button>
            
            <button type="submit" class="btn btn-primary">{{ $t('createMyRestaurant.submit') }}</button>
          </form>
        </div>
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
  
  .create-restaurant-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    width: 100%;
  }
  
  .photo-container {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .restaurant-photo {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .btn-primary {
    background-color: #00bcd4;
    color: white;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;

}

.logo {
 
  height: 40px;
}

  </style>