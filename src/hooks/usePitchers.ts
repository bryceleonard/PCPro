import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Pitcher } from '../types/pitcher';

export const usePitchers = (teamId: string) => {
  const [pitchers, setPitchers] = useState<Pitcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPitchers = async () => {
    try {
      const pitchersCollection = collection(db, 'pitchers');
      const q = query(pitchersCollection, where('teamId', '==', teamId));
      const pitchersSnapshot = await getDocs(q);
      const pitchersData = pitchersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Pitcher[];
      setPitchers(pitchersData);
    } catch (err) {
      setError('Failed to fetch pitchers');
      console.error('Error fetching pitchers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPitcher = async (pitcher: Omit<Pitcher, 'id'>) => {
    try {
      const pitchersCollection = collection(db, 'pitchers');
      const docRef = await addDoc(pitchersCollection, pitcher);
      const newPitcher = { ...pitcher, id: docRef.id };
      setPitchers(prevPitchers => [...prevPitchers, newPitcher]);
      return newPitcher;
    } catch (err) {
      setError('Failed to create pitcher');
      console.error('Error creating pitcher:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchPitchers();
    }
  }, [teamId]);

  return { pitchers, loading, error, createPitcher, fetchPitchers };
}; 