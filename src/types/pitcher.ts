export type ThrowingHand = 'Right' | 'Left';

export interface Pitcher {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  throwingHand: ThrowingHand;
  jerseyNumber: number;
} 