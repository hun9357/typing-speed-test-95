export type SimulationCategory = 'email' | 'support' | 'legal' | 'data-entry';

export type SimulationDifficulty = 'easy' | 'medium' | 'hard';

export interface SimulationScenario {
  id: string;
  category: SimulationCategory;
  title: string;
  context: string;
  content: string;
  difficulty: SimulationDifficulty;
}

export interface SimulationMetrics {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
}

export interface CategoryInfo {
  id: SimulationCategory;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  color: string;
}
