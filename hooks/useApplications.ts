import { useState, useEffect } from "react";
import { collection, query, onSnapshot, where, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

export interface Application {
  id: string;
  studentId: string;
  internshipId: string;
  status: "applied" | "interviewing" | "offer_received" | "rejected" | "accepted";
  timeline: Array<{
    timestamp: string;
    event: string;
    description?: string;
  }>;
  documents?: string[];
  createdAt: string;
  internship?: {
    title: string;
    company: string;
  };
}

export function useApplications(studentId?: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const id = studentId || user?.uid;
    if (!id) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "applications"),
      where("studentId", "==", id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const appData = { id: docSnap.id, ...docSnap.data() } as Application;
            // Fetch internship details
            if (appData.internshipId) {
              const internshipRef = doc(db, "internships", appData.internshipId);
              const internshipSnap = await getDoc(internshipRef);
              if (internshipSnap.exists()) {
                appData.internship = {
                  title: internshipSnap.data().title,
                  company: internshipSnap.data().company,
                };
              }
            }
            return appData;
          })
        );
        setApplications(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching applications:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [studentId, user?.uid]);

  return { applications, loading };
}

