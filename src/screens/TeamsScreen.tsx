import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Team, TeamLevel } from '../types/team';
import { useTeams } from '../hooks/useTeams';

type Props = NativeStackScreenProps<RootStackParamList, 'Teams'>;

const TEAM_LEVELS: TeamLevel[] = [
  'Other', 'Pro', 'College', 'Varsity', 'JV', 'Freshman',
  '18U', '17U', '16U', '15U', '14U', '13U', '12U', '11U', '10U', '9U', '8U'
];

export const TeamsScreen: React.FC<Props> = ({ navigation }) => {
  const { teams, loading, error, createTeam } = useTeams();
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<TeamLevel>('Other');

  console.log('TeamsScreen render:', { teams, loading, error, isCreatingTeam });

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    try {
      console.log('Creating team:', { name: newTeamName.trim(), level: selectedLevel });
      const newTeam = await createTeam({
        name: newTeamName.trim(),
        level: selectedLevel
      });
      console.log('Team created successfully:', newTeam);
      setNewTeamName('');
      setIsCreatingTeam(false);
      navigation.navigate('TeamDetails', { teamId: newTeam.id });
    } catch (err) {
      console.error('Failed to create team:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    console.error('TeamsScreen error:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.replace('Teams')}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show create team button if there are no teams and we're not in creation mode
  if (!isCreatingTeam && (!teams || teams.length === 0)) {
    console.log('Showing empty state');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Teams Yet</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setIsCreatingTeam(true)}
        >
          <Text style={styles.createButtonText}>Create Your First Team</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCreatingTeam) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Create New Team</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Team Name"
          value={newTeamName}
          onChangeText={setNewTeamName}
        />

        <Text style={styles.label}>Select Level:</Text>
        <ScrollView style={styles.levelContainer}>
          <View style={styles.levelGrid}>
            {TEAM_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  selectedLevel === level && styles.selectedLevelButton
                ]}
                onPress={() => setSelectedLevel(level)}
              >
                <Text style={[
                  styles.levelButtonText,
                  selectedLevel === level && styles.selectedLevelButtonText
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setIsCreatingTeam(false);
              setNewTeamName('');
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.createButton]}
            onPress={handleCreateTeam}
          >
            <Text style={styles.buttonText}>Create Team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teams</Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setIsCreatingTeam(true)}
      >
        <Text style={styles.createButtonText}>Create New Team</Text>
      </TouchableOpacity>

      <ScrollView style={styles.teamsList}>
        {teams.map((team) => (
          <TouchableOpacity
            key={team.id}
            style={styles.teamCard}
            onPress={() => navigation.navigate('TeamDetails', { teamId: team.id })}
          >
            <Text style={styles.teamName}>{team.name}</Text>
            <Text style={styles.teamLevel}>{team.level}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  levelContainer: {
    maxHeight: 250,
    marginBottom: 20,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 5,
  },
  levelButton: {
    width: '22%',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  selectedLevelButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  levelButtonText: {
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedLevelButtonText: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  teamsList: {
    flex: 1,
  },
  teamCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  teamLevel: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 