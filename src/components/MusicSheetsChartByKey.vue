<template>
    <div class="chart-container">
      <h2>Music Sheets by Key</h2>
      <component
        :is="'Bar'"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </template>
  
  <script>
  import { Bar } from "vue-chartjs";
  import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
  
  export default {
    name: "MusicSheetsChartByKey",
    components: {
      Bar,
    },
    props: {
      musicSheets: {
        type: Array,
        required: true,
      },
    },
    computed: {
      chartData() {
        const keyCounts = {};
        this.musicSheets.forEach((sheet) => {
          if (!sheet.key) return;
          keyCounts[sheet.key] = (keyCounts[sheet.key] || 0) + 1;
        });
  
        const labels = Object.keys(keyCounts).sort();
        const data = labels.map((key) => keyCounts[key]);
  
        return {
          labels,
          datasets: [
            {
              label: "Music Sheets by Key",
              backgroundColor: "#532b88",
              data,
              borderColor: "#ffffff",
              borderWidth: 1,
              hoverBackgroundColor: "#7a4fb3",
            },
          ],
        };
      },
      chartOptions() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.parsed.y} sheet${context.parsed.y !== 1 ? "s" : ""}`,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Key",
                color: "#ffffff",
                font: {
                  size: 12,
                },
              },
              ticks: {
                color: "#ffffff",
                font: {
                  size: 10,
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Music Sheets",
                color: "#ffffff",
                font: {
                  size: 12,
                },
              },
              ticks: {
                color: "#ffffff",
                stepSize: 1,
                precision: 0,
                font: {
                  size: 10,
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              beginAtZero: true,
            },
          },
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 300px;
    width: 100%;
    max-width: 600px;
    background-color: #2c3e50;
    border-radius: 8px;
    padding: 15px;
    margin: 20px auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  h2 {
    text-align: center;
    color: #ffffff;
    margin-bottom: 10px;
  }
  </style>