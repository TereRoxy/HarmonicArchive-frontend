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
        <p>No or few results found. Would you like to search IMSLP for "{{ localSearchQuery }}"?</p>
        <button @click="performExternalSearch" class="external-search-btn">Search IMSLP</button>
        <button @click="dismissExternalSearch" class="dismiss-btn">Cancel</button>
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
        const response = await api.getMusicSheets({ title: this.localSearchQuery });
        this.searchResults = response.data.results || [];
        
        // Check if results are empty or insufficient (e.g., less than 3)
        if (this.searchResults.length < 3) {
          this.showExternalSearchPrompt = true;
        } else {
          this.$emit('search', this.localSearchQuery, this.searchResults);
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
        this.showExternalSearchPrompt = false;
        this.$emit('search', this.localSearchQuery, this.searchResults);
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
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.external-search-btn,
.dismiss-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.external-search-btn {
  background-color: #007bff;
  color: white;
}

.dismiss-btn {
  background-color: #6c757d;
  color: white;
}
</style>