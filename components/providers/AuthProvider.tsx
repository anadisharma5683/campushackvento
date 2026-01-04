"use client";

import { useEffect } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setFirebaseUser, setLoading, fetchUserProfile } = useAuthStore();

  useEffect(() => {
    // Handle redirect result when returning from OAuth
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          setFirebaseUser(result.user);
          try {
            await fetchUserProfile(result.user.uid);
          } catch (error) {
            console.error("Error fetching user profile after redirect:", error);
          }
        }
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    };

    // Only check redirect result on initial load if we have OAuth parameters
    if (typeof window !== 'undefined' && (window.location.search.includes('state') || window.location.search.includes('code'))) {
      handleRedirectResult();
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        try {
          await fetchUserProfile(firebaseUser.uid);
        } catch (error) {
          console.error("Error fetching user profile in AuthProvider:", error);
        }
      } else {
        useAuthStore.getState().setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setLoading, fetchUserProfile]);

  return <>{children}</>;
}