import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Target, Droplets, Save, Calendar } from 'lucide-react';
import { Languages } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation, type Language } from '@/lib/i18n';
import backend from '~backend/client';
import type { User } from '~backend/puff/create_user';

interface SettingsViewProps {
  userId: number;
  user: User;
  language: Language;
}

export function SettingsView({ userId, user, language }: SettingsViewProps) {
  const [nicotinePerPuff, setNicotinePerPuff] = useState(user.nicotinePerPuff.toString());
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoal.toString());
  const [todayGoal, setTodayGoal] = useState('');
  const t = useTranslation(language);
  const { setLanguage } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split('T')[0];

  const { data: goalData } = useQuery({
    queryKey: ['goal', userId, today],
    queryFn: () => backend.puff.getGoal({ userId, date: today }),
  });

  React.useEffect(() => {
    if (goalData?.goal) {
      setTodayGoal(goalData.goal.targetPuffs.toString());
    } else {
      setTodayGoal(user.dailyGoal.toString());
    }
  }, [goalData, user.dailyGoal]);

  const updateUserMutation = useMutation({
    mutationFn: (data: { nicotinePerPuff?: number; dailyGoal?: number }) =>
      backend.puff.updateUser({ id: userId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: t.settingsUpdated,
        description: t.settingsUpdatedMessage,
      });
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
      toast({
        title: t.error,
        description: t.failedToUpdate,
        variant: "destructive",
      });
    },
  });

  const setGoalMutation = useMutation({
    mutationFn: (targetPuffs: number) =>
      backend.puff.setGoal({ userId, date: today, targetPuffs }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal'] });
      toast({
        title: t.goalSet,
        description: t.goalSetMessage,
      });
    },
    onError: (error) => {
      console.error('Failed to set goal:', error);
      toast({
        title: t.error,
        description: t.failedToSetGoal,
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    const nicotine = parseFloat(nicotinePerPuff);
    const goal = parseInt(dailyGoal);

    if (isNaN(nicotine) || nicotine < 0) {
      toast({
        title: t.invalidInput,
        description: t.invalidNicotine,
        variant: "destructive",
      });
      return;
    }

    if (isNaN(goal) || goal < 0) {
      toast({
        title: t.invalidInput,
        description: t.invalidGoal,
        variant: "destructive",
      });
      return;
    }

    updateUserMutation.mutate({
      nicotinePerPuff: nicotine,
      dailyGoal: goal,
    });
  };

  const handleSetTodayGoal = () => {
    const goal = parseInt(todayGoal);

    if (isNaN(goal) || goal < 0) {
      toast({
        title: t.invalidInput,
        description: t.invalidGoal,
        variant: "destructive",
      });
      return;
    }

    setGoalMutation.mutate(goal);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t.settings}</h2>
        <p className="text-gray-600">{t.customizePreferences}</p>
      </div>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-gray-600" />
            {t.language}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={language === 'en' ? "default" : "outline"}
              onClick={() => setLanguage('en')}
              className="w-full"
            >
              🇺🇸 English
            </Button>
            <Button
              variant={language === 'es' ? "default" : "outline"}
              onClick={() => setLanguage('es')}
              className="w-full"
            >
              🇪🇸 Español
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            {t.userPreferences}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nicotine" className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-600" />
              {t.nicotinePerPuffLabel}
            </Label>
            <Input
              id="nicotine"
              type="number"
              step="0.1"
              min="0"
              value={nicotinePerPuff}
              onChange={(e) => setNicotinePerPuff(e.target.value)}
              placeholder="0.5"
            />
            <p className="text-sm text-gray-600">
              {t.nicotinePerPuffDesc}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyGoal" className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              {t.defaultDailyGoal}
            </Label>
            <Input
              id="dailyGoal"
              type="number"
              min="0"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              placeholder="0"
            />
            <p className="text-sm text-gray-600">
              {t.defaultDailyGoalDesc}
            </p>
          </div>

          <Button 
            onClick={handleSaveSettings}
            disabled={updateUserMutation.isPending}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateUserMutation.isPending ? t.saving : t.saveSettings}
          </Button>
        </CardContent>
      </Card>

      {/* Today's Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {t.todaysGoal}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="todayGoal">{t.puffLimitToday}</Label>
            <Input
              id="todayGoal"
              type="number"
              min="0"
              value={todayGoal}
              onChange={(e) => setTodayGoal(e.target.value)}
              placeholder="0"
            />
            <p className="text-sm text-gray-600">
              {t.overrideGoal}
            </p>
          </div>

          {goalData && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700">
                <strong>{t.currentProgress}:</strong> {goalData.currentPuffs} {t.ofGoal} {goalData.goal?.targetPuffs || 0} {t.puffs}
              </div>
              <div className="text-sm text-blue-600 mt-1">
                {goalData.progress.toFixed(1)}% {t.ofGoal}
              </div>
            </div>
          )}

          <Button 
            onClick={handleSetTodayGoal}
            disabled={setGoalMutation.isPending}
            className="w-full"
            variant="outline"
          >
            <Target className="h-4 w-4 mr-2" />
            {setGoalMutation.isPending ? t.setting : t.setTodaysGoal}
          </Button>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t.aboutPuffCount}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              {t.aboutDescription}
            </p>
            <p className="mb-2">
              <strong>{t.tipsForSuccess}</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>{t.tip1}</li>
              <li>{t.tip2}</li>
              <li>{t.tip3}</li>
              <li>{t.tip4}</li>
              <li>{t.tip5}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">{t.dataManagement}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            {t.dataDescription}
          </p>
          <div className="text-xs text-gray-500">
            {t.userId}: {userId} • {t.created}: {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
