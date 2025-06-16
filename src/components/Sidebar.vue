<template>
  <div class="sidebar-container">
    <button class="sidebar-toggle" :class="{ 'sidebar-toggle-collapsed': !isSidebarOpen }" @click="$emit('toggle-sidebar')">
      ☰
    </button>
    <div class="sidebar" :class="{ 'sidebar-collapsed': !isSidebarOpen }">
    <!-- Profile Section -->
    <div class="profile-section">
      <img src="../assets/images/profile.png" alt="Profile" class="profile-img" />
      <div class="profile-info">
        <router-link to="/my-account" class="my-account-btn">My Account</router-link>
        <p class="username-display">{{ username }}</p>
      </div>
      <button class="logout-btn" @click="handleLogout">Logout</button>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-title">
        <span class="filter-icon">
          <img src="../assets/images/funnel-icon.png" width="25px" height="25px" />
        </span>
        Filter
      </div>

      <!-- Genre Filter -->
      <div class="filter-dropdown">
        <div class="filter-header" @click="isGenreOpen = !isGenreOpen">
          <span>Genre</span>
          <span :class="isGenreOpen ? 'arrow-up' : 'arrow-down'">▼</span>
        </div>
        <transition name="slide-fade">
          <div v-if="isGenreOpen" class="filter-chips">
            <p v-if="isLoadingGenres">Loading genres...</p>
            <p v-else-if="genres.length === 0">No genres found</p>
            <div
              v-for="(genre, index) in genres"
              :key="index"
              class="chip"
              @click="$emit('toggleGenre', genre)"
            >
              <span>{{ genre }}</span>
              <button
                v-if="selectedGenres.includes(genre)"
                class="remove-chip"
                @click.stop="$emit('removeGenre', genre)"
              >
                ×
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Instruments Filter -->
      <div class="filter-dropdown">
        <div class="filter-header" @click="isInstrumentsOpen = !isInstrumentsOpen">
          <span>Instruments</span>
          <span :class="isInstrumentsOpen ? 'arrow-up' : 'arrow-down'">▼</span>
        </div>
        <transition name="slide-fade">
          <div v-if="isInstrumentsOpen" class="filter-chips">
            <p v-if="isLoadingInstruments">Loading instruments...</p>
            <p v-else-if="instruments.length === 0">No instruments found</p>
            <div
              v-for="(instrument, index) in instruments"
              :key="index"
              class="chip"
              @click="$emit('toggleInstrument', instrument)"
            >
              <span>{{ instrument }}</span>
              <button
                v-if="selectedInstruments.includes(instrument)"
                class="remove-chip"
                @click.stop="$emit('removeInstrument', instrument)"
              >
                ×
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-header">
        <button class="view-charts-button" @click="goHome">My Archive</button>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-header">
        <button class="view-charts-button" @click="goToStatistics">View Statistics</button>
      </div>
    </div>    
    </div>
  </div>
</template>

<script>

import { getCurrentUser, getCurrentUserTags, logout } from "../services/api";

export default {
  props: {
    genres: {
      type: Array,
      required: true,
    },
    instruments: {
      type: Array,
      required: true,
    },
    selectedGenres: {
      type: Array,
      required: true,
    },
    selectedInstruments: {
      type: Array,
      required: true,
    },

    isLoadingGenres: {
      type: Boolean,
      required: true,
    },
    isLoadingInstruments: {
      type: Boolean,
      required: true,
    },

    musicSheets: {
      type: Array,
      default: () => [], // Provide empty array as default
    },
    workerActive: Boolean,
    isSidebarOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      username: "Loading...",
      isGenreOpen: false,
      isInstrumentsOpen: false,
    };
  },

  async mounted() {
    try {
      const user = await getCurrentUser(); // Fetch the current user
      this.username = user.username || "Guest"; // Set the username or default to "Guest"
    } catch (error) {
      console.error("Error fetching user data:", error);
      this.username = "Guest"; // Fallback to "Guest" in case of error
    }
  },

  methods: {
    async handleLogout() {
      try {
        await logout(); // Call the logout API
        localStorage.removeItem("authToken"); // Remove the token from localStorage
        this.$router.push("/"); // Redirect to the login page
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
    goToStatistics() {
      this.$router.push("/charts"); // Redirect to the charts page
    },
    goHome() {
      this.$router.push("/app"); // Redirect to the home page
    },
  },
};
</script>

<style scoped>
/* Profile Section Styles */
.profile-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
}

.my-account-btn {
  background-color: transparent;
  color: #f4effa;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 5px;
  cursor: pointer;
}

.my-account-btn:hover {
  text-decoration: underline;
}

.username-display {
  color: #ffffff;
  font-size: 14px;
  margin: 0;
}

.logout-btn {
  background-color: #532b88;
  color: #f4effa;
  border: none;
  border-radius: 5px 10px 5px 10px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #6a3dbb;
}

.sidebar-container {
  position: relative;
  z-index: 1000;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 300px;
  background-color: #9b72cf;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
}

.sidebar-collapsed {
  transform: translateX(-100%);
}

.sidebar-toggle {
  background-color: #532b88;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;
  display: block;
}

</style>