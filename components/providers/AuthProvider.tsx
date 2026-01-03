"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setFirebaseUser, setLoading, fetchUserProfile } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser.uid);
      } else {
        useAuthStore.getState().setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setLoading, fetchUserProfile]);

  return <>{children}</>;
}

