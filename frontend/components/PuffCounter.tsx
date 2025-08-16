import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Cigarette, Target, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { User } from '~backend/puff/create_user';

interface PuffCounterProps {
  userId: number;
  user: User;
}

export function PuffCounter({ userId, user }: PuffCounterProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split('T')[0];

  const { data: goalData } = useQuery({
    queryKey: ['goal', userId, today],
    queryFn: () => backend.puff.getGoal({ userId, date: today }),
  });

  const { data: todayPuffs } = useQuery({
    queryKey: ['puffs', userId, today],
    queryFn: () => {
      const startDate = `${today}T00:00:00.000Z`;
      const endDate = `${today}T23:59:59.999Z`;
      return backend.puff.getPuffs({ userId, startDate, endDate });
    },
  });

  const addPuffMutation = useMutation({
    mutationFn: () => backend.puff.addPuff({ userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puffs'] });
      queryClient.invalidateQueries({ queryKey: ['goal'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      
      // Haptic feedback simulation
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },
    onError: (error) => {
      console.error('Failed to add puff:', error);
      toast({
        title: "Error",
        description: "Failed to record puff. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePuffPress = () => {
    setIsPressed(true);
    addPuffMutation.mutate();
    setTimeout(() => setIsPressed(false), 150);
  };

  const currentPuffs = todayPuffs?.puffs.length || 0;
  const dailyGoal = goalData?.goal?.targetPuffs || user.dailyGoal;
  const progress = dailyGoal > 0 ? (currentPuffs / dailyGoal) * 100 : 0;
  const totalNicotine = (todayPuffs?.puffs || []).reduce(
    (sum, puff) => sum + puff.nicotineAmount, 
    0
  );

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-blue-600" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{currentPuffs}</div>
            <div className="text-sm text-gray-600">
              {dailyGoal > 0 ? `of ${dailyGoal} puffs` : 'puffs today'}
            </div>
          </div>
          
          {dailyGoal > 0 && (
            <div className="space-y-2">
              <Progress value={Math.min(progress, 100)} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{Math.round(progress)}% of goal</span>
                <span>{Math.max(0, dailyGoal - currentPuffs)} remaining</span>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-2">
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {totalNicotine.toFixed(1)}mg
              </div>
              <div className="text-xs text-gray-600">Nicotine</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {user.nicotinePerPuff}mg
              </div>
              <div className="text-xs text-gray-600">Per puff</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Puff Button */}
      <div className="flex justify-center">
        <Button
          onClick={handlePuffPress}
          disabled={addPuffMutation.isPending}
          className={`
            w-48 h-48 rounded-full text-white font-bold text-xl shadow-2xl
            transition-all duration-150 transform
            ${isPressed ? 'scale-95 shadow-lg' : 'scale-100 hover:scale-105'}
            ${addPuffMutation.isPending 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 active:from-blue-700 active:to-blue-900'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <Cigarette className="h-12 w-12" />
            <span>TAP TO PUFF</span>
          </div>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{currentPuffs}</div>
            <div className="text-sm text-green-600">Today</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">
              {totalNicotine.toFixed(1)}
            </div>
            <div className="text-sm text-orange-600">mg Nicotine</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Messages */}
      {progress >= 100 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Goal exceeded!</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              You've reached your daily limit. Consider taking a break.
            </p>
          </CardContent>
        </Card>
      )}

      {currentPuffs === 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center text-green-700">
              <div className="font-medium">Great start!</div>
              <p className="text-sm text-green-600 mt-1">
                No puffs recorded today. Keep it up!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
