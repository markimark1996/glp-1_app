import React, { useState } from 'react';
import { Trophy, Share2, Gift, Filter, Award } from 'lucide-react';
import { Achievement, Reward } from '../types';

interface RewardsSectionProps {
  achievements: Achievement[];
  rewards: Reward[];
  points: number;
  onShareAchievement: (achievementId: string) => void;
  onClaimReward: (rewardId: string) => void;
}

type SortOption = 'date' | 'points' | 'category';
type FilterOption = 'all' | 'recipe' | 'template' | 'badge';

export function RewardsSection({
  achievements,
  rewards,
  points,
  onShareAchievement,
  onClaimReward
}: RewardsSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterType, setFilterType] = useState<FilterOption>('all');
  const [showAchievements, setShowAchievements] = useState(true);

  // Sort and filter rewards
  const filteredRewards = rewards
    .filter(reward => filterType === 'all' || reward.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return a.pointsCost - b.pointsCost;
        case 'category':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return rewards.indexOf(a) - rewards.indexOf(b);
      }
    });

  // Sort achievements by unlock date or points
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (sortBy === 'points') {
      return b.points - a.points;
    }
    return a.unlockedAt ? -1 : b.unlockedAt ? 1 : 0;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAchievements(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showAchievements
                ? 'bg-racing text-white'
                : 'bg-primary text-racing hover:bg-primary-75'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Achievements</span>
          </button>
          <button
            onClick={() => setShowAchievements(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              !showAchievements
                ? 'bg-racing text-white'
                : 'bg-primary text-racing hover:bg-primary-75'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span>Rewards</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 rounded-lg border-2 border-primary bg-white focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
          >
            <option value="date">Sort by Date</option>
            <option value="points">Sort by Points</option>
            <option value="category">Sort by Category</option>
          </select>

          {!showAchievements && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterOption)}
              className="px-4 py-2 rounded-lg border-2 border-primary bg-white focus:outline-none focus:ring-2 focus:ring-racing focus:border-racing"
            >
              <option value="all">All Types</option>
              <option value="recipe">Recipes</option>
              <option value="template">Templates</option>
              <option value="badge">Badges</option>
            </select>
          )}
        </div>
      </div>

      {/* Achievements Grid */}
      {showAchievements ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-6 bg-white rounded-xl border-2 border-primary hover:border-racing transition-colors"
            >
              <div className="flex items-start gap-4">
                <img
                  src={achievement.imageUrl}
                  alt={achievement.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-racing mb-1">{achievement.title}</h3>
                  <p className="text-sm text-racing-75 mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Award className="w-4 h-4 text-racing" />
                      <span className="text-racing-75">{achievement.points} points</span>
                    </div>
                    {achievement.unlockedAt && (
                      <button
                        onClick={() => onShareAchievement(achievement.id)}
                        className="p-2 text-racing-50 hover:text-racing transition-colors rounded-lg"
                        aria-label="Share achievement"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Points Display */}
          <div className="p-4 bg-primary-25 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-racing" />
                <span className="font-medium text-racing">Available Points</span>
              </div>
              <span className="text-xl font-bold text-racing">{points}</span>
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <div
                key={reward.id}
                className="p-6 bg-white rounded-xl border-2 border-primary hover:border-racing transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-racing">{reward.title}</h3>
                      <span className="px-2 py-1 bg-primary rounded-full text-sm text-racing capitalize">
                        {reward.type}
                      </span>
                    </div>
                    <p className="text-sm text-racing-75 mb-4">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm">
                        <Award className="w-4 h-4 text-racing" />
                        <span className="text-racing-75">{reward.pointsCost} points</span>
                      </div>
                      <button
                        onClick={() => onClaimReward(reward.id)}
                        disabled={points < reward.pointsCost || reward.unlocked}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          reward.unlocked
                            ? 'bg-primary text-racing-50 cursor-not-allowed'
                            : points >= reward.pointsCost
                            ? 'bg-racing text-white hover:bg-racing-75'
                            : 'bg-primary text-racing-50 cursor-not-allowed'
                        }`}
                      >
                        {reward.unlocked ? 'Claimed' : 'Claim Reward'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}