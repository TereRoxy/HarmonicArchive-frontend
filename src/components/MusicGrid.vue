<template>
  <div class="music-grid">
    <div
      v-for="(musicSheet, index) in musicSheets"
      :key="musicSheet.id || musicSheet.url"
      class="music-item"
      @click="$emit('openItem', isExternalSearch ? musicSheet.url : musicSheet.id)"
    >
      <div class="item-info">
        <h3>{{ musicSheet.title }}</h3>
        <p><strong>Composer:</strong> {{ musicSheet.composer || 'Unknown' }}</p>
        <p v-if="!isExternalSearch">
          <strong>Genres:</strong> {{ musicSheet.genres?.join(', ') || 'None' }}
        </p>
        <p v-if="!isExternalSearch">
          <strong>Instruments:</strong> {{ musicSheet.instruments?.join(', ') || 'None' }}
        </p>
        <p v-if="!isExternalSearch">
          <span
            class="year-dot"
            :style="{ backgroundColor: getYearColor(musicSheet.year) }"
          ></span>
          <strong>Year:</strong> {{ musicSheet.year || 'Unknown' }}
        </p>
        <p v-if="isExternalSearch" class="external-source">
          <span class="result-tag">IMSLP</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    musicSheets: {
      type: Array,
      required: true,
      default: () => [],
    },
    isExternalSearch: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getYearColor(year) {
      if (!year) return 'gray';
      const mean = 1985;
      const stdDev = 20;
      if (year >= mean - stdDev && year <= mean + stdDev) {
        return "yellow";
      } else if (year > mean + stdDev) {
        return "green";
      } else {
        return "red";
      }
    },
  },
};
</script>

<style scoped>

.year-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.result-tag {
  background-color: #532b88;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.external-source {
  margin-top: 0.5rem;
}
</style>