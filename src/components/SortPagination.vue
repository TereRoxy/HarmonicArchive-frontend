<template>
  <div class="sort-pagination-container">
    <div v-if="!disableSort" class="sort-label">
      <span>Sort by:</span>
    </div>
    <div v-if="!disableSort" class="sort-options">
      <button @click="$emit('setSort', 'title')">
        Name
        <span v-if="sortBy === 'title'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
      </button>
      <button @click="$emit('setSort', 'composer')">
        Composer
        <span v-if="sortBy === 'composer'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
      </button>
      <button @click="$emit('setSort', 'year')">
        Year
        <span v-if="sortBy === 'year'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
      </button>
    </div>

    <div v-if="itemsPerPage !== 'all' && !disableSort" class="pagination">
      <button
        data-testid="prev-page"
        @click="$emit('goToPage', currentPage - 1)"
        :disabled="currentPage === 1"
      >
        ← Previous
      </button>

      <!-- First page -->
      <button
        @click="$emit('goToPage', 1)"
        :class="{ active: currentPage === 1 }"
        data-testid="page-1-btn"
      >
        1
      </button>

      <!-- Ellipsis before sliding window -->
      <span v-if="pagesToShow[0] > 2">...</span>

      <!-- Sliding window pages -->
      <button
        v-for="page in pagesToShow"
        :key="page"
        :class="{ active: currentPage === page }"
        :data-testid="`page-${page}-btn`"
        @click="$emit('goToPage', page)"
      >
        {{ page }}
      </button>

      <!-- Ellipsis after sliding window -->
      <span v-if="pagesToShow[pagesToShow.length - 1] < totalPages - 1">...</span>

      <!-- Last page -->
      <button
        v-if="totalPages > 1"
        @click="$emit('goToPage', totalPages)"
        :class="{ active: currentPage === totalPages }"
        :data-testid="`page-${totalPages}-btn`"
      >
        {{ totalPages }}
      </button>

      <button
        data-testid="next-page"
        @click="$emit('goToPage', currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next →
      </button>

      <div v-if="!disableSort" class="items-per-page">
        <select
          :value="itemsPerPage"
          @change="$emit('changeItemsPerPage', $event.target.value)"
        >
          <option value="8">8 per page</option>
          <option value="16">16 per page</option>
          <option value="32">32 per page</option>
          <option value="64">64 per page</option>
          <option value="all">All</option>
        </select>
      </div>
    </div>
    <div v-else v-if="!disableSort" class="items-per-page">
      <select
        :value="itemsPerPage"
        @change="$emit('changeItemsPerPage', $event.target.value)"
      >
        <option value="8">8 per page</option>
        <option value="16">16 per page</option>
        <option value="32">32 per page</option>
        <option value="64">64 per page</option>
        <option value="all">All</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sortBy: String,
    sortOrder: String,
    currentPage: Number,
    disableSort: { type: Boolean, default: false },
    totalPages: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      default: 6,
    },
  },
  computed: {
    pagesToShow() {
      if (this.totalPages <= 1 || this.itemsPerPage === 'all') {
        return [];
      }

      const windowSize = 3; // Show 3 pages in the sliding window
      const halfWindow = Math.floor(windowSize / 2);
      let start = Math.max(2, this.currentPage - halfWindow);
      let end = Math.min(this.totalPages - 1, this.currentPage + halfWindow);

      // Adjust window near start or end
      if (this.currentPage <= halfWindow + 1) {
        end = Math.min(this.totalPages - 1, windowSize + 1);
      } else if (this.currentPage + halfWindow >= this.totalPages) {
        start = Math.max(2, this.totalPages - windowSize);
      }

      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      console.log("Pages to show:", pages);
      return pages;
    },
  },
};
</script>

<style scoped>

.sort-label {
  font-weight: bold;
}

.sort-options button:hover {
  background-color: #6a3dbb;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.pagination button {
  color: #34495e;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  background-color: #c8b1e4;
}

.pagination button:disabled {
  color: #34495e;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #532b88;
  font-weight: bold;
  border: 1px solid #f4effa;
}

.pagination span {
  color: #ffffff;
  margin: 0 5px;
}

.items-per-page select {
  background-color: #c8b1e4;
  color: #34495e;
  border: none;
  padding: 6px;
  cursor: pointer;
}

.items-per-page select:focus {
  outline: none;
  background-color: #c8b1e4;
}

/* Responsive */
@media (max-width: 768px) {
  .sort-pagination-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .sort-options {
    flex-wrap: wrap;
  }
  .pagination {
    justify-content: center;
  }
}
</style>