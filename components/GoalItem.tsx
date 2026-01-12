import React from 'react';
import { Goal } from '../types';
import { Trash2, Check } from 'lucide-react';

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onToggle, onDelete }) => {
  return (
    <div 
      className="group flex items-center justify-between p-4 mb-2 bg-white dark:bg-[#1c1e24] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-200"
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <button
          onClick={() => onToggle(goal.id)}
          className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200 ${
            goal.completed 
              ? 'bg-blue-600 border-blue-600' 
              : 'border-gray-300 hover:border-blue-500 dark:border-gray-600'
          }`}
        >
          {goal.completed && <Check size={12} className="text-white" />}
        </button>
        
        <div className="flex flex-col overflow-hidden">
          <span className={`text-sm font-medium truncate transition-all duration-200 ${
            goal.completed ? 'text-gray-400 line-through' : 'text-slate-800 dark:text-gray-100'
          }`}>
            {goal.title}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            {goal.category}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDelete(goal.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all duration-200 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
        title="Verwijderen"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default GoalItem;