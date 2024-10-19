<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import imageSrc from '@/assets/image/viewList.webp';
import CardSection from './CardSection.vue';
import RestaurantCard from './RestaurantCard.vue'; 
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useRestaurantStore();
const showRestaurants = ref(false); 
const topRestaurantsRef = ref(null); 
const maxVisibleRestaurants = ref(6); // Change this to set how many restaurants to show initially

onMounted(() => {
  store.loadRestaurants();

  // Get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        store.setUserLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
  }

  // Configure IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  if (topRestaurantsRef.value) {
    observer.observe(topRestaurantsRef.value);
  }

  onUnmounted(() => {
    if (topRestaurantsRef.value) {
      observer.unobserve(topRestaurantsRef.value);
    }
  });
});

const viewCompleteList = () => {
  showRestaurants.value = true;
};

const closeRestaurants = () => {
  showRestaurants.value = false;
};

// Computed property to limit the number of displayed restaurants
const displayedRestaurants = computed(() => {
  if (!showRestaurants.value) return [];
  return store.sortedRestaurants.slice(0, maxVisibleRestaurants.value);
});

// Computed property to check if there are more restaurants to show
const hasMoreRestaurants = computed(() => {
  return store.sortedRestaurants.length > maxVisibleRestaurants.value;
});

// Method to show more restaurants
const viewMoreRestaurants = () => {
  maxVisibleRestaurants.value += 6; // Increment the count by 6 (or any number you choose)
};

</script>


<template>
  <div class="container">
    <!-- Main flex container to arrange items vertically -->
    <div class="top-section">
      <div class="top-restaurants" ref="topRestaurantsRef">
        <div class="overlay">
          <div class="left-section">
            <h2>{{ t('discoverTop100') }}</h2>
            <button @click="viewCompleteList">{{ t('viewCompleteList') }} ></button>
          </div>
        </div>
      </div>
      
      <!-- Restaurant list will now appear below the top-restaurants -->
      <div class="restaurants-list" v-if="showRestaurants">
        <div class="header">
          <h3>{{ t('restaurantsList') }}</h3>
          <span class="close-button" @click="closeRestaurants">✖</span>
        </div>

        <div v-if="store.loading">{{ t('loadingRestaurants') }}</div>
        <div v-if="store.error">{{ store.error }}</div>
        
        <!-- Displaying limited number of restaurants -->
        <div class="restaurant-cards">
          <div v-for="restaurant in displayedRestaurants" :key="restaurant._id" class="restaurant-card">
            <RestaurantCard :restaurant="restaurant" />
          </div>
        </div>

        <!-- Button to view more restaurants -->
        <button v-if="hasMoreRestaurants" @click="viewMoreRestaurants" class="view-more-button">
          {{ t('viewMore') }}
        </button>
      </div>
    </div>

    <CardSection :restaurants="store.sortedRestaurants" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center; /* Center horizontally */
  margin: 20px; /* Margin around the container */
}

.top-section {
  width: 100%; /* Full width */
}

.top-restaurants {
  border-radius: 10px;
  width: 900px;
  height: 220px; /* Height of the section */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* Necessary for the overlay */
  overflow: hidden; /* Prevents image overflow */
  transform: translateY(-50px); /* Initial position for animation */
  opacity: 0; /* Initial opacity */
  transition: transform 2s ease, opacity 2s ease; /* Smooth transition */
  margin: 0 auto; /* Center the section horizontally */
}

.top-restaurants.visible {
  transform: translateY(0); /* Final position */
  opacity: 1; /* Final opacity */
}

.top-restaurants::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/image/page.webp'); /* Background image */
  background-size: cover; /* Cover the section */
  background-position: center; /* Center the image */
  opacity: 0.8; /* Opacity of the background image */
}

.overlay {
  position: relative; /* Necessary for content overlay */
  z-index: 1; /* Ensure content is above the image */
  text-align: center; /* Center the text */
  color: white; /* Text color */
}

.left-section h2 {
  font-size: 30px;
  font-weight: bold;
  color: black;
  background-color: #ffffff90; /* Slightly transparent white */
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 10px; /* Space between title and button */
}

.left-section button {
  background-color: white;
  color: #00bcd4;
  border: none;
  padding: 8px 16px; /* Reduced padding */
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.left-section button:hover {
  background-color: #77d2de;
  color: white;
}

.header {
  display: flex; /* Use flexbox to align items */
  justify-content: space-between; /* Space between title and close button */
  align-items: center; /* Center items vertically */
  margin-bottom: 20px; /* Spacing below the header */
  padding: 10px; /* Padding for a cleaner look */
  background-color: #f9f9f9; /* Background color for the header */
  border-radius: 8px; /* Rounded corners for the header */
}

.close-button {
  cursor: pointer; /* Change cursor to pointer for better UX */
  font-size: 20px; /* Font size */
  color: #00bcd4; /* Match color with your design */
}

.close-button:hover {
  color: #77d2de; /* Change color on hover */
}

.restaurants-list {
  display: flex; /* Use flexbox for the main layout */
  flex-direction: column; /* Arrange items vertically */
  width: 100%; /* Fill the available width */
  margin-top: 20px; /* Space between header and the restaurant list */
}

.restaurant-cards {
  display: grid; /* Use grid for multiple columns */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive columns */
  gap: 20px; /* Spacing between cards */
  padding: 20px; /* Padding around cards */
  box-sizing: border-box;
}

.restaurant-card {
  background-color: #fff; /* Background color */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Added box-shadow transition */
  position: relative;
  
  width: 100%; /* Take full width of the parent container */
  max-width: 300px; /* Optional: set a maximum width for uniformity */
  height: 350px; /* Set a fixed height to maintain card shape */
  display: flex;
  flex-direction: column; /* Align items vertically */
  justify-content: space-between; /* Space out content evenly */
  border: 2px solid transparent; /* Border for effect */
  background: linear-gradient(to bottom right, #ffffff, #f2f2f2); /* Gradient background */
}

.restaurant-card:hover {
  transform: scale(1.02); /* Slight animation on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover */
  border: 2px solid #00bcd4; /* Change border color on hover */
}

.restaurant-card img {
  width: 100%; /* Make the image fill the card */
  height: 150px; /* Set a fixed height for the image */
  object-fit: cover; /* Ensure image covers the space without distortion */
  border-top-left-radius: 10px; /* Rounded corners for images */
  border-top-right-radius: 10px; /* Rounded corners for images */
}

.restaurant-card h3 {
  color: #333; /* Dark text for better contrast */
  margin: 5px 0; /* Margin to separate text */
}

.restaurant-card p {
  color: #555; /* Slightly lighter color for less emphasis */
  margin: 2px 0; /* Less margin to save space */
  overflow-wrap: break-word; /* Allow long words to break */
}

.view-more-button {
  margin: 20px auto; /* Center the button */
  padding: 10px 20px; /* Padding for the button */
  background-color: #00bcd4; /* Button color */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block; /* Centering */
}

.view-more-button:hover {
  background-color: #77d2de; /* Change color on hover */
}
</style>
