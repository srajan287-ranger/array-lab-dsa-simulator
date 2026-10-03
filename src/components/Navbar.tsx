import { BookOpen, Brackets, Search, ArrowRightLeft, Trash2, Plus, Calculator } from 'lucide-react';

export type TabId = 'address' | 'insertion' | 'deletion' | 'linear' | 'binary' | 'learn';

interface NavbarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof BookOpen }[] = [
  { id: 'address', label: 'Address Calculation', icon: Calculator },
  { id: 'insertion', label: 'Insertion', icon: Plus },
  { id: 'deletion', label: 'Deletion', icon: Trash2 },
  { id: 'linear', label: 'Linear Search', icon: Search },
  { id: 'binary', label: 'Binary Search', icon: ArrowRightLeft },
  { id: 'learn', label: 'Learn', icon: BookOpen },
];

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Brackets className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 hidden sm:block">ArrayLab</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
