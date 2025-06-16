<template>
  <div class="app-container">
    <!-- Sidebar Component -->
    <Sidebar
      :genres="genres"
      :instruments="instruments"
      :selectedGenres="selectedGenres"
      :selectedInstruments="selectedInstruments"
      :isLoadingGenres="isLoadingGenres"
      :isLoadingInstruments="isLoadingInstruments"
      :musicSheets="musicSheets"
      :isSidebarOpen="isSidebarOpen"
      @toggleGenre="toggleGenre"
      @toggleInstrument="toggleInstrument"
      @clearFilters="clearFilters"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="main-content" :class="{ 'main-content-full': !isSidebarOpen }">
      <!-- Header Component -->
      <Header
        v-model:searchQuery="searchQuery"
        @search="searchItems"
        @clearSearch="clearSearch"
      />

      <!-- Sort and Pagination Component -->
      <SortPagination
        :sortBy="sortBy"
        :sortOrder="sortOrder"
        :currentPage="currentPage"
        :totalPages="totalPages()"
        :itemsPerPage="itemsPerPage"
        @setSort="setSort"
        @goToPage="goToPage"
        @changeItemsPerPage="changeItemsPerPage"
        @toggleWorker="toggleWorker"
        :workerActive="workerActive"
      />

      <!-- Music Grid Component -->
      <MusicGrid
        :musicSheets="musicSheets"
        @openItem="openItem"
      />
      <!-- Loading Indicator for Infinite Scroll -->
      <div v-if="isLoading && itemsPerPage === 'all'" class="loading">
        Loading more music sheets...
      </div>

      <!-- Upload Button -->
      <router-link to="/upload">
        <button class="upload-btn-dashboard" @click="prepareNewScore">
          + Upload
        </button>
      </router-link>
    </div>
  </div>
  <!-- Footer Component -->
  <Footer />
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";
import SortPagination from "./SortPagination.vue";
import MusicGrid from "./MusicGrid.vue";
import api from "../services/api";
import { Title } from "chart.js";
import Footer from "./Footer.vue"; // Import the Footer component
import { getCurrentUserTags } from "../services/api";

export default {
  components: {
    Sidebar,
    Header,
    SortPagination,
    MusicGrid,
    Footer, // Register the Footer component
  },
  data() {
    return {
      selectedGenres: [],
      selectedInstruments: [],
      isLoadingGenres: true,
      isLoadingInstruments: true,
      searchQuery: "",
      sortBy: "title",
      sortOrder: "asc",
      currentPage: 1,
      itemsPerPage: 16,
      worker: null,
      workerActive: false,
      genres: [],
      instruments: [],
      musicSheets: [],
      totalItems: 0, // Total number of items for pagination
      connectionStatus: 'disconnected', // Connection status for WebSocket
      reconnectAttempts: 0,
      maxReconnectAttempts: 5, // Maximum number of reconnection attempts
      lastWebSocketError: null, // Store the last WebSocket message
      isManualDisconnect: false, // Flag to indicate manual disconnection
      isLoading: false, // Track loading state for infinite scroll
      allItemsLoaded: false, // Track if all items are loaded
      chunkSize: 64, // Number of items to fetch per scroll
      isSidebarOpen: false, // Track sidebar state
    };
  },
  methods: {
    fetchMusicSheets(append = false) {
      if (this.isLoading || this.allItemsLoaded) return;

      this.isLoading = true; // Set loading state to true
    const params = {
      title: this.searchQuery,
      composer: this.searchQuery,
      genres: this.selectedGenres.join(","),
      instruments: this.selectedInstruments.join(","),
      _page: this.currentPage,
      _limit: this.itemsPerPage === 'all' ? this.chunkSize : this.itemsPerPage, // Use large limit for 'all'
      _sort: this.sortBy,
      _order: this.sortOrder,
    };
    //console.log("Fetching with params:", params); // Debug log

    api.getMusicSheets(params)
      .then(response => {
        const newSheets = response.data.data || response.data; // Handle both response formats
        this.totalItems = response.data.totalCount;

        if (append) {
          this.musicSheets = [...this.musicSheets, ...newSheets];
        } else {
          this.musicSheets = newSheets;
        }

        if (this.itemsPerPage === 'all' && this.musicSheets.length >= this.totalItems) {
          this.allItemsLoaded = true; // If 'all' is selected, mark all items as loaded
        } 
      })
      .catch(error => {
        console.error("Error fetching music sheets:", error);
      })
      .finally(() => {
        this.isLoading = false; // Reset loading state
      });
  },

  handleScroll() {
      if (this.itemsPerPage !== 'all' || this.isLoading || this.allItemsLoaded) return;

      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100;

      if (nearBottom) {
        this.currentPage += 1;
        this.fetchMusicSheets(true); // Append new items
      }
    },

  totalPages() {
      if (this.itemsPerPage === 'all') {
        return 1; // If all items are displayed, only one page
      }
      return Math.ceil(this.totalItems / (this.itemsPerPage || 1));
    },

  async fetchTags() {
    try {
      const tags = await getCurrentUserTags(); // Call the API to fetch tags
      this.genres = tags.genres || [];
      this.instruments = tags.instruments || [];
      this.isLoadingGenres = false; // Set loading state to false after fetching
      this.isLoadingInstruments = false; // Set loading state to false after fetching
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  },

    searchItems(query) {
      this.searchQuery = query;
      this.currentPage = 1;
      this.fetchMusicSheets();
    },
    clearSearch() {
      this.searchQuery = "";
      this.selectedGenres = [];
      this.selectedInstruments = [];
      this.currentPage = 1;
      this.fetchMusicSheets();
    },
    toggleGenre(genre) {
      if (this.selectedGenres.includes(genre)) {
        this.selectedGenres = this.selectedGenres.filter((item) => item !== genre);
      } else {
        this.selectedGenres.push(genre);
      }
      this.currentPage = 1; // Reset to first page when filtering
      this.fetchMusicSheets();
    },
    toggleInstrument(instrument) {
      if (this.selectedInstruments.includes(instrument)) {
        this.selectedInstruments = this.selectedInstruments.filter(
          (item) => item !== instrument
        );
      } else {
        this.selectedInstruments.push(instrument);
      }
      this.currentPage = 1; // Reset to first page when filtering
      this.fetchMusicSheets();
    },
    clearFilters() {
      this.selectedGenres = [];
      this.selectedInstruments = [];
      this.searchQuery = "";
      this.currentPage = 1; // Reset to first page when clearing filters
      this.fetchMusicSheets();
    },
    setSort(sortBy) {
      if (this.sortBy === sortBy) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortBy = sortBy;
        this.sortOrder = "asc";
      }
      this.fetchMusicSheets();
    },
    goToPage(page) {
      const pageNum = Number(page);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages()) {
        this.currentPage = pageNum;
        this.fetchMusicSheets(); // Use fetchMusicSheets directly with current component state
      }
    },
    changeItemsPerPage(itemsPerPage) {
      this.itemsPerPage = itemsPerPage === 'all' ? 1000: parseInt(itemsPerPage);
      this.currentPage = 1;
      this.fetchMusicSheets();
    },
    async toggleWorker() {
      const isRunning = !this.workerActive;
      try {
        await api.toggleWorker(isRunning);
        console.log(`Worker ${isRunning ? "started" : "stopped"}`); 
        this.workerActive = isRunning;
      } catch (error) {
        console.error('Error toggling worker:', error);
      }
    },

    setupWebSocket() {
      this.wsConnection = api.setupWebSocket((newSheet) => {
        this.musicSheets = [this.musicSheets, newSheet];
        console.log("New sheet added:", newSheet);
        this.totalItems += 1;
      });
    },

    isWebSocketOpen() {
      return this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN;
    },

    // In methods:
    openItem(id) {
      // Ensure we have a valid ID
      if (!id) {
        console.error('No ID provided');
        return;
      }
      
      // Convert to number if needed
      const numericId = Number(id);
      if (isNaN(numericId)) {
        console.error('Invalid ID format');
        return;
      }

      // Navigate using path format to ensure ID is passed
      this.$router.push(`/${numericId}`)
        .catch(err => {
          if (!err.message.includes('Avoided redundant navigation')) {
            console.error('Navigation error:', err);
          }
        });
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
  created() {
    this.fetchTags(); // Fetch tags when the component is created
    this.fetchMusicSheets(); // Fetch data when the component is created

      // Check initial generation status
    // api.getGenerationStatus().then(response => {
    //   this.workerActive = response.data.isGenerating;
    // });
    
    // Initialize WebSocket connection
    this.setupWebSocket();
  },
  beforeUnmount() {
    this.isManualDisconnect = true; // Set flag to indicate manual disconnection
    if (this.wsConnection) {
      this.wsConnection.close();
    }
  }
};
</script>

<style src="../assets/dashboard.css">
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  transition: margin-left 0.3s ease-in-out;
}

.main-content-full {
  margin-left: 0;
}

</style>