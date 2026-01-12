import React, { useState } from 'react';
import { Category } from '../types';
import { Plus } from 'lucide-react';

interface AddGoalProps {
  onAdd: (title: string, category: Category) => void;
}

const AddGoal: React.FC<AddGoalProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(Category.PERSONAL);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, category);
      setTitle('');
      setIsExpanded(false);
    }
  };

  return (
    <div className={`mb-6 transition-all duration-300`}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full py-3 px-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Nieuw doel toevoegen
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1c1e24] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
          <input
            autoFocus
            type="text"
            placeholder="Wat wil je bereiken?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-base bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-600 focus:outline-none py-2 mb-4 text-slate-800 dark:text-white placeholder-slate-400"
          />
          
          <div className="flex justify-between items-center">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="text-sm bg-gray-100 dark:bg-black border-none rounded-md px-3 py-1.5 text-slate-700 dark:text-gray-200 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-3 py-1.5 text-sm text-slate-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                Toevoegen
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddGoal;