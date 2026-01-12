import React, { useState, useEffect, useMemo } from 'react';
import { Goal, Category, FilterType } from './types';
import Sidebar from './components/Sidebar';
import GoalItem from './components/GoalItem';
import AddGoal from './components/AddGoal';
import ChatView from './components/ChatView';
import { getFastMotivation } from './services/geminiService';
import { Search, Sun, Moon, Zap } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('zen_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Start met React leren', category: Category.LEARNING, completed: true, createdAt: Date.now() },
      { id: '2', title: '5km hardlopen', category: Category.HEALTH, completed: false, createdAt: Date.now() },
      { id: '3', title: 'Budget plan maken', category: Category.FINANCE, completed: false, createdAt: Date.now() },
    ];
  });
  
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fastBoost, setFastBoost] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('zen_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // --- Handlers ---
  const addGoal = (title: string, category: Category) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title,
      category,
      completed: false,
      createdAt: Date.now(),
    };
    setGoals([newGoal, ...goals]);
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleFastBoost = async () => {
    const motivation = await getFastMotivation();
    setFastBoost(motivation);
    setTimeout(() => setFastBoost(null), 4000); // Hide after 4 seconds
  };

  // --- Computed ---
  const filteredGoals = useMemo(() => {
    if (filter === 'CHAT') return [];
    return goals.filter(g => {
      const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        filter === 'ALL' ? true :
        filter === 'ACTIVE' ? !g.completed :
        filter === 'COMPLETED' ? g.completed :
        g.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [goals, filter, searchQuery]);

  const counts = useMemo(() => {
    const c: { [key: string]: number } = {
      ALL: goals.length,
      ACTIVE: goals.filter(g => !g.completed).length,
      COMPLETED: goals.filter(g => g.completed).length,
    };
    Object.values(Category).forEach(cat => {
      c[cat] = goals.filter(g => g.category === cat).length;
    });
    return c;
  }, [goals]);

  // --- Render ---
  return (
    <div className={`flex items-center justify-center min-h-screen p-6 transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0a0a0a]' : 'bg-[#eef2f5]'}`}>
      
      {/* App Window Container */}
      <div className="relative w-[1100px] h-[750px] bg-white dark:bg-[#0f1115] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-[#2a2d35]">
        
        {/* Window Title Bar */}
        <div className="h-10 bg-gray-100 dark:bg-[#16181d] border-b border-gray-200 dark:border-black flex items-center justify-between px-4 flex-shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
          </div>
          
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">DoelenDeck</div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Sidebar */}
          <Sidebar currentFilter={filter} setFilter={setFilter} counts={counts} onFastBoost={handleFastBoost} />

          {/* Main View Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0f1115]">
            
            {filter === 'CHAT' ? (
              <ChatView goals={goals} />
            ) : (
              <>
                {/* Standard Goal View */}
                <div className="p-6 pb-2 flex items-center justify-between gap-4 border-b border-gray-100 dark:border-white/5">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                      {filter === 'ALL' ? 'Overzicht' : 
                       filter === 'ACTIVE' ? 'Actief' :
                       filter === 'COMPLETED' ? 'Voltooid' : filter}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                       Beheer je doelen en taken.
                    </p>
                  </div>

                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="Zoeken..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-[#16181d] rounded-md border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-[#0f1115] outline-none transition-all w-64"
                    />
                  </div>
                </div>

                {/* Scrollable Goal List */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2 bg-gray-50/50 dark:bg-[#0f1115]">
                  <AddGoal onAdd={addGoal} />
                  
                  {filteredGoals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                      <div className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-[#16181d]">
                        <Search size={24} className="opacity-50" />
                      </div>
                      <p className="text-sm">Geen doelen gevonden.</p>
                    </div>
                  ) : (
                    filteredGoals.map(goal => (
                      <GoalItem 
                        key={goal.id} 
                        goal={goal} 
                        onToggle={toggleGoal} 
                        onDelete={deleteGoal} 
                      />
                    ))
                  )}
                </div>
              </>
            )}
            
            {/* Footer */}
            {filter !== 'CHAT' && (
              <div className="h-8 bg-white dark:bg-[#16181d] border-t border-gray-200 dark:border-white/5 flex items-center justify-between px-4 text-[10px] text-gray-400 font-medium">
                 <span>DoelenDeck v1.3</span>
                 <span>{goals.filter(g => !g.completed).length} openstaande taken</span>
              </div>
            )}
          </div>

          {/* Quick Boost Toast */}
          {fastBoost && (
            <div className="absolute bottom-8 right-8 max-w-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 z-50">
              <Zap size={18} className="text-yellow-400 dark:text-yellow-500 fill-current" />
              <p className="text-sm font-medium">{fastBoost}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;