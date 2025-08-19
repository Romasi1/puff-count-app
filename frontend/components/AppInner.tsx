import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PuffCounter } from './PuffCounter';
import { StatsView } from './StatsView';
import { ChartsView } from './ChartsView';
import { SettingsView } from './SettingsView';
import { Navigation } from './Navigation';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/lib/i18n';
import backend from '~backend/client';
import type { User } from '~backend/puff/create_user';

export function AppInner() {
  const [currentView, setCurrentView] = useState<'counter' | 'stats' | 'charts' | 'settings'>('counter');
  const [userId, setUserId] = useState<number | null>(null);
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize user on first load
  useEffect(() => {
    const storedUserId = localStorage.getItem('puffCountUserId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    } else {
      // Create new user
      createUserMutation.mutate({});
    }
  }, []);

  const createUserMutation = useMutation({
    mutationFn: (data: { nicotinePerPuff?: number; dailyGoal?: number }) =>
      backend.puff.createUser(data),
    onSuccess: (user: User) => {
      setUserId(user.id);
      localStorage.setItem('puffCountUserId', user.id.toString());
      toast({
        title: t.welcome,
        description: t.welcomeMessage,
      });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
      toast({
        title: t.error,
        description: "Failed to create user profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userId ? backend.puff.getUser({ id: userId }) : null,
    enabled: !!userId,
  });

  if (!userId || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.settingUpProfile}</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'counter':
        return <PuffCounter userId={userId} user={user} language={language} />;
      case 'stats':
        return <StatsView userId={userId} language={language} />;
      case 'charts':
        return <ChartsView userId={userId} language={language} />;
      case 'settings':
        return <SettingsView userId={userId} user={user} language={language} />;
      default:
        return <PuffCounter userId={userId} user={user} language={language} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">{t.appTitle}</h1>
          <p className="text-sm text-gray-600 text-center mt-1">{t.appSubtitle}</p>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {renderCurrentView()}
      </main>

      <Navigation currentView={currentView} onViewChange={setCurrentView} language={language} />
    </div>
  );
}
