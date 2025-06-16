<template>
  <div class="charts-page">
    <!-- Sidebar for filtering options -->
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
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main content area for charts -->
    <div class="charts-container">
      <div class="header">
      <div class="header-content">
        <div class="archive-title">Statistics</div>
      </div>
    </div>

    <div class="charts-flex-container">
      <!-- Pie Chart: Music Sheets by Genre -->
      <MusicSheetsChart
        v-if="musicSheets.length"
        :musicSheets="musicSheets"
        chartType="pie"
      />

      <!-- Bar Chart: Music Sheets by Decade -->
      <MusicSheetsChart
        v-if="musicSheets.length"
        :musicSheets="musicSheets"
        chartType="bar"
      />

      <div class ="custom-chart">
      <!-- Custom Chart: Music Sheets by Key -->
      <MusicSheetsChartByKey
        v-if="musicSheets.length"
        :musicSheets="musicSheets"
      />
      </div>
    </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import Footer from "../components/Footer.vue";
import MusicSheetsChart from "../components/MusicSheetsChart.vue";
import MusicSheetsChartByKey from "../components/MusicSheetsChartByKey.vue";
import api from "../services/api";
import { getCurrentUserTags } from "../services/api";


export default {
  name: "ChartsPage",
  components: {
    Sidebar,
    Footer,
    MusicSheetsChart,
    MusicSheetsChartByKey,
  },
  data() {
    return {
      musicSheets: [], // Original music sheets data
      filteredMusicSheets: [], // Filtered music sheets data
      selectedGenres: [],
      selectedInstruments: [],
      isLoadingGenres: true,
      isLoadingInstruments: true,
      genres: [],
      instruments: [],
      musicSheets: [],
      isSidebarOpen: false, // Track sidebar state
    };
  },
  created() {
    // Fetch the music sheets data (replace with your API call)
    this.fetchTags(); // Fetch genres and instruments
    this.fetchMusicSheets();
  },
  methods: {
    fetchMusicSheets() {
    const params = {
      title: "",
      composer: "",
      genres: this.selectedGenres.join(","),
      instruments: this.selectedInstruments.join(","),
      _page: 1,
      _limit: 1000,
      _sort: "title",
      _order: "asc",
    };
    //console.log("Fetching with params:", params); // Debug log

    api.getMusicSheets(params)
      .then(response => {
        this.musicSheets = response.data.data || response.data; // Handle both response formats
        this.totalItems = response.data.totalCount;
      })
      .catch(error => {
        console.error("Error fetching music sheets:", error);
      })
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
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
};
</script>

<style scoped>
.charts-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f4effa;
}

.charts-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f4effa; /* Set the background color for the charts container */
}

.custom-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the custom chart */
  justify-content: center; /* Center the custom chart vertically */
}

.charts-flex-container {
  display: flex;
  flex-wrap: wrap; /* Allow charts to wrap to the next row if needed */
  gap: 20px; /* Add spacing between charts */
  justify-content: center; /* Center charts horizontally */
  align-items: flex-start; /* Align charts to the top */
}

.charts-flex-container > * {
  background-color: #9b72cf; /* Set the background color of each chart */
  color: white;
  border-radius: 8px; /* Optional: Add rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Add a shadow for better visibility */
  padding: 10px; /* Add padding inside the chart container */
}

/* Specific layout for the first two charts in one row and the third below */
.charts-flex-container > :nth-child(1),
.charts-flex-container > :nth-child(2) {
  flex: 1 1 calc(50% - 20px); /* Each chart takes 50% of the row */
  max-width: calc(50% - 20px); /* Prevent charts from exceeding 50% width */
}

.charts-flex-container > :nth-child(3) {
  flex: 1 1 100%; /* The third chart takes the full width */
  max-width: 100%; /* Prevent the third chart from exceeding full width */
}

</style>