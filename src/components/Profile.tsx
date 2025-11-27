import { Activity, Target, BookOpen, ShoppingBag, TrendingUp, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useHealthProfile } from '../contexts/HealthProfileContext';
import { useGoals } from '../contexts/GoalsContext';
import { HealthProfileModal } from './HealthProfileModal';
import { GoalsView } from './GoalsView';
import { Education } from './Education';
import { ShoppingList } from './ShoppingList';

type ProfileView = 'dashboard' | 'health' | 'goals' | 'education' | 'shopping';

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<ProfileView>('dashboard');
  const { profile } = useHealthProfile();
  const { goals } = useGoals();
  const [weeklyStats, setWeeklyStats] = useState({
    mealsLogged: 12,
    targetMeals: 21,
    goalsCompleted: 2,
    totalGoals: 4,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    setWeeklyStats(prev => ({
      ...prev,
      goalsCompleted: completedGoals,
      totalGoals: goals.length,
    }));
  }, [goals]);

  if (currentView === 'goals') {
    return (
      <div className="min-h-screen bg-[#F4F6F7] pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-[#465E5A]/15 px-6 py-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-[#6264A1] hover:text-[#465E5A] font-medium"
          >
            ← Back to Profile
          </button>
        </div>
        <GoalsView />
      </div>
    );
  }

  if (currentView === 'education') {
    return (
      <div className="min-h-screen bg-[#F4F6F7] pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-[#465E5A]/15 px-6 py-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-[#6264A1] hover:text-[#465E5A] font-medium"
          >
            ← Back to Profile
          </button>
        </div>
        <Education />
      </div>
    );
  }

  if (currentView === 'shopping') {
    return (
      <div className="min-h-screen bg-[#F4F6F7] pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-[#465E5A]/15 px-6 py-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-[#6264A1] hover:text-[#465E5A] font-medium"
          >
            ← Back to Profile
          </button>
        </div>
        <div className="max-w-3xl mx-auto p-6">
          <ShoppingList />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#F4F6F7] pb-20">
        <div className="max-w-3xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#465E5A] mb-2">Profile</h1>
            <p className="text-[#465E5A]/60">Manage your health journey</p>
          </div>

          {user && (
            <>
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#465E5A]">This Week's Progress</h2>
                  <TrendingUp className="w-5 h-5 text-[#6264A1]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F4F6F7] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-[#6264A1]" />
                      <span className="text-sm text-[#465E5A]/60">Meals Logged</span>
                    </div>
                    <p className="text-2xl font-bold text-[#465E5A]">
                      {weeklyStats.mealsLogged}/{weeklyStats.targetMeals}
                    </p>
                  </div>
                  <div className="bg-[#F4F6F7] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-[#6264A1]" />
                      <span className="text-sm text-[#465E5A]/60">Goals Met</span>
                    </div>
                    <p className="text-2xl font-bold text-[#465E5A]">
                      {weeklyStats.goalsCompleted}/{weeklyStats.totalGoals}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView('health')}
                  className="w-full bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#9697C0]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Activity className="w-6 h-6 text-[#6264A1]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#465E5A] mb-1">My Health Profile</h3>
                      <p className="text-sm text-[#465E5A]/60 mb-2">
                        Manage your GLP-1 medication and dietary preferences
                      </p>
                      {profile.isOnGLP1 && (
                        <span className="inline-block px-3 py-1 bg-[#9697C0]/20 text-[#6264A1] text-xs font-medium rounded-full">
                          GLP-1 Active
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentView('goals')}
                  className="w-full bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#9697C0]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-[#6264A1]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#465E5A] mb-1">Goals & Progress</h3>
                      <p className="text-sm text-[#465E5A]/60 mb-2">
                        Track your nutrition and wellness goals
                      </p>
                      <span className="inline-block px-3 py-1 bg-[#9697C0]/20 text-[#6264A1] text-xs font-medium rounded-full">
                        {goals.length} Active Goals
                      </span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentView('education')}
                  className="w-full bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#9697C0]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-[#6264A1]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#465E5A] mb-1">Education Hub</h3>
                      <p className="text-sm text-[#465E5A]/60">
                        Learn about GLP-1 medications and healthy living
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentView('shopping')}
                  className="w-full bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#9697C0]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-6 h-6 text-[#6264A1]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#465E5A] mb-1">My Shopping List</h3>
                      <p className="text-sm text-[#465E5A]/60">
                        View and manage your saved ingredients and products
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-[#9697C0]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-[#6264A1]" />
              </div>
              <h3 className="text-xl font-semibold text-[#465E5A] mb-2">Sign in to access your profile</h3>
              <p className="text-[#465E5A]/60">
                Track your goals, manage your health profile, and access personalized features
              </p>
            </div>
          )}
        </div>
      </div>

      <HealthProfileModal
        isOpen={currentView === 'health'}
        onClose={() => setCurrentView('dashboard')}
        onSave={() => setCurrentView('dashboard')}
      />
    </>
  );
}
