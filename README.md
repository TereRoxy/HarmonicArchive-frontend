# HarmonicArchive - Music Sheet Management Application

A modern, responsive web application for managing, uploading, and viewing music sheets. Built with Vue 3, Vite, and powered by real-time features using WebSockets.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Design Patterns & Technologies](#design-patterns--technologies)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Configuration](#configuration)

## Overview

HarmonicArchive is a comprehensive music sheet management system that allows users to:
- Create and manage user accounts
- Upload music sheets in PDF format
- Browse and search through a collection of music sheets
- View detailed information about compositions
- Generate analytics and charts for music statistics
- Access real-time updates through WebSocket connections

The application is built as a modern Single Page Application (SPA) with a focus on user experience and performance.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Vue 3 Frontend (SPA)                  │
├─────────────────────────────────────────────────────────┤
│  Components Layer (Dashboard, Upload, Charts, etc.)     │
├─────────────────────────────────────────────────────────┤
│  Services Layer (API Client, WebSocket Management)      │
├─────────────────────────────────────────────────────────┤
│  State Management (Reactive State, Event Bus)           │
├─────────────────────────────────────────────────────────┤
│  Web Workers (Background Tasks - Music Sheet Generation)│
└─────────────────────────────────────────────────────────┘
         │                │                 │
         ▼                ▼                 ▼
    REST API         WebSocket          Local Storage
    Backend          Server             (Auth Token)
```

### Layered Architecture

1. **Presentation Layer**: Vue components for UI rendering
2. **Service Layer**: API clients and business logic
3. **State Layer**: Centralized reactive state management
4. **Worker Layer**: Background processing tasks

## Features & Functionalities

### Core Features

#### 1. **User Management**
   - User Registration with username, email, and password
   - User Login with JWT token-based authentication
   - User Account Management page
   - Role-based access control (normal user role)

#### 2. **Music Sheet Management**
   - **Upload**: Upload music sheets with metadata (title, composer, year, key, instruments, genre)
   - **Browse**: View all uploaded music sheets in a grid layout with pagination
   - **View**: Detailed view of individual music sheets with PDF rendering
   - **Search & Filter**: Sort and filter music sheets by various criteria

#### 3. **Analytics & Charts**
   - Charts by music key distribution
   - Statistical overview of the music sheet collection
   - Real-time chart updates

#### 4. **Dashboard**
   - Overview of user's music sheet collection
   - Quick access to recent sheets
   - Navigation to upload and analytics features

#### 5. **PDF Viewing**
   - Built-in PDF viewer for music sheets
   - Support for multiple PDF libraries (pdf-viewer-vue, vue3-pdfjs)

### User Flows

- **Authentication Flow**: Login/Register --> Dashboard
- **Upload Flow**: Dashboard --> Upload --> Server Validation --> Collection Update
- **Discovery Flow**: Dashboard --> Browse --> Filter/Sort --> View Details
- **Analytics Flow**: Dashboard --> Charts --> View Statistics

## Design Patterns & Technologies

### Architectural Patterns

#### 1. **Component-Based Architecture**
- Modular, reusable Vue components
- Separation of concerns: UI logic, business logic, and presentation
- Example: `Dashboard.vue`, `UploadMusicScore.vue`, `ViewMusicScore.vue`

#### 2. **Service/API Abstraction Layer**
- Centralized API client (`services/api.js`)
- Separate instances for backend API and IMSLP external API
- Axios-based HTTP client with credential support
- Consistent error handling and token management

```
// API service structure
├── api.js              (Main backend API)
├── imslpApi            (External IMSLP service)
└── serverStatus.js     (Health checks)
```

#### 3. **Reactive State Management**
- Vue 3's native `reactive()` for centralized state
- `sharedState.js` manages application-wide state
- Two-way reactive binding with components

```javascript
// Shared state structure
export const state = reactive({
  musicSheets: [],
  selectedMusicSheet: null
});
```

#### 4. **Event-Driven Communication**
- Event emitter pattern using **mitt** library
- Decoupled component communication
- Global event bus for cross-component events

```javascript
// Event bus usage
import emitter from './eventBus.js';
emitter.on('eventName', (data) => {...});
emitter.emit('eventName', data);
```

#### 5. **Web Worker Pattern**
- Background processing for data-intensive tasks
- Prevents UI blocking during music sheet generation
- Worker file: `workers/generateMusicSheets.worker.js`
- Generates fake data using Faker.js library

#### 6. **Routing with Navigation Guards**
- Vue Router 4 for client-side routing
- Route guards for validation (e.g., numeric ID validation)
- Dynamic route parameters for music sheet viewing
- Lazy-loaded components for performance optimization

```javascript
// Guard example: ID validation before route navigation
beforeEnter: (to, from, next) => {
  const id = Number(to.params.id);
  if (isNaN(id)) {
    next({ name: "Home" });
  } else {
    next();
  }
}
```

#### 7. **Real-Time Communication**
- WebSocket support (ws library) for real-time updates
- Integration with backend for live data synchronization

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | Vue 3 | Reactive, component-based UI |
| **Build Tool** | Vite | Fast bundling and dev server |
| **Routing** | Vue Router 4 | Client-side routing and navigation |
| **HTTP Client** | Axios | API communication with credentials |
| **State Management** | Vue reactive() | Centralized reactive state |
| **Event System** | mitt | Lightweight event emitter |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Charts** | Chart.js + Vue-ChartJS | Data visualization |
| **PDF Rendering** | pdf-viewer-vue, vue3-pdfjs | PDF document display |
| **Real-Time** | WebSocket (ws) | Live communication |
| **Testing** | Vitest | Unit testing framework |
| **Analytics** | Vue-Gtag | Google Analytics integration |
| **Dev Data** | Faker.js | Mock data generation |

## Project Structure

```
├── src/
│   ├── components/              # Reusable Vue components
│   │   ├── Dashboard.vue        # Main dashboard view
│   │   ├── Header.vue           # Top navigation bar
│   │   ├── Sidebar.vue          # Side navigation
│   │   ├── Footer.vue           # Footer component
│   │   ├── UploadMusicScore.vue # Upload form
│   │   ├── ViewMusicScore.vue   # Music sheet viewer
│   │   ├── MusicGrid.vue        # Sheet grid display
│   │   ├── SortPagination.vue   # Sort and pagination
│   │   ├── MusicSheetsChart.vue # Statistics charts
│   │   ├── MyAccount.vue        # User account page
│   │   └── ...
│   ├── views/                   # Page-level components
│   │   ├── Home.vue             # Dashboard page
│   │   ├── Upload.vue           # Upload page
│   │   ├── View.vue             # View page wrapper
│   │   ├── ChartsPage.vue       # Analytics page
│   │   └── LoginRegister.vue    # Auth page
│   ├── services/                # Business logic & APIs
│   │   ├── api.js               # Axios HTTP client
│   │   └── serverStatus.js      # Server health checks
│   ├── workers/                 # Web Worker threads
│   │   └── generateMusicSheets.worker.js
│   ├── assets/                  # Static assets & styles
│   │   ├── images/
│   │   ├── dashboard.css
│   │   ├── upload.css
│   │   └── music_score_view.css
│   ├── App.vue                  # Root component
│   ├── main.js                  # App initialization
│   ├── router.js                # Route configuration
│   ├── eventBus.js              # Event emitter
│   ├── sharedState.js           # Global state
│   └── style.css                # Global styles
├── public/                      # Static files
├── config.js                    # Environment configuration
├── vite.config.js               # Vite configuration
├── vitest.config.js             # Testing configuration
├── package.json                 # Dependencies
└── index.html                   # HTML entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd HarmonicArchive-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create a `config.js` file in the root directory:
```javascript
export const BASE_URL = 'http://your-backend-api-url';
export const IMSLP_API_URL = 'https://imslp-api-url';
export const BASE_IP = '0.0.0.0';
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
npm run start

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# View coverage report
npm run coverage:view
```

### Development Server Configuration

The Vite dev server is configured to:
- Listen on all network interfaces (`0.0.0.0`)
- Use port 5173 (or `PORT` environment variable)
- Support Web Workers in ES module format
- Include Tailwind CSS plugin

### Working with Components

Example component structure:
```vue
<template>
  <!-- HTML structure -->
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { state } from '../sharedState.js';
import emitter from '../eventBus.js';

export default {
  name: 'ComponentName',
  setup() {
    const localData = ref(null);
    
    onMounted(() => {
      // Fetch data or subscribe to events
      emitter.on('eventName', handleEvent);
    });
    
    return { localData, state };
  }
};
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### API Integration

Use the centralized API service:
```javascript
import { login, register, getAllMusicSheets } from '@/services/api.js';

// In components
try {
  const result = await login(username, password);
  console.log('Login successful:', result);
} catch (error) {
  console.error('Login failed:', error);
}
```

## Testing

### Test Setup

The project uses Vitest with:
- Vue Test Utils for component testing
- JSDOM for DOM simulation
- Coverage reporting with V8

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode - re-run on file changes
npm run test:watch

# Generate coverage report
npm run test:coverage

# View HTML coverage report
npm run coverage:view
```

### Example Test

```javascript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MyComponent from '@/components/MyComponent.vue';

describe('MyComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(MyComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
```

## Building for Production

### Production Build

```bash
npm run build
```

This generates an optimized build:
- Minified JavaScript and CSS
- Code splitting for better caching
- Asset optimization
- ES module format for compatibility

### Build Output

- **Directory**: `dist/`
- **Main bundle**: `dist/index.html` + assets
- **Format**: ES modules
- **Size**: Optimized with tree-shaking

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

## Deployment

### Railway Deployment

The project is configured for Railway platform deployment:

#### Configuration
```javascript
// vite.config.js
preview: {
  allowedHosts: ["harmonic-archive.up.railway.app"]
}
```

#### Railway Environment Variables

Set these in Railway dashboard:
```
PORT=5173
VITE_BASE_URL=http://your-backend-api
VITE_IMSLP_API_URL=https://imslp-api-url
```

#### Deployment Steps

1. **Push to repository**
```bash
git push origin main
```

2. **Railway Deployment**
   - Connect GitHub repository to Railway
   - Configure environment variables in Railway dashboard
   - Railway auto-deploys on push

3. **Build Command**
```bash
npm run build
```

4. **Start Command**
```bash
npm run preview
```

### Alternative Deployment Options

#### **Vercel**
```bash
vercel
```
- Automatically detects Vite project
- Zero-config deployment
- Environment variables in Vercel dashboard

#### **Netlify**
```bash
npm run build
# Deploy the dist/ folder
```

#### **Docker Deployment**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "preview"]
```

Build and run:
```bash
docker build -t harmonic-archive .
docker run -p 5173:5173 harmonic-archive
```

#### **Traditional Server (Nginx/Apache)**

1. Build the project: `npm run build`
2. Upload `dist/` folder to server
3. Configure web server to serve `dist/index.html` for SPA routing

**Nginx Configuration Example**:
```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Configuration

### Environment Configuration

Edit `config.js` to customize:
```javascript
export const BASE_URL = 'http://localhost:5000'; // Backend API URL
export const IMSLP_API_URL = 'https://imslp-api.example.com'; // IMSLP service
export const BASE_IP = '0.0.0.0'; // Dev server IP
```

### Vite Configuration

Customize build behavior in `vite.config.js`:
- Plugins: Vue, Tailwind CSS
- Build options: Output format, rollup options
- Server options: Port, host, CORS
- Preview options: Allowed hosts

### Google Analytics

Google Analytics is configured in `main.js`:
```javascript
app.use(VueGtag, {
  property: {
    id: "G-0G20GXPF97" // Replace with your GA ID
  }
});
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

### Implemented Optimizations

1. **Code Splitting**: Lazy-loaded routes reduce initial bundle size
2. **Web Workers**: Heavy computations run in background threads
3. **Vite Build**: Fast bundling with ES modules and tree-shaking
4. **PDF Rendering**: Optional PDF libraries to minimize bundle size
5. **Tailwind CSS**: Just-in-time compilation of used styles

### Monitoring

- **Google Analytics**: Track user behavior and performance
- **Network**: Axios interceptors for request/response logging
- **Bundle Analysis**: Use `vite-plugin-visualizer` for bundle inspection


**Last Updated**: 2026
**Framework Version**: Vue 3
**Build Tool**: Vite 6+
