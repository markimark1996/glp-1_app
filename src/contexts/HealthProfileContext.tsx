import React, { createContext, useContext, useState, useEffect } from 'react';
import { HealthProfile } from '../types';
import { supabase, checkNetworkStatus } from '../lib/supabase';

interface HealthProfileContextType {
  profile: HealthProfile | null;
  isLoading: boolean;
  updateProfile: (profile: Partial<HealthProfile>) => Promise<void>;
}

const HealthProfileContext = createContext<HealthProfileContextType | undefined>(undefined);

// Default profile data
const defaultProfile: HealthProfile = {
  dietType: 'omnivore',
  restrictions: [],
  allergies: [],
  customRestrictions: [],
  nutritionalPreferences: [
    {
      id: 'high-protein',
      label: 'High Protein',
      description: 'Prioritize high protein foods',
      enabled: true,
      locked: true
    },
    {
      id: 'high-fiber',
      label: 'High Fiber',
      description: 'Focus on fiber-rich foods',
      enabled: true,
      locked: true
    }
  ],
  caloricTarget: 2000,
  cookingTimeMax: 45,
  skillLevel: 'intermediate',
  servingsDefault: 2
};

export function HealthProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<HealthProfile | null>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Check network connectivity first
      const isOnline = await checkNetworkStatus();
      if (!isOnline) {
        console.warn('Network appears to be offline, using default profile');
        setProfile(defaultProfile);
        setIsLoading(false);
        return;
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('Session error:', sessionError.message);
        setProfile(defaultProfile);
        return;
      }
      
      if (session?.user) {
        const { data, error } = await supabase
          .from('meal_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (!error && data) {
          setProfile({
            dietType: data.diet_type || defaultProfile.dietType,
            restrictions: data.restrictions || defaultProfile.restrictions,
            allergies: data.allergies || defaultProfile.allergies,
            customRestrictions: data.custom_restrictions || defaultProfile.customRestrictions,
            nutritionalPreferences: data.nutritional_preferences || defaultProfile.nutritionalPreferences,
            caloricTarget: data.caloric_target || defaultProfile.caloricTarget,
            cookingTimeMax: data.cooking_time_max || defaultProfile.cookingTimeMax,
            skillLevel: data.skill_level || defaultProfile.skillLevel,
            servingsDefault: data.servings_default || defaultProfile.servingsDefault
          });
        } else if (error && error.code === 'PGRST116') {
          // No profile exists, create one with default values
          const { error: insertError } = await supabase
            .from('meal_preferences')
            .insert([{
              user_id: session.user.id,
              diet_type: defaultProfile.dietType,
              restrictions: defaultProfile.restrictions,
              allergies: defaultProfile.allergies,
              custom_restrictions: defaultProfile.customRestrictions,
              nutritional_preferences: defaultProfile.nutritionalPreferences,
              caloric_target: defaultProfile.caloricTarget,
              cooking_time_max: defaultProfile.cookingTimeMax,
              skill_level: defaultProfile.skillLevel,
              servings_default: defaultProfile.servingsDefault
            }]);

          if (!insertError) {
            setProfile(defaultProfile);
          } else {
            console.error('Error creating default profile:', insertError.message);
            setProfile(defaultProfile);
          }
        } else {
          console.error('Error fetching profile:', error?.message);
          setProfile(defaultProfile);
        }
      } else {
        // If not authenticated, use default
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading health profile:', error instanceof Error ? error.message : error);
      // Fallback to default profile on error
      setProfile(defaultProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (newProfile: Partial<HealthProfile>) => {
    try {
      const isOnline = await checkNetworkStatus();
      if (!isOnline) {
        throw new Error('Cannot update profile while offline');
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('User must be authenticated to update health profile');
      }

      // Update local state immediately for better UX
      setProfile(prev => prev ? { ...prev, ...newProfile } : { ...defaultProfile, ...newProfile });

      // Map the profile data to match the database schema
      const { error } = await supabase
        .from('meal_preferences')
        .upsert([{
          user_id: session.user.id,
          diet_type: newProfile.dietType || profile?.dietType || defaultProfile.dietType,
          restrictions: newProfile.restrictions || profile?.restrictions || defaultProfile.restrictions,
          allergies: newProfile.allergies || profile?.allergies || defaultProfile.allergies,
          custom_restrictions: newProfile.customRestrictions || profile?.customRestrictions || defaultProfile.customRestrictions,
          nutritional_preferences: newProfile.nutritionalPreferences || profile?.nutritionalPreferences || defaultProfile.nutritionalPreferences,
          caloric_target: newProfile.caloricTarget || profile?.caloricTarget || defaultProfile.caloricTarget,
          cooking_time_max: newProfile.cookingTimeMax || profile?.cookingTimeMax || defaultProfile.cookingTimeMax,
          skill_level: newProfile.skillLevel || profile?.skillLevel || defaultProfile.skillLevel,
          servings_default: newProfile.servingsDefault || profile?.servingsDefault || defaultProfile.servingsDefault,
          updated_at: new Date().toISOString()
        }], {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating health profile:', error instanceof Error ? error.message : error);
      // Revert local state on error
      await loadProfile();
      throw error;
    }
  };

  return (
    <HealthProfileContext.Provider value={{ profile, isLoading, updateProfile }}>
      {children}
    </HealthProfileContext.Provider>
  );
}

export function useHealthProfile() {
  const context = useContext(HealthProfileContext);
  if (context === undefined) {
    throw new Error('useHealthProfile must be used within a HealthProfileProvider');
  }
  return context;
}