import { X, User, Activity, Bell, Lock, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useHealthProfile } from '../contexts/HealthProfileContext';
import { HealthProfileModal } from './HealthProfileModal';

interface ProfileManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileManagement({ isOpen, onClose }: ProfileManagementProps) {
  const [user, setUser] = useState<any>(null);
  const [showHealthProfile, setShowHealthProfile] = useState(false);
  const { profile } = useHealthProfile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-xl animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#465E5A]/15">
            <h2 className="text-xl font-semibold text-[#465E5A]">Profile</h2>
            <button
              onClick={onClose}
              className="p-2 text-[#465E5A]/60 hover:text-[#465E5A] hover:bg-[#F4F6F7] rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {user ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-[#9697C0]/20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-[#6264A1]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#465E5A]">{user.email}</p>
                      <p className="text-sm text-[#465E5A]/60">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowHealthProfile(true);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left text-[#465E5A] hover:bg-[#F4F6F7] rounded-lg transition-colors"
                  >
                    <Activity className="w-5 h-5 text-[#6264A1]" />
                    <div className="flex-1">
                      <p className="font-medium">Health Profile</p>
                      <p className="text-sm text-[#465E5A]/60">Manage your health information</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 text-left text-[#465E5A] hover:bg-[#F4F6F7] rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-[#6264A1]" />
                    <div className="flex-1">
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-[#465E5A]/60">Manage your alerts</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 text-left text-[#465E5A] hover:bg-[#F4F6F7] rounded-lg transition-colors">
                    <Lock className="w-5 h-5 text-[#6264A1]" />
                    <div className="flex-1">
                      <p className="font-medium">Privacy & Security</p>
                      <p className="text-sm text-[#465E5A]/60">Control your data</p>
                    </div>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    <p className="font-medium">Sign Out</p>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <User className="w-16 h-16 text-[#465E5A]/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#465E5A] mb-2">Sign in to continue</h3>
                <p className="text-[#465E5A]/60 mb-4">Access your profile and personalized features</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#6264A1] text-white rounded-lg hover:bg-[#465E5A] transition-colors"
                >
                  Go to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <HealthProfileModal
        isOpen={showHealthProfile}
        onClose={() => setShowHealthProfile(false)}
        onSave={() => setShowHealthProfile(false)}
      />
    </>
  );
}
