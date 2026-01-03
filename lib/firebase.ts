// lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  };
}

function initializeFirebase(): FirebaseApp {
  if (app) {
    return app;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    return app;
  }

  const config = getFirebaseConfig();
  
  // Check if we're in a build environment without proper config
  const isBuildTime = typeof window === "undefined";
  const hasConfig = config.apiKey && config.authDomain && config.projectId;
  
  if (isBuildTime && !hasConfig) {
    // During build without config, use placeholder values
    // This allows the build to complete without errors
    app = initializeApp({
      apiKey: "build-placeholder",
      authDomain: "build-placeholder.firebaseapp.com",
      projectId: "build-placeholder",
      storageBucket: "build-placeholder.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:placeholder",
    });
  } else if (!hasConfig && typeof window !== "undefined") {
    // Runtime validation - only in client-side
    console.error("Firebase Config:", {
      apiKey: config.apiKey ? "✓" : "✗",
      authDomain: config.authDomain ? "✓" : "✗",
      projectId: config.projectId ? "✓" : "✗",
    });
    throw new Error(
      "Missing Firebase configuration. Please check your environment variables. Make sure to restart the dev server after creating .env.local"
    );
  } else {
    app = initializeApp(config);
  }

  return app;
}

function getAuthInstance(): Auth {
  if (!authInstance) {
    const firebaseApp = initializeFirebase();
    authInstance = getAuth(firebaseApp);
  }
  return authInstance;
}

function getDbInstance(): Firestore {
  if (!dbInstance) {
    const firebaseApp = initializeFirebase();
    dbInstance = getFirestore(firebaseApp);
  }
  return dbInstance;
}

function getStorageInstance(): FirebaseStorage {
  if (!storageInstance) {
    const firebaseApp = initializeFirebase();
    storageInstance = getStorage(firebaseApp);
  }
  return storageInstance;
}

// Initialize lazily - only when accessed
export const auth = getAuthInstance();
export const db = getDbInstance();
export const storage = getStorageInstance();
