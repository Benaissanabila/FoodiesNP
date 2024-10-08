<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useUserStore } from '@/stores/UserStore';
  import { useRouter } from 'vue-router';
  import type { IUser } from '@/shared/interfaces/UserInterface';
 
  import { useI18n } from 'vue-i18n';
  import Footer from '@/components/Footer.vue';
import NavigationBar from '@/components/NavigationBar.vue';



  const userStore = useUserStore();
  const router = useRouter();
  const { t } = useI18n();
  
  const user = computed(() => userStore.user as IUser);
  const isEditing = ref(false);
  const editedUser = ref({} as IUser);
  const newProfilePhoto = ref<File | null>(null);


  
  const profilePhotoUrl = computed(() => {
    return user.value?.UserPhoto 
      ? `http://localhost:3000/uploads/${user.value.UserPhoto}`
      : '/default-profile.png';
  });
  
  onMounted(() => {
    if (!userStore.user) {
      userStore.checkAuth();
    }
  });
  
  function startEditing() {
  editedUser.value = { ...user.value };

  // Si la date de naissance existe, la formater pour le champ 'date'
  if (editedUser.value.DOB) {
    editedUser.value.DOB = formatDateForInput(editedUser.value.DOB);
  }

  isEditing.value = true;
}


  
  function cancelEdit() {
    isEditing.value = false;
  }
  
  async function saveProfile() {
  try {
    if (newProfilePhoto.value) {
      await userStore.updateProfilePhoto(newProfilePhoto.value);
    }
    await userStore.updateUser(editedUser.value);
    isEditing.value = false;
    newProfilePhoto.value = null;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
  }
}
  
function confirmDelete() {
  if (confirm(t('myProfile.deleteConfirmation'))) {
    deleteProfile();
  }
}
  
  async function deleteProfile() {
    try {
      await userStore.deleteUser();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
    }
  }
  
  function formatDate(date: string | Date | undefined): string {
  if (!date) return 'Date non spécifiée';

  const dateObject = typeof date === 'string' ? new Date(date) : date;

  // Ajuster la date pour le fuseau horaire local
  const utcDate = new Date(dateObject.getTime() + dateObject.getTimezoneOffset() * 60000);

  return utcDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}


async function handlePhotoChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    console.log('Nouvelle photo sélectionnée:', file.name);
    try {
      await userStore.updateProfilePhoto(file);
      console.log('Photo mise à jour avec succès');
      // Forcer la mise à jour de l'URL de la photo
      if (userStore.user) {
        userStore.user = { 
          ...userStore.user, 
          UserPhoto: userStore.user.UserPhoto + '?t=' + new Date().getTime() 
        };
      }
    } catch (error) {
      console.error('Erreur lors du changement de la photo de profil:', error);
    }
  }
}

function triggerPhotoUpload() {
  const input = document.getElementById('photoInput') as HTMLInputElement;
  if (input) {
    input.click();
  }
}

function formatDateForInput(date: string | Date | undefined): string {
  if (!date) return '';

  const dateObject = typeof date === 'string' ? new Date(date) : date;
  // Retourne la date au format 'YYYY-MM-DD' attendu par le champ 'date'
  return dateObject.toISOString().split('T')[0];
}


  </script>
  
  <template>
      <NavigationBar></NavigationBar> 
    <div class="page-container">
      <header class="header">
      
          </header>
  
      <div class="profile-container">
        <h1>{{ t('myProfile.title') }}</h1>
        
        <div v-if="user" class="profile-info">
          <div class="photo-container">
            <img :key="user.UserPhoto" :src="profilePhotoUrl" :alt="t('profile.photoAlt')" class="profile-photo">
            <input 
              type="file" 
              id="photoInput" 
              @change="handlePhotoChange" 
              accept="image/*" 
              style="display: none;"
            >
            <button @click="triggerPhotoUpload" class="btn btn-secondary photo-change-btn">
              {{ t('myProfile.changePhoto') }}
            </button>
          </div>
          
          <form @submit.prevent="saveProfile" v-if="isEditing">
            <div class="form-group">
              <label for="name">{{ t('myProfile.name') }}:</label>
              <input id="name" v-model="editedUser.name" required>
            </div>
            <div class="form-group">
              <label for="email">{{ t('myProfile.email') }}:</label>
              <input id="email" v-model="editedUser.email" type="email" required>
            </div>
            <div class="form-group">
  <label for="dob">{{ t('myProfile.dob') }}:</label>
  <input id="dob" v-model="editedUser.DOB" type="date" required>
</div>

            <button type="submit" class="btn btn-primary">{{ t('myProfile.save') }}</button>
            <button @click="cancelEdit" class="btn btn-secondary">{{ t('myProfile.cancel') }}</button>
          </form>
          
          <div v-else>
            <p><strong>{{ t('myProfile.name') }}:</strong> {{ user.name }}</p>
            <p><strong>{{ t('myProfile.email') }}:</strong> {{ user.email }}</p>
            <p><strong>{{ t('myProfile.dob') }}:</strong> {{ formatDate(user.DOB) }}</p>
            <button @click="startEditing" class="btn btn-primary">{{ t('myProfile.edit') }}</button>
            <button @click="confirmDelete" class="btn btn-danger">{{ t('myProfile.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
   <Footer></Footer>
  </template>

  <style scoped>
 .page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 20px;
}
  .profile-photo {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
  }
  
  .btn-primary {
    background-color: #00bcd4;
    color: white;
  }
  
  .btn-secondary {
    background-color: #00bcd4;;
    color: white;
  }
  
  .btn-danger {
    background-color: #dc3545;
    color: white;
  }
  </style>