<template>
  <div class="header">
    <div class="header-content">
      <div class="archive-title">My Archive</div>
      <div class="search-container">
        <input
          v-model="localSearchQuery"
          @keyup.enter="handleSearch"
          placeholder="Search by Composer or Title"
          class="search-input"
        />
        <button @click="clearSearch" class="clear-search-btn">❌</button>
      </div>
      <div v-if="showExternalSearchPrompt" class="external-search-prompt">
        <p>No results found. Would you like to search IMSLP instead for "{{ localSearchQuery }}"?</p>
        <div class="external-search-prompt-buttons">
          <button @click="performExternalSearch" class="external-search-btn">Search IMSLP</button>
          <button @click="dismissExternalSearch" class="dismiss-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api.js'; // Adjust the import path as necessary

export default {
  props: ['searchQuery'],
  data() {
    return {
      localSearchQuery: this.searchQuery,
      showExternalSearchPrompt: false,
      searchResults: [],
    };
  },
  watch: {
    searchQuery(newVal) {
      this.localSearchQuery = newVal;
    },
  },
  methods: {
    async handleSearch() {
      this.showExternalSearchPrompt = false;
      try {
        // Perform local search first
        const response = await api.getMusicSheets({ title: this.localSearchQuery, composer: this.localSearchQuery });
        console.log('Local search response:', response.data);
        this.searchResults = response.data.data || [];
        const totalResults = response.data.data.length || 0;
        console.log('Search results:', this.searchResults);
        console.log('Total results:',   totalResults);
        
        // Check if results are empty or insufficient
        if (this.searchResults.length < 1) {
          this.showExternalSearchPrompt = true;
        } else {
          this.$emit('search', this.localSearchQuery, this.searchResults, totalResults);
        }
      } catch (error) {
        console.error('Local search error:', error);
        // Show external search prompt if local search fails or returns no results
        this.showExternalSearchPrompt = true;
      }
    },
    async performExternalSearch() {
      try {
        // Call IMSLP search endpoint with title only
        const response = await api.searchIMSLP({ title: this.localSearchQuery });
        console.log('IMSLP search response:', response);
        this.searchResults = response.results;
        const totalResults = response.totalResults || 0;
        this.showExternalSearchPrompt = false;
        this.$emit('search', this.localSearchQuery, this.searchResults, totalResults);
      } catch (error) {
        console.error('IMSLP search error:', error);
        this.$emit('searchError', 'Failed to fetch results from IMSLP');
      }
    },
    redirectToUrl(url) {
      window.open(url, '_blank'); // Open the URL in a new tab
    },
    dismissExternalSearch() {
      this.showExternalSearchPrompt = false;
      this.$emit('search', this.localSearchQuery, this.searchResults);
    },
    clearSearch() {
      this.localSearchQuery = '';
      this.showExternalSearchPrompt = false;
      this.searchResults = [];
      this.$emit('clearSearch');
    },
  },
};
</script>

<style scoped>

.archive-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.external-search-prompt {
  margin: 1rem;
  padding: 0.5rem; /* Reduce padding to make the prompt smaller */
  
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center-align content */
}

.external-search-btn,
.dismiss-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.external-search-btn {
  background: #9b72cf;
  color: white;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.dismiss-btn {
  background-color: #6c757d;
  color: white;
}

.external-search-prompt-buttons {
  display: flex; /* Use flex layout for buttons */
  gap: 0.5rem; /* Add spacing between buttons */
  width: 100%; /* Ensure buttons stretch evenly */
  justify-content: center; /* Center-align buttons */
}
</style>