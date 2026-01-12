import React from 'react';
import { Category, FilterType } from '../types';
import { LayoutDashboard, CheckCircle2, Circle, Briefcase, Heart, Wallet, BookOpen, User, MessageSquare, Zap } from 'lucide-react';

interface SidebarProps {
  currentFilter: FilterType;
  setFilter: (filter: FilterType) => void;
  counts: { [key: string]: number };
  onFastBoost: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentFilter, setFilter, counts, onFastBoost }) => {
  
  const menuItems = [
    { id: 'ALL', label: 'Overzicht', icon: LayoutDashboard },
    { id: 'ACTIVE', label: 'Actief', icon: Circle },
    { id: 'COMPLETED', label: 'Voltooid', icon: CheckCircle2 },
  ];

  const categories = [
    { id: Category.PERSONAL, label: 'Persoonlijk', icon: User },
    { id: Category.WORK, label: 'Werk', icon: Briefcase },
    { id: Category.HEALTH, label: 'Gezondheid', icon: Heart },
    { id: Category.FINANCE, label: 'Financiën', icon: Wallet },
    { id: Category.LEARNING, label: 'Leren', icon: BookOpen },
  ];

  const MenuItem: React.FC<{ item: any, isCategory?: boolean, isChat?: boolean }> = ({ item, isCategory = false, isChat = false }) => {
    const isActive = currentFilter === item.id;
    const Icon = item.icon;
    const count = counts[item.id] || 0;

    // Darker blue for selection, darker grays for text
    const activeClass = "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white font-semibold";
    const inactiveClass = "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50";

    return (
      <button
        onClick={() => setFilter(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 mb-1 text-sm rounded-md transition-all duration-200 ${
          isActive ? activeClass : inactiveClass
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className={isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'} />
          <span>{item.label}</span>
        </div>
        {!isChat && count > 0 && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isActive ? 'bg-white/50 text-slate-900 dark:bg-black/20 dark:text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-60 flex-shrink-0 bg-gray-50 dark:bg-[#16181d] border-r border-gray-200 dark:border-white/5 p-4 flex flex-col h-full select-none">
      <div className="mb-6">
        <h2 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu</h2>
        {menuItems.map((item) => <MenuItem key={item.id} item={item} />)}
      </div>

      <div className="mb-6">
        <h2 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assistent</h2>
        <MenuItem item={{ id: 'CHAT', label: 'AI Chat', icon: MessageSquare }} isChat={true} />
        <button
          onClick={onFastBoost}
          className="w-full flex items-center justify-between px-3 py-2 mb-1 text-sm rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 transition-all duration-200 group"
        >
           <div className="flex items-center gap-3">
              <Zap size={16} className="text-yellow-500 group-hover:text-yellow-600" />
              <span>Quick Boost</span>
           </div>
        </button>
      </div>

      <div>
        <h2 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Labels</h2>
        {categories.map((cat) => <MenuItem key={cat.id} item={cat} isCategory />)}
      </div>
    </div>
  );
};

export default Sidebar;