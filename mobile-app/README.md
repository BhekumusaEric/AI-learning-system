# IOAI Training Grounds Mobile App

A React Native mobile application for the IOAI Training Grounds learning platform, built with Expo and designed for cross-platform deployment to iOS and Android app stores.

## Features

- **Cross-Platform**: Built with React Native and Expo for iOS and Android
- **Offline Support**: Download content for offline learning
- **Progress Tracking**: Comprehensive learning analytics and progress monitoring
- **Interactive Content**: Code playgrounds, assessments, and multimedia content
- **User Authentication**: Secure login with JWT tokens
- **Scalable Architecture**: Clean separation of concerns with Redux and RTK Query

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **API Client**: Axios (via RTK Query)
- **Local Storage**: AsyncStorage + SQLite
- **Backend**: FastAPI (existing infrastructure)

## Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Basic components (Button, Card, etc.)
│   │   ├── layout/         # Layout components
│   │   ├── forms/          # Form components
│   │   └── content/        # Content-specific components
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── main/           # Main app screens
│   │   ├── content/        # Content viewing screens
│   │   └── profile/        # Profile screens
│   ├── services/           # API services (RTK Query)
│   ├── store/              # Redux store and slices
│   ├── navigation/         # Navigation configuration
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # App constants and configuration
│   ├── theme/              # Theme configuration
│   └── utils/              # Utility functions
├── assets/                 # Static assets (images, fonts)
├── App.tsx                 # Main app component
├── app.json                # Expo configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

3. **Run on device/emulator:**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web (for testing)
   npm run web
   ```

### Backend Integration

The mobile app is designed to work with the existing IOAI Training Grounds backend. Make sure the backend API is running and accessible.

Update the API base URL in `src/constants/index.ts` if needed:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-api-domain.com/api',
  // ... other config
};
```

## Development

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Expo configuration
- **Testing**: Jest with React Native Testing Library

Run linting:
```bash
npm run lint
```

Run type checking:
```bash
npm run typecheck
```

Run tests:
```bash
npm test
```

### Architecture Principles

1. **Separation of Concerns**: Clear boundaries between UI, business logic, and data layers
2. **Type Safety**: Comprehensive TypeScript usage throughout
3. **Reusability**: Modular components and services
4. **Performance**: Optimized rendering and state management
5. **Offline-First**: Content caching and offline functionality

### State Management

The app uses Redux Toolkit with RTK Query for API state management:

- **Auth State**: User authentication and session management
- **UI State**: Loading states, errors, and theme preferences
- **Offline State**: Cached content and sync status
- **API State**: Automatic caching, background updates, and error handling

### Navigation

Built with React Navigation:

- **Stack Navigation**: Screen transitions and modals
- **Tab Navigation**: Main app sections (Grounds, Content, Progress, Profile)
- **Type Safety**: Full TypeScript support for navigation params

## Deployment

### Building for Production

1. **Configure app.json** with your app details:
   ```json
   {
     "expo": {
       "name": "IOAI Training Grounds",
       "slug": "ioai-training-grounds",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain"
       }
     }
   }
   ```

2. **Build for stores:**
   ```bash
   # Build for iOS
   expo build:ios

   # Build for Android
   expo build:android
   ```

3. **Submit to app stores** using the generated build artifacts.

### Environment Configuration

Create environment-specific configurations:

- **Development**: Local backend, debug features enabled
- **Staging**: Staging backend, some debug features
- **Production**: Production backend, optimized and secure

## Contributing

1. Follow the established code style and architecture patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure type safety and proper error handling
5. Test on both iOS and Android platforms

## License

This project is part of the IOAI Training Grounds platform.