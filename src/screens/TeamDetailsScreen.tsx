import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Team } from '../types/team';
import { Pitcher, ThrowingHand } from '../types/pitcher';
import { usePitchers } from '../hooks/usePitchers';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamDetails'>;

const THROWING_HANDS: ThrowingHand[] = ['Right', 'Left'];

export const TeamDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { teamId } = route.params;
  const { pitchers, loading, error, createPitcher } = usePitchers(teamId);
  const [isCreatingPitcher, setIsCreatingPitcher] = useState(false);
  const [newPitcher, setNewPitcher] = useState({
    firstName: '',
    lastName: '',
    throwingHand: 'Right' as ThrowingHand,
    jerseyNumber: '',
  });

  const handleCreatePitcher = async () => {
    if (!newPitcher.firstName.trim() || !newPitcher.lastName.trim() || !newPitcher.jerseyNumber) return;

    try {
      await createPitcher({
        teamId,
        firstName: newPitcher.firstName.trim(),
        lastName: newPitcher.lastName.trim(),
        throwingHand: newPitcher.throwingHand,
        jerseyNumber: parseInt(newPitcher.jerseyNumber, 10),
      });
      setNewPitcher({
        firstName: '',
        lastName: '',
        throwingHand: 'Right',
        jerseyNumber: '',
      });
      setIsCreatingPitcher(false);
    } catch (err) {
      console.error('Failed to create pitcher:', err);
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
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.replace('TeamDetails', { teamId })}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCreatingPitcher) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add New Pitcher</Text>
        
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={newPitcher.firstName}
          onChangeText={(text) => setNewPitcher({ ...newPitcher, firstName: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={newPitcher.lastName}
          onChangeText={(text) => setNewPitcher({ ...newPitcher, lastName: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Jersey Number"
          value={newPitcher.jerseyNumber}
          onChangeText={(text) => setNewPitcher({ ...newPitcher, jerseyNumber: text })}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Throwing Hand:</Text>
        <View style={styles.throwingHandContainer}>
          {THROWING_HANDS.map((hand) => (
            <TouchableOpacity
              key={hand}
              style={[
                styles.throwingHandButton,
                newPitcher.throwingHand === hand && styles.selectedThrowingHandButton
              ]}
              onPress={() => setNewPitcher({ ...newPitcher, throwingHand: hand })}
            >
              <Text style={[
                styles.throwingHandButtonText,
                newPitcher.throwingHand === hand && styles.selectedThrowingHandButtonText
              ]}>
                {hand}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setIsCreatingPitcher(false);
              setNewPitcher({
                firstName: '',
                lastName: '',
                throwingHand: 'Right',
                jerseyNumber: '',
              });
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.createButton]}
            onPress={handleCreatePitcher}
          >
            <Text style={styles.buttonText}>Add Pitcher</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Pitchers</Text>
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setIsCreatingPitcher(true)}
      >
        <Text style={styles.createButtonText}>Add New Pitcher</Text>
      </TouchableOpacity>

      <ScrollView style={styles.pitchersList}>
        {pitchers.map((pitcher) => (
          <View key={pitcher.id} style={styles.pitcherCard}>
            <Text style={styles.pitcherName}>
              #{pitcher.jerseyNumber} {pitcher.firstName} {pitcher.lastName}
            </Text>
            <Text style={styles.pitcherDetails}>
              Throws: {pitcher.throwingHand}
            </Text>
          </View>
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
  throwingHandContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  throwingHandButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedThrowingHandButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  throwingHandButtonText: {
    color: '#333',
    fontSize: 16,
  },
  selectedThrowingHandButtonText: {
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
  pitchersList: {
    flex: 1,
  },
  pitcherCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pitcherName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  pitcherDetails: {
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