import React, { useState } from 'react';
import { Trophy, Target, Plus, Award, Trash2 } from 'lucide-react';
import { Goal, GoalCategory, Achievement, Reward } from '../types';
import { AddGoalModal } from './AddGoalModal';
import { RewardsSection } from './RewardsSection';

interface GoalsViewProps {
  goals: Goal[];
  achievements: Achievement[];
  rewards: Reward[];
  points: number;
  onAddGoal: (goal: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateProgress: (goalId: string, progress: number) => void;
  onDeleteGoal: (goalId: string) => void;
  onShareAchievement: (achievementId: string) => void;
  onClaimReward: (rewardId: string) => void;
}

export function GoalsView({
  goals,
  achievements,
  rewards,
  points,
  onAddGoal,
  onUpdateProgress,
  onDeleteGoal,
  onShareAchievement,
  onClaimReward
}: GoalsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const categories: { value: GoalCategory; label: string }[] = [
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'hydration', label: 'Hydration' }
  ];

  // Filter goals by selected category (if any) and status
  const activeGoals = goals
    .filter(goal => {
      if (selectedCategory === null) {
        return goal.status === 'in_progress';
      }
      return goal.status === 'in_progress' && goal.category === selectedCategory;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter completed goals by category
  const completedGoals = goals
    .filter(goal => {
      if (selectedCategory === null) {
        return goal.status === 'completed';
      }
      return goal.status === 'completed' && goal.category === selectedCategory;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleSaveGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>) => {
    await onAddGoal(goalData);
    setShowAddGoal(false);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      await onDeleteGoal(goalId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-racing mb-2">My Goals</h1>
          <div className="flex items-center gap-2 text-racing-75">
            <Award className="w-5 h-5" />
            <span className="font-medium">{points} Points</span>
          </div>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-racing text-white rounded-lg hover:bg-racing-75 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === null
              ? 'bg-racing text-white'
              : 'bg-primary text-racing hover:bg-primary-75'
          }`}
        >
          All Goals
        </button>
        {categories.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelectedCategory(value)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === value
                ? 'bg-racing text-white'
                : 'bg-primary text-racing hover:bg-primary-75'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active Goals */}
      <div className="space-y-6 mb-8">
        <h2 className="text-lg font-semibold text-racing">Active Goals</h2>
        {activeGoals.length === 0 ? (
          <p className="text-racing-75 text-center py-8">
            No active {selectedCategory ? `${selectedCategory} ` : ''}goals. Click "New Goal" to get started!
          </p>
        ) : (
          <div className="grid gap-4">
            {activeGoals.map(goal => (
              <div
                key={goal.id}
                className="p-6 bg-white rounded-xl border-2 border-primary hover:border-racing transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-racing mb-1">{goal.title}</h3>
                    <p className="text-sm text-racing-75">{goal.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary rounded-full text-sm text-racing capitalize">
                      {goal.duration}
                    </span>
                    <span className="px-3 py-1 bg-primary rounded-full text-sm text-racing capitalize">
                      {goal.category}
                    </span>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-racing-50 hover:text-red-500 transition-colors rounded-lg"
                      aria-label="Delete goal"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-racing-75 mb-2">
                    <span>Progress</span>
                    <span>
                      {goal.currentProgress} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-primary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-racing transition-all"
                      style={{
                        width: `${Math.min(100, (goal.currentProgress / goal.target) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Update Progress Button */}
                <button
                  onClick={() => {
                    const newProgress = prompt(
                      `Update progress (current: ${goal.currentProgress} ${goal.unit})`
                    );
                    if (newProgress) {
                      onUpdateProgress(goal.id, Number(newProgress));
                    }
                  }}
                  className="w-full px-4 py-2 bg-racing text-white rounded-lg hover:bg-racing-75 transition-colors"
                >
                  Update Progress
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rewards Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-racing mb-6">Rewards & Achievements</h2>
        <RewardsSection
          achievements={achievements}
          rewards={rewards}
          points={points}
          onShareAchievement={onShareAchievement}
          onClaimReward={onClaimReward}
        />
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-racing">Completed Goals</h2>
          <div className="grid gap-4">
            {completedGoals.map(goal => (
              <div
                key={goal.id}
                className="p-4 bg-primary-25 rounded-lg border border-primary"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-racing">{goal.title}</h3>
                    <p className="text-sm text-racing-75">
                      {goal.target} {goal.unit} • {goal.duration} • {goal.category}
                    </p>
                  </div>
                  <Trophy className="w-5 h-5 text-racing" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={showAddGoal}
        onClose={() => setShowAddGoal(false)}
        onSave={handleSaveGoal}
        category={selectedCategory || undefined}
      />
    </div>
  );
}