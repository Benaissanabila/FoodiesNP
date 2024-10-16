<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRestaurantStore } from '@/stores/RestaurantStore'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'
import Footer from '@/components/Footer.vue'
import SettingButton from '@/components/SettingButton.vue'
import Logo from '@/components/Logo.vue'
import axios from 'axios'
import { AxiosError } from 'axios'

const { t } = useI18n()
const restaurantStore = useRestaurantStore()
const userStore = useUserStore()
const router = useRouter()

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

interface DaySchedule {
  open: string
  close: string
}

type Schedule = {
  [K in DayOfWeek]: DaySchedule
}

interface Restaurant {
  name: string
  streetAddress: string
  city: string
  stateProvince: string
  country: string
  phoneNumber: string
  cuisineType: string
  schedule: Schedule
  RestoPhoto: File | null
  description: string
  priceFork: string
  owner?: string
}

const restaurant = reactive<Restaurant>({
  name: '',
  streetAddress: '',
  city: '',
  stateProvince: '',
  country: '',
  phoneNumber: '',
  cuisineType: '',
  schedule: {
    monday: { open: '', close: '' },
    tuesday: { open: '', close: '' },
    wednesday: { open: '', close: '' },
    thursday: { open: '', close: '' },
    friday: { open: '', close: '' },
    saturday: { open: '', close: '' },
    sunday: { open: '', close: '' }
  },
  RestoPhoto: null,
  description: '',
  priceFork: '',
  owner: '',
})

// Fonction pour formater l'horaire
function formatSchedule(schedule: Schedule): { [key: string]: string } {
  const formattedSchedule: { [key: string]: string } = {}
  const dayTranslations: { [key in DayOfWeek]: string } = {
    monday: 'lundi',
    tuesday: 'mardi',
    wednesday: 'mercredi',
    thursday: 'jeudi',
    friday: 'vendredi',
    saturday: 'samedi',
    sunday: 'dimanche'
  }

  for (const [day, hours] of Object.entries(schedule)) {
    if (hours.open && hours.close) {
      formattedSchedule[dayTranslations[day as DayOfWeek]] = `${hours.open}-${hours.close}`
    }
  }

  return formattedSchedule
}

// Computed property pour combiner les champs d'adresse
const fullAddress = computed(() => {
  return `${restaurant.streetAddress}, ${restaurant.city}, ${restaurant.stateProvince}, ${restaurant.country}`.trim()
})

const previewImage = ref('')
const photoInput = ref<HTMLInputElement | null>(null)

const cuisineTypes = [
  'Italien',
  'Français',
  'Japonais',
  'Chinois',
  'Mexicain',
  'Indien',
  'Thaïlandais',
  'Américain'
]

const priceForks = ['$', '$$', '$$$', '$$$$', '$$$$$']

const days: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]

function triggerPhotoUpload() {
  photoInput.value?.click()
}

function handlePhotoChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    restaurant.RestoPhoto = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const isSubmitting = ref(false)

async function createRestaurant() {
  if (!userStore.isAuthenticated) {
    alert(t('createMyRestaurant.notAuthenticated'))
    router.push('/login')
    return
  }

  const requiredFields: (keyof Restaurant)[] = ['name', 'streetAddress', 'city', 'stateProvince', 'country', 'phoneNumber', 'cuisineType', 'description', 'priceFork']
  for (const field of requiredFields) {
    if (!restaurant[field]) {
      alert(t('createMyRestaurant.fieldRequired', { field: t(`createMyRestaurant.${field}`) }))
      return
    }
  }

  if (!restaurant.RestoPhoto) {
    alert(t('createMyRestaurant.photoRequired'))
    return
  }

  isSubmitting.value = true
  
  try {
    
    const formData = new FormData()
    formData.append('name', restaurant.name)
    formData.append('address', fullAddress.value)
    formData.append('cuisineType', restaurant.cuisineType)
    formData.append('phoneNumber', restaurant.phoneNumber)
    formData.append('schedule', JSON.stringify(restaurant.schedule))
    if (restaurant.RestoPhoto) {
      formData.append('RestoPhoto', restaurant.RestoPhoto)
    }
    formData.append('description', restaurant.description)
    formData.append('priceFork', restaurant.priceFork)
    
    if (userStore.user?._id) {
      formData.append('owner', userStore.user._id)
    } else {
      throw new Error('User ID not found')
    }

        // Formatage et ajout de l'horaire
        const formattedSchedule = formatSchedule(restaurant.schedule)
    formData.append('schedule', JSON.stringify(formattedSchedule))


    console.log('Données envoyées:', Object.fromEntries(formData))
    console.log(formData)

    const newRestaurant = await restaurantStore.createRestaurant(formData)
    console.log('Nouveau restaurant créé:', newRestaurant)
    alert(t('createMyRestaurant.success'))
    router.push('/')
  } catch (error: unknown) {
    // ... gestion des erreurs ...
  } finally {
    isSubmitting.value = false
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
          <img
            :src="previewImage || '/placeholder-restaurant.png'"
            alt="Restaurant Photo"
            class="restaurant-photo"
          />
          <button @click="triggerPhotoUpload" class="btn btn-secondary">
            {{ $t('createMyRestaurant.changePhoto') }}
          </button>
          <input
            type="file"
            ref="photoInput"
            @change="handlePhotoChange"
            accept="image/*"
            style="display: none"
          />
        </div>

        <form @submit.prevent="createRestaurant">
          <div class="form-group">
            <input
              v-model="restaurant.name"
              :placeholder="$t('createMyRestaurant.namePlaceholder')"
              required
            />
          </div>

          <div class="form-group address-group">
            <input
              class="street-address"
              v-model="restaurant.streetAddress"
              :placeholder="$t('createMyRestaurant.streetAddressPlaceholder')"
              required
            />
            <input
              v-model="restaurant.city"
              :placeholder="$t('createMyRestaurant.cityPlaceholder')"
              required
            />
            <input
              v-model="restaurant.stateProvince"
              :placeholder="$t('createMyRestaurant.stateProvincePlaceholder')"
              required
            />
            <input
              v-model="restaurant.country"
              :placeholder="$t('createMyRestaurant.countryPlaceholder')"
              required
            />
          </div>

          <div class="form-group">
            <input
              v-model="restaurant.phoneNumber"
              :placeholder="$t('createMyRestaurant.phonePlaceholder')"
              required
            />
          </div>

          <div class="form-group">
            <select v-model="restaurant.cuisineType" required>
              <option value="" disabled selected>
                {{ $t('createMyRestaurant.cuisineTypePlaceholder') }}
              </option>
              <option v-for="type in cuisineTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <div class="form-group">
            <textarea
              v-model="restaurant.description"
              :placeholder="$t('createMyRestaurant.descriptionPlaceholder')"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <select v-model="restaurant.priceFork" required>
              <option value="" disabled selected>
                {{ $t('createMyRestaurant.priceForkPlaceholder') }}
              </option>
              <option v-for="price in priceForks" :key="price" :value="price">{{ price }}</option>
            </select>
          </div>

          <div class="schedule-container">
            <h3>{{ $t('createMyRestaurant.scheduleTitle') }}</h3>
            <div v-for="day in days" :key="day" class="schedule-day">
              <label>{{ $t(`createMyRestaurant.days.${day}`) }}</label>
              <div class="schedule-inputs">
                <input
                  v-model="restaurant.schedule[day].open"
                  type="time"
                  :placeholder="$t('createMyRestaurant.openTime')"
                  required
                />
                <input
                  v-model="restaurant.schedule[day].close"
                  type="time"
                  :placeholder="$t('createMyRestaurant.closeTime')"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? $t('createMyRestaurant.submitting') : $t('createMyRestaurant.submit') }}
          </button>
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

input,
select {
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

.schedule-container {
  margin-top: 20px;
}

.schedule-day {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.schedule-inputs {
  display: flex;
  gap: 10px;
}

.schedule-inputs input {
  width: 120px;
}

.form-group {
  margin-bottom: 15px;
}

.address-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%; /* Changé de 120% à 100% pour éviter le débordement */
}

.address-group input {
  flex: 1 1 120px; /* flex-grow: 1, flex-shrink: 1, flex-basis: 120px */
  min-width: 120px;
}

.street-address {
  flex: 2 1 240px; /* flex-grow: 2, flex-shrink: 1, flex-basis: 240px */
  min-width: 20px; /* Augmente la largeur minimale */
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
}
</style>
