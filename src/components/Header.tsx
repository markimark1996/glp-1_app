import { Search, Bell, ShoppingCart, HeartPulse, User } from 'lucide-react';

interface HeaderProps {
  onOpenProfileManagement: () => void;
}

export function Header({ onOpenProfileManagement }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#465E5A]/15 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-[#6264A1]" />
            <div>
              <h1 className="text-lg font-bold text-[#465E5A]">Spoon Guru</h1>
              <p className="text-xs text-[#465E5A]/70 hidden sm:block">Your GLP-1 Nutrition Companion</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-[#465E5A] hover:bg-[#DDEFDC] rounded transition-colors">
              <ShoppingCart className="w-5 h-5 text-[#6264A1]" />
              <span>My Shopping List</span>
            </button>
            <button
              onClick={onOpenProfileManagement}
              className="flex items-center gap-2 px-4 py-2 text-[#465E5A] hover:bg-[#DDEFDC] rounded transition-colors"
            >
              <User className="w-5 h-5 text-[#6264A1]" />
              <span>My Health Profile</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              className="p-2 text-[#465E5A] hover:bg-[#DDEFDC] rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenProfileManagement}
              className="p-2 text-[#465E5A] hover:bg-[#DDEFDC] rounded-full transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
