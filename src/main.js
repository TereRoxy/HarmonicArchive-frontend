// filepath: music-sheet-app/src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueGtag from "vue-gtag-next"

const app = createApp(App);
import { faker } from "@faker-js/faker";

// Use the router
app.use(router);

// Use VueGtag for Google Analytics
app.use(VueGtag, {
    property: {
      id: "G-0G20GXPF97", // Replace with your Google Analytics Measurement ID
    },
  });

// Mount the app
app.mount("#app");