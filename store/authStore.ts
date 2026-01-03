import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "student" | "admin" | "tpo";
  profile?: {
    gpa?: number;
    resumeURL?: string;
    skills?: string[];
    department?: string;
    year?: number;
  };
  preferences?: {
    jobTypes?: string[];
    location?: string;
  };
}

interface AuthState {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  fetchUserProfile: (uid: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  loading: true,
  setUser: (user) => set({ user }),
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setLoading: (loading) => set({ loading }),
  fetchUserProfile: async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        set({ user: { uid, ...userDoc.data() } as UserProfile });
      } else {
        // Create default student profile if doesn't exist
        const defaultProfile: UserProfile = {
          uid,
          email: null,
          displayName: null,
          role: "student",
        };
        await setDoc(doc(db, "users", uid), defaultProfile);
        set({ user: defaultProfile });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
}));

