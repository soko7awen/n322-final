# N322 Final — Productivity App

Live build: [Vercel](https://n322-final-project.vercel.app)

## Overview

A mobile-first Expo/React Native app that serves as my final project. Includes email/password auth, protected content, and CRUD for user-scoped data (notes, tasks, mood journal).

## Quick start

1) Install dependencies  
`npm install`

2) Configure Firebase (Expo public env vars)  
Create `.env.local` or export in your shell:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

3) Run the app (Expo Go / simulator / device)  
`npx expo start`

## Features

- **Authentication**: Register/login/logout with Firebase Auth; main content redirects to login when signed out.
- **CRUD**: Firestore collections scoped by `userId`; create/read/update/delete for Notes, Tasks, and Mood Journal entries (each with title + details/fields).
- **Protected screens**: Hub + tools require auth; routes guard redirect to `/login` if unauthenticated.
- **Styling/UX**: Themed light/dark palettes, styled cards/buttons, tap animations, loading states, and inline success/error banners; web-safe delete confirms.
- **Navigation**: Tab layout with Hub triangle launcher; stack navigation per tool with back button.
- **Dashboard**: Personalized greeting (uses display name or email prefix) plus widgets linking to each tool with item counts.
- **Profile**: Edit and save display name to Firebase.

## App structure

- `app/_layout.jsx` – Root stack, theming, auth provider.
- `app/(tabs)/_layout.jsx` – Tabs (Dashboard, Hub, Settings).
- `app/(tabs)/index.jsx` – Dashboard widgets + greeting.
- `app/(tabs)/hub/*.jsx` – Hub launcher, Notes/Tasks/Mood screens, Task form.
- `app/login.jsx`, `app/register.jsx` – Auth screens.
- `app/(tabs)/settings/profile.jsx` – Display name + logout.
- `src/auth/AuthContext.js` – Auth state, guard helpers.
- `src/firebase/firebaseConfig.js` – Firebase init (env-driven).
- `components/*` – Buttons, status banners, tap animations, theme toggle.
