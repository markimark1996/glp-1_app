import React, { createContext, useContext, useState, useEffect } from 'react';
import { Goal, Achievement, Reward } from '../types';
import {
  createGoal,
  updateGoalProgress,
  deleteGoal,
  getUserGoals,
  getAchievements,
  unlockAchievement,
  getRewards,
  claimReward,
  getUserPoints
} from '../lib/goals';

interface GoalsContextType {
  goals: Goal[];
  achievements: Achievement[];
  rewards: Reward[];
  points: number;
  isLoading: boolean;
  error: string | null;
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProgress: (goalId: string, progress: number) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  shareAchievement: (achievementId: string) => Promise<void>;
  claimReward: (rewardId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [goalsData, achievementsData, rewardsData, pointsData] = await Promise.all([
        getUserGoals(),
        getAchievements(),
        getRewards(),
        getUserPoints()
      ]);

      setGoals(goalsData);
      setAchievements(achievementsData);
      setRewards(rewardsData);
      setPoints(pointsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addGoal = async (goal: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newGoal = await createGoal(goal);
      // Replace the entire goals array instead of adding to it
      const updatedGoals = await getUserGoals();
      setGoals(updatedGoals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
      throw err;
    }
  };

  const updateProgress = async (goalId: string, progress: number) => {
    try {
      setError(null);
      const updatedGoal = await updateGoalProgress(goalId, progress);
      // Replace the entire goals array instead of updating a single goal
      const updatedGoals = await getUserGoals();
      setGoals(updatedGoals);

      // If goal was completed, refresh points
      if (updatedGoal.status === 'completed') {
        const newPoints = await getUserPoints();
        setPoints(newPoints);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
      throw err;
    }
  };

  const deleteGoalHandler = async (goalId: string) => {
    try {
      setError(null);
      await deleteGoal(goalId);
      const updatedGoals = await getUserGoals();
      setGoals(updatedGoals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete goal');
      throw err;
    }
  };

  const shareAchievement = async (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;

    try {
      // Implement social sharing
      if (navigator.share) {
        await navigator.share({
          title: `I unlocked ${achievement.title}!`,
          text: achievement.description,
          url: window.location.href
        });
      } else {
        // Fallback to clipboard
        const text = `I unlocked ${achievement.title} - ${achievement.description}`;
        await navigator.clipboard.writeText(text);
        alert('Achievement details copied to clipboard!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share achievement');
      throw err;
    }
  };

  const claimRewardHandler = async (rewardId: string) => {
    try {
      setError(null);
      await claimReward(rewardId);
      
      // Update rewards list
      const updatedRewards = await getRewards();
      setRewards(updatedRewards);

      // Refresh points after claiming reward
      const newPoints = await getUserPoints();
      setPoints(newPoints);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim reward');
      throw err;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <GoalsContext.Provider
      value={{
        goals,
        achievements,
        rewards,
        points,
        isLoading,
        error,
        addGoal,
        updateProgress,
        deleteGoal: deleteGoalHandler,
        shareAchievement,
        claimReward: claimRewardHandler,
        refreshData
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}