import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Target, Droplets, Save, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { User } from '~backend/puff/create_user';

interface SettingsViewProps {
  userId: number;
  user: User;
}

export function SettingsView({ userId, user }: SettingsViewProps) {
  const [nicotinePerPuff, setNicotinePerPuff] = useState(user.nicotinePerPuff.toString());
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoal.toString());
  const [todayGoal, setTodayGoal] = useState('');
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
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
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
        title: "Goal set",
        description: "Your daily goal has been updated.",
      });
    },
    onError: (error) => {
      console.error('Failed to set goal:', error);
      toast({
        title: "Error",
        description: "Failed to set goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    const nicotine = parseFloat(nicotinePerPuff);
    const goal = parseInt(dailyGoal);

    if (isNaN(nicotine) || nicotine < 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid nicotine amount.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(goal) || goal < 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid daily goal.",
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
        title: "Invalid input",
        description: "Please enter a valid goal number.",
        variant: "destructive",
      });
      return;
    }

    setGoalMutation.mutate(goal);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Customize your tracking preferences</p>
      </div>

      {/* User Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            User Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nicotine" className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-600" />
              Nicotine per puff (mg)
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
              Typical range: 0.3-2.0mg per puff depending on your device and e-liquid
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyGoal" className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Default daily goal (puffs)
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
              Set to 0 to disable daily goals, or set a target to work towards
            </p>
          </div>

          <Button 
            onClick={handleSaveSettings}
            disabled={updateUserMutation.isPending}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateUserMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Today's Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Today's Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="todayGoal">Puff limit for today</Label>
            <Input
              id="todayGoal"
              type="number"
              min="0"
              value={todayGoal}
              onChange={(e) => setTodayGoal(e.target.value)}
              placeholder="0"
            />
            <p className="text-sm text-gray-600">
              Override your default goal for today only
            </p>
          </div>

          {goalData && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700">
                <strong>Current progress:</strong> {goalData.currentPuffs} of {goalData.goal?.targetPuffs || 0} puffs
              </div>
              <div className="text-sm text-blue-600 mt-1">
                {goalData.progress.toFixed(1)}% of today's goal
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
            {setGoalMutation.isPending ? 'Setting...' : 'Set Today\'s Goal'}
          </Button>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Puff Count</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              Puff Count helps you track your vaping habits and work towards reducing or quitting.
            </p>
            <p className="mb-2">
              <strong>Tips for success:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Set realistic daily goals and gradually reduce them</li>
              <li>Track every puff honestly for accurate data</li>
              <li>Review your charts regularly to identify patterns</li>
              <li>Celebrate your clean streaks and progress</li>
              <li>Consider seeking professional help if needed</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Your data is stored locally and securely. All tracking information remains private.
          </p>
          <div className="text-xs text-gray-500">
            User ID: {userId} • Created: {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
