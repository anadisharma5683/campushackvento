import { useState, useEffect } from "react";
import { collection, query, onSnapshot, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Internship {
  id: string;
  title: string;
  company: string;
  stipend: number;
  deadline: string;
  eligibilityCriteria: {
    minGpa?: number;
    year?: number[];
    department?: string[];
  };
  applicants: number;
  status: "open" | "closed";
  description?: string;
  location?: string;
  type?: string;
}

export function useInternships(status?: "open" | "closed") {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, "internships"), orderBy("deadline", "asc"));
    
    if (status) {
      q = query(q, where("status", "==", status));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Internship[];
        setInternships(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching internships:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [status]);

  return { internships, loading };
}

