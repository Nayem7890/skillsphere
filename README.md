# SkillSphere – Online Learning Platform

## Project Overview

SkillSphere is a full-stack online learning platform that connects instructors and learners. Instructors can create, manage, and share courses, while learners can browse, search, filter, and enroll in courses. The platform features modern authentication, real-time course management, and a responsive user interface built with React and Firebase.

## Visuals

### 🏠 Home Page
![Home Page Screenshot](https://raw.githubusercontent.com/Nayem7890/hero-apps/main/public/skillsphere.png)


## Tech Stack

### Frontend
- **React 19.2.0** – UI library
- **Vite 7.2.2** – Build tool and dev server
- **React Router 7.9.5** – Client-side routing
- **Tailwind CSS 4.1.17** – Utility-first CSS framework
- **DaisyUI 5.4.7** – Tailwind component library

### State Management & Data Fetching
- **TanStack Query (React Query) 4.42.0** – Server state management and data fetching
- **Axios 1.13.2** – HTTP client

### Authentication
- **Firebase 12.5.0** – Authentication (Email/Password + Google Sign-In)

### UI/UX Enhancements
- **Motion 12.23.24** (Framer Motion) – Animation library
- **AOS 2.3.4** – Animate on scroll library
- **React Hot Toast 2.6.0** – Toast notifications
- **React Icons 5.9.0** – Icon library

### Backend API
- Node.js with Express
- MongoDB (native driver)

## Key Features

- **Authentication System**
  - Email/Password authentication
  - Google Sign-In integration
  - Protected routes with persistent authentication

- **Course Management**
  - Instructors can create, update, and delete courses
  - Course details with full CRUD operations
  - Data persistence in MongoDB

- **Course Discovery**
  - Browse all available courses
  - Search functionality
  - Sort courses by various criteria
  - Category filtering

- **Dashboard**
  - "My Courses" – View and manage courses created by the instructor
  - "My Enrolled" – Track enrolled courses
  - Quick actions with confirmation dialogs

- **User Experience**
  - Responsive design with Tailwind CSS and DaisyUI
  - Animated sections using Framer Motion and AOS
  - Toast notifications for user feedback
  - Modern, minimal UI design

- **Performance**
  - Efficient data fetching and caching with TanStack Query
  - Optimized API calls with Axios interceptors
  - Fast development experience with Vite

## Dependencies

### Production Dependencies

```json
{
  "@tailwindcss/vite": "^4.1.17",
  "@tanstack/react-query": "^4.42.0",
  "aos": "^2.3.4",
  "axios": "^1.13.2",
  "firebase": "^12.5.0",
  "motion": "^12.23.24",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-hot-toast": "^2.6.0",
  "react-icons": "^5.9.0",
  "react-router": "^7.9.5",
  "tailwindcss": "^4.1.17"
}
```

### Development Dependencies

```json
{
  "@eslint/js": "^9.39.1",
  "@types/react": "^19.2.2",
  "@types/react-dom": "^19.2.2",
  "@vitejs/plugin-react": "^5.1.0",
  "daisyui": "^5.4.7",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.24",
  "globals": "^16.5.0",
  "vite": "^7.2.2"
}
```

## Local Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Git

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nayem7890/skillsphere.git
   cd online-learning-platform-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```env
     VITE_API_URL=http://localhost:3000
     # Or use the production API URL:
     # VITE_API_URL=https://skillsphere-server-rosy.vercel.app
     ```
   - Configure Firebase credentials in `src/firebase/firebase.config.js` (or use environment variables)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   - The app will be available at `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Links

- **Live Demo**: [https://amazing-bonbon-c86e7a.netlify.app/](https://amazing-bonbon-c86e7a.netlify.app/)
- **API Server**: [https://skillsphere-server-rosy.vercel.app](https://skillsphere-server-rosy.vercel.app)

---

**Note**: Ensure the backend API server is running or use the production API URL for full functionality.
