import { Compass, Calendar, ScanLine, Heart, User, MessageCircle } from 'lucide-react';

type View = 'discover' | 'meal-plan' | 'scan' | 'favorites' | 'profile';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onOpenChat: () => void;
}

export function BottomNav({ currentView, onViewChange, onOpenChat }: BottomNavProps) {
  const navItems: { view: View; icon: typeof Compass; label: string }[] = [
    { view: 'discover', icon: Compass, label: 'Discover' },
    { view: 'meal-plan', icon: Calendar, label: 'Meal Plan' },
    { view: 'scan', icon: ScanLine, label: 'Scan' },
    { view: 'favorites', icon: Heart, label: 'Favorites' },
    { view: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#465E5A]/15 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around max-w-screen-lg mx-auto h-16">
          {navItems.map(({ view, icon: Icon, label }) => {
            const isActive = currentView === view;
            return (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors flex-1 ${
                  isActive
                    ? 'text-[#6264A1] bg-[#9697C0]/10'
                    : 'text-[#465E5A]/60 hover:text-[#6264A1] hover:bg-[#F4F6F7]'
                }`}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <button
        onClick={onOpenChat}
        className="fixed right-6 bg-[#6264A1] text-white p-4 shadow-lg hover:bg-[#465E5A] transition-colors z-40 focus:outline-none"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom) + 1rem)' }}
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  );
}
