export type TeamLevel = 
  | '8U' | '9U' | '10U' | '11U' | '12U' | '13U' | '14U' | '15U' | '16U' | '17U' | '18U'
  | 'Freshman' | 'JV' | 'Varsity' | 'College' | 'Pro' | 'Other';

export interface Team {
  id: string;
  name: string;
  level: TeamLevel;
} 