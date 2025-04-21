import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Team } from '../types/team';

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      console.log('Fetching teams from Firebase...');
      const teamsCollection = collection(db, 'teams');
      const teamsSnapshot = await getDocs(teamsCollection);
      console.log('Teams snapshot:', teamsSnapshot);
      
      const teamsData = teamsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Team[];
      
      console.log('Fetched teams:', teamsData);
      setTeams(teamsData);
    } catch (err) {
      console.error('Error in fetchTeams:', err);
      setError('Failed to fetch teams: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (team: Omit<Team, 'id'>) => {
    try {
      console.log('Creating team in Firebase:', team);
      const teamsCollection = collection(db, 'teams');
      const docRef = await addDoc(teamsCollection, team);
      console.log('Team created with ID:', docRef.id);
      
      const newTeam = { ...team, id: docRef.id };
      setTeams(prevTeams => [...prevTeams, newTeam]);
      return newTeam;
    } catch (err) {
      console.error('Error in createTeam:', err);
      setError('Failed to create team: ' + (err as Error).message);
      throw err;
    }
  };

  useEffect(() => {
    console.log('useTeams hook mounted');
    fetchTeams();
  }, []);

  return { teams, loading, error, createTeam, fetchTeams };
}; 