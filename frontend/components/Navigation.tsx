import React from 'react';
import { Button } from '@/components/ui/button';
import { Cigarette, BarChart3, TrendingUp, Settings } from 'lucide-react';
import { useTranslation, type Language } from '@/lib/i18n';

interface NavigationProps {
  currentView: 'counter' | 'stats' | 'charts' | 'settings';
  onViewChange: (view: 'counter' | 'stats' | 'charts' | 'settings') => void;
  language: Language;
}

export function Navigation({ currentView, onViewChange, language }: NavigationProps) {
  const t = useTranslation(language);

  const navItems = [
    { id: 'counter' as const, label: t.counter, icon: Cigarette },
    { id: 'stats' as const, label: t.stats, icon: BarChart3 },
    { id: 'charts' as const, label: t.charts, icon: TrendingUp },
    { id: 'settings' as const, label: t.settings, icon: Settings },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentView === id ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-1 ${
                currentView === id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
