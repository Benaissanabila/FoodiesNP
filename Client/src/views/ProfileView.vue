<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useUserStore } from '@/stores/UserStore';
  import { useRouter } from 'vue-router';
  import type { IUser } from '@/shared/interfaces/UserInterface';
  import editIcon from '@/assets/image/edit.svg';
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
            <button @click="startEditing" class="btn btn-primary">
    <img :src="editIcon" alt="Edit icon" width="16" height="16">
  </button>
            <button @click="confirmDelete" class="btn btn-danger">{{ t('myProfile.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
   <Footer></Footer>
  </template>

<style scoped>
.btn img {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  
}

.profile-container {
  max-width: 600px;
  margin: 3rem auto;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

h1 {
  font-size: 1.8rem;
  color: #343a40;
  text-align: center;
  margin-bottom: 2rem;
}

.photo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid #00bcd4;
}

.photo-change-btn {
  background-color: #00bcd4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.photo-change-btn:hover {
  background-color: #008c9e;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
  color: #495057;
}

input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  color: #495057;
 
}

input:focus {
  border-color: #00bcd4;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 188, 212, 0.5);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #00bcd4;
  color: white;
}

.btn-primary:hover {
  background-color: #008c9e;
}

.btn-secondary {
  background-color: #00bcd4;
  color: white;
}

.btn-secondary:hover {
  background-color: #008c9e;
}

.btn-danger {
  margin-left: 40px;
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.profile-info p {
  font-size: 1rem;
  color: #343a40;
  margin-bottom: 15px;
}

.profile-info p strong {
  font-weight: bold;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 20px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>

 

