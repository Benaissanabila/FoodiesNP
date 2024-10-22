<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRestaurantStore } from '@/stores/RestaurantStore'
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface'
import Logo from '@/components/Logo.vue'
import ProfileButton from '@/components/ProfileButton.vue'
import SettingButton from '@/components/SettingButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const restaurantStore = useRestaurantStore()

interface ScheduleDay {
  isOpen: boolean
  openTime: string
  closeTime: string
}

interface Schedule {
  monday: ScheduleDay
  tuesday: ScheduleDay
  wednesday: ScheduleDay
  thursday: ScheduleDay
  friday: ScheduleDay
  saturday: ScheduleDay
  sunday: ScheduleDay
}

interface FormDataInterface {
  name: string
  address: string
  cuisineType: string
  priceFork: string
  description: string
  RestoPhoto: string
  schedule: Schedule
}

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const restaurant = ref<IRestaurant | null>(null)
const newPhoto = ref<File | null>(null)

const defaultSchedule: Schedule = {
  monday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
  tuesday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
  wednesday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
  thursday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
  friday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
  saturday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
  sunday: { isOpen: false, openTime: '09:00', closeTime: '18:00' }
}

const formData = ref<FormDataInterface>({
  name: '',
  address: '',
  cuisineType: '',
  priceFork: '',
  description: '',
  RestoPhoto: '',
  schedule: { ...defaultSchedule }
})

const currentPhotoUrl = computed(() => {
  if (!restaurant.value?.RestoPhoto) return '/placeholder-restaurant.png'

  if (typeof restaurant.value.RestoPhoto === 'string') {
    if (restaurant.value.RestoPhoto.startsWith('http')) {
      return restaurant.value.RestoPhoto
    }
    return `http://localhost:3000/uploads/${restaurant.value.RestoPhoto}`
  }

  return '/placeholder-restaurant.png'
})

const handlePhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    newPhoto.value = input.files[0]
  }
}

const parseSchedule = (scheduleData: any): Schedule => {
  const defaultDay = { isOpen: false, openTime: '09:00', closeTime: '18:00' }

  if (!scheduleData) return { ...defaultSchedule }

  const schedule: Schedule = {
    monday: { ...defaultDay },
    tuesday: { ...defaultDay },
    wednesday: { ...defaultDay },
    thursday: { ...defaultDay },
    friday: { ...defaultDay },
    saturday: { ...defaultDay },
    sunday: { ...defaultDay }
  }

  // Si scheduleData est une chaîne JSON, la parser
  const data = typeof scheduleData === 'string' ? JSON.parse(scheduleData) : scheduleData

  Object.keys(schedule).forEach((day) => {
    const dayKey = day as keyof Schedule
    if (data[dayKey]) {
      schedule[dayKey] = {
        isOpen: Boolean(data[dayKey].isOpen),
        openTime: data[dayKey].openTime || defaultDay.openTime,
        closeTime: data[dayKey].closeTime || defaultDay.closeTime
      }
    }
  })

  return schedule
}

const loadRestaurant = async () => {
  const restaurantId = route.params.id as string
  loading.value = true
  error.value = null

  try {
    await restaurantStore.fetchRestaurantById(restaurantId)
    const loadedRestaurant = restaurantStore.getRestaurantById(restaurantId)

    if (loadedRestaurant) {
      restaurant.value = loadedRestaurant
      const photoString =
        typeof loadedRestaurant.RestoPhoto === 'string' ? loadedRestaurant.RestoPhoto : ''

      formData.value = {
        name: loadedRestaurant.name,
        address: loadedRestaurant.address,
        cuisineType: loadedRestaurant.cuisineType || '',
        priceFork: loadedRestaurant.priceFork || '',
        description: loadedRestaurant.description || '',
        RestoPhoto: photoString,
        schedule: parseSchedule(loadedRestaurant.schedule)
      }
    } else {
      error.value = 'Restaurant non trouvé'
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement du restaurant'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = null

  try {
    const restaurantId = route.params.id as string
    const updateData = new FormData()

    updateData.append('name', formData.value.name)
    updateData.append('address', formData.value.address)
    updateData.append('cuisineType', formData.value.cuisineType)
    updateData.append('priceFork', formData.value.priceFork)
    updateData.append('description', formData.value.description)
    updateData.append('schedule', JSON.stringify(formData.value.schedule))

    if (newPhoto.value) {
      updateData.append('photo', newPhoto.value)
    }

    await restaurantStore.updateRestaurant(restaurantId, updateData)
    router.push('/my-restaurants')
  } catch (err) {
    error.value = 'Erreur lors de la mise à jour du restaurant'
    console.error(err)
  } finally {
    saving.value = false
  }
}

const days = computed(() => ({
  monday: t('days.monday'),
  tuesday: t('days.tuesday'),
  wednesday: t('days.wednesday'),
  thursday: t('days.thursday'),
  friday: t('days.friday'),
  saturday: t('days.saturday'),
  sunday: t('days.sunday')
}))

onMounted(() => {
  loadRestaurant()
})
</script>

<template>
  <div>
    <div class="header">
      <Logo />
      <div class="header-buttons">
        <SettingButton />
        <ProfileButton />
      </div>
    </div>
    <div class="edit-restaurant-container">
      <h2>{{ t('editRestaurant.title') }}</h2>

      <div v-if="loading" class="loading">{{ t('editRestaurant.loading') }}</div>
      <div v-if="error" class="error-message">{{ error }}</div>

      <form v-if="!loading && restaurant" @submit.prevent="handleSubmit" class="edit-form">
        <div class="form-group">
          <label for="name">{{ t('editRestaurant.name') }}</label>
          <input id="name" v-model="formData.name" type="text" required class="form-input" />
        </div>

        <div class="form-group">
          <label for="address">{{ t('editRestaurant.address') }}</label>
          <input id="address" v-model="formData.address" type="text" required class="form-input" />
        </div>

        <div class="form-group">
          <label for="cuisineType">{{ t('editRestaurant.cuisineType') }}</label>
          <select id="cuisineType" v-model="formData.cuisineType" required class="form-select">
            <option value="">{{ t('editRestaurant.selectType') }}</option>
            <option value="Français">{{ t('cuisineTypes.french') }}</option>
            <option value="Italien">{{ t('cuisineTypes.italian') }}</option>
            <option value="Japonais">{{ t('cuisineTypes.japanese') }}</option>
            <option value="Chinois">{{ t('cuisineTypes.chinese') }}</option>
            <option value="Indien">{{ t('cuisineTypes.indian') }}</option>
            <option value="Mexicain">{{ t('cuisineTypes.mexican') }}</option>
            <option value="Américain">{{ t('cuisineTypes.american') }}</option>
            <option value="Autre">{{ t('cuisineTypes.other') }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="priceFork">{{ t('editRestaurant.priceRange') }}</label>
          <select id="priceFork" v-model="formData.priceFork" required class="form-select">
            <option value="">{{ t('editRestaurant.selectPrice') }}</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
            <option value="$$$$">$$$$</option>
          </select>
        </div>

        <div class="form-group schedule-section">
          <h3>{{ t('editRestaurant.openingHours') }}</h3>
          <div v-for="(dayName, day) in days" :key="day" class="schedule-day">
            <div class="day-header">
              <label :for="day" class="day-label">
                <input
                  :id="day"
                  type="checkbox"
                  v-model="formData.schedule[day].isOpen"
                  class="day-checkbox"
                />
                {{ dayName }}
              </label>
            </div>

            <div v-if="formData.schedule[day].isOpen" class="time-inputs">
              <input
                type="time"
                v-model="formData.schedule[day].openTime"
                class="time-input"
                required
              />
              <span>{{ t('editRestaurant.to') }}</span>
              <input
                type="time"
                v-model="formData.schedule[day].closeTime"
                class="time-input"
                required
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="description">{{ t('editRestaurant.description') }}</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="4"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label>{{ t('editRestaurant.currentPhoto') }}</label>
          <img
            :src="currentPhotoUrl"
            :alt="t('editRestaurant.restaurantPhoto')"
            class="current-photo"
          />
        </div>

        <div class="form-group">
          <label for="newPhoto">{{ t('editRestaurant.newPhoto') }}</label>
          <input
            id="newPhoto"
            type="file"
            @change="handlePhotoChange"
            accept="image/*"
            class="form-input-file"
          />
        </div>

        <div class="form-actions">
          <button type="button" @click="router.push('/my-restaurants')" class="btn-cancel">
            {{ t('editRestaurant.cancel') }}
          </button>
          <button type="submit" class="btn-save" :disabled="saving">
            {{ saving ? t('editRestaurant.saving') : t('editRestaurant.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-buttons {
  display: flex;
  gap: 20px;
  align-items: center;
}

.schedule-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.schedule-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.schedule-day {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.day-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.day-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.day-checkbox {
  width: 18px;
  height: 18px;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 28px;
}

.time-input {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 120px;
}
.edit-restaurant-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #00bcd4;
  text-align: center;
  margin-bottom: 30px;
}

.edit-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-input-file {
  padding: 8px 0;
}

.current-photo {
  max-width: 200px;
  height: auto;
  border-radius: 4px;
  margin-top: 8px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn-save,
.btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-save {
  background-color: #00bcd4;
  color: white;
}

.btn-save:hover {
  background-color: #77d2df;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}

.btn-cancel:hover {
  background-color: #da190b;
}

.btn-save:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading,
.error-message {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.error-message {
  color: #f44336;
}

@media (max-width: 768px) {
  .edit-restaurant-container {
    padding: 10px;
  }

  .edit-form {
    padding: 20px;
  }
}
</style>
