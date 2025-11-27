import { User, Settings, HeartPulse, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserMenuProps {
  onOpenProfileManagement: () => void;
}

export function UserMenu({ onOpenProfileManagement }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-[#EEEBE7] rounded transition-colors"
      >
        <div className="w-8 h-8 bg-[#6264A1] rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#465E5A] transition-transform hidden sm:block ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-[#465E5A]/15 rounded-lg shadow-lg overflow-hidden z-50">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-[#465E5A]/15">
                <p className="text-sm font-medium text-[#465E5A]">{user.email}</p>
                <p className="text-xs text-[#465E5A]/60 mt-0.5">Member</p>
              </div>

              <div className="py-2">
                <button
                  onClick={() => {
                    onOpenProfileManagement();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-[#465E5A] hover:bg-[#F4F6F7] transition-colors"
                >
                  <HeartPulse className="w-5 h-5 text-[#6264A1]" />
                  <span>My Health Profile</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-[#465E5A] hover:bg-[#F4F6F7] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-5 h-5 text-[#6264A1]" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="border-t border-[#465E5A]/15 py-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-3">
              <p className="text-sm text-[#465E5A]/60">Sign in to access your profile</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
