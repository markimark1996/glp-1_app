import { UtensilsCrossed, ShoppingBag, Calendar, ScanLine, BookOpen, Target, Heart, MessageCircle } from 'lucide-react';

type View = 'recipes' | 'products' | 'meal-plan' | 'scan' | 'education' | 'goals' | 'favorites';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onOpenChat: () => void;
}

export function BottomNav({ currentView, onViewChange, onOpenChat }: BottomNavProps) {
  const navItems: { view: View; icon: typeof UtensilsCrossed; label: string }[] = [
    { view: 'recipes', icon: UtensilsCrossed, label: 'Recipes' },
    { view: 'products', icon: ShoppingBag, label: 'Products' },
    { view: 'meal-plan', icon: Calendar, label: 'Meal Plan' },
    { view: 'scan', icon: ScanLine, label: 'Scan' },
    { view: 'education', icon: BookOpen, label: 'Education' },
    { view: 'goals', icon: Target, label: 'Goals' },
    { view: 'favorites', icon: Heart, label: 'Favorites' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#465E5A]/15 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div className="flex items-center justify-start min-w-max px-2 h-16">
            {navItems.map(({ view, icon: Icon, label }) => {
              const isActive = currentView === view;
              return (
                <button
                  key={view}
                  onClick={() => onViewChange(view)}
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors min-w-[70px] flex-shrink-0 ${
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
