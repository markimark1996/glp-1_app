import { Goal, Achievement, Reward, GoalCategory, GoalDuration, GoalStatus } from '../types';

// Use localStorage to persist goals
const GOALS_STORAGE_KEY = 'spoon_guru_goals';

function loadGoalsFromStorage(): Goal[] {
  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading goals from storage:', error);
    return [];
  }
}

function saveGoalsToStorage(goals: Goal[]) {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving goals to storage:', error);
  }
}

// Initialize goals from storage
let goals: Goal[] = loadGoalsFromStorage();

const sampleAchievements: Achievement[] = [
  {
    id: 'achievement_1',
    title: 'Healthy Start',
    description: 'Create your first nutrition goal',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=120&h=120&fit=crop',
    points: 100
  },
  {
    id: 'achievement_2',
    title: 'Hydration Hero',
    description: 'Complete 5 hydration goals',
    imageUrl: 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=120&h=120&fit=crop',
    points: 250
  }
];

const sampleRewards: Reward[] = [
  {
    id: 'reward_1',
    title: 'Premium Recipe Pack',
    description: 'Unlock 10 exclusive healthy recipes',
    imageUrl: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=120&h=120&fit=crop',
    pointsCost: 300,
    type: 'recipe',
    unlocked: false
  },
  {
    id: 'reward_2',
    title: 'Meal Plan Template',
    description: 'Professional meal planning template',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=120&h=120&fit=crop',
    pointsCost: 200,
    type: 'template',
    unlocked: false
  },
  {
    id: 'reward_3',
    title: 'Health Guru Badge',
    description: 'Exclusive profile badge',
    imageUrl: 'https://images.unsplash.com/photo-1557425493-6f90ae4659fc?w=120&h=120&fit=crop',
    pointsCost: 1000,
    type: 'badge',
    unlocked: false
  }
];

// Generate a cryptographically secure random UUID
function generateSecureUUID(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // Set version (4) and variant (2) bits
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  
  // Convert to hex string
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}

// Verify ID uniqueness
function ensureUniqueId(): string {
  let id: string;
  do {
    id = generateSecureUUID();
  } while (goals.some(goal => goal.id === id));
  return id;
}

// Goals
export async function createGoal(goal: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
  const newGoal: Goal = {
    id: ensureUniqueId(),
    userId: 'local-user',
    category: goal.category,
    title: goal.title,
    description: goal.description,
    target: goal.target,
    unit: goal.unit,
    duration: goal.duration,
    startDate: goal.startDate,
    endDate: goal.endDate,
    currentProgress: goal.currentProgress || 0,
    status: 'in_progress',
    points: goal.points,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  goals = [...goals, newGoal];
  saveGoalsToStorage(goals);
  return newGoal;
}

export async function updateGoalProgress(goalId: string, progress: number): Promise<Goal> {
  const goalIndex = goals.findIndex(g => g.id === goalId);
  if (goalIndex === -1) throw new Error('Goal not found');

  const updatedGoal = {
    ...goals[goalIndex],
    currentProgress: progress,
    status: progress >= goals[goalIndex].target ? 'completed' : 'in_progress',
    updatedAt: new Date().toISOString()
  };

  goals = [...goals.slice(0, goalIndex), updatedGoal, ...goals.slice(goalIndex + 1)];
  saveGoalsToStorage(goals);
  return updatedGoal;
}

export async function deleteGoal(goalId: string): Promise<void> {
  const goalIndex = goals.findIndex(g => g.id === goalId);
  if (goalIndex === -1) throw new Error('Goal not found');

  goals = [...goals.slice(0, goalIndex), ...goals.slice(goalIndex + 1)];
  saveGoalsToStorage(goals);
}

export async function getUserGoals(): Promise<Goal[]> {
  return goals;
}

// Achievements
export async function getAchievements(): Promise<Achievement[]> {
  return sampleAchievements;
}

export async function unlockAchievement(achievementId: string): Promise<void> {
  const achievement = sampleAchievements.find(a => a.id === achievementId);
  if (achievement) {
    achievement.unlockedAt = new Date().toISOString();
  }
}

// Rewards
export async function getRewards(): Promise<Reward[]> {
  return sampleRewards;
}

export async function claimReward(rewardId: string): Promise<void> {
  const reward = sampleRewards.find(r => r.id === rewardId);
  if (reward) {
    reward.unlocked = true;
  }
}

// Points
export async function getUserPoints(): Promise<number> {
  // Calculate points from completed goals
  return goals
    .filter(goal => goal.status === 'completed')
    .reduce((sum, goal) => sum + goal.points, 0);
}