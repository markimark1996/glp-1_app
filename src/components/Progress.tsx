import { GoalsView } from './GoalsView';
import { useGoals } from '../contexts/GoalsContext';

export function Progress() {
  const {
    goals,
    achievements,
    rewards,
    points,
    addGoal,
    updateProgress,
    deleteGoal,
    shareAchievement,
    claimReward
  } = useGoals();

  return (
    <GoalsView
      goals={goals}
      achievements={achievements}
      rewards={rewards}
      points={points}
      onAddGoal={addGoal}
      onUpdateProgress={updateProgress}
      onDeleteGoal={deleteGoal}
      onShareAchievement={shareAchievement}
      onClaimReward={claimReward}
    />
  );
}
