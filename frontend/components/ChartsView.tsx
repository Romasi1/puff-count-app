import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingDown, Calendar } from 'lucide-react';
import backend from '~backend/client';

interface ChartsViewProps {
  userId: number;
}

type Period = 'day' | 'week' | 'month';

export function ChartsView({ userId }: ChartsViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', userId, selectedPeriod],
    queryFn: () => backend.puff.getStats({ userId, period: selectedPeriod }),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats || stats.dailyStats.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No data available for charts yet.</p>
        <p className="text-sm text-gray-500 mt-2">Start tracking puffs to see your progress!</p>
      </div>
    );
  }

  const maxPuffs = Math.max(...stats.dailyStats.map(d => d.puffCount), 1);
  const maxNicotine = Math.max(...stats.dailyStats.map(d => d.nicotineAmount), 1);

  const periodLabels = {
    day: 'Today',
    week: 'Last 7 Days',
    month: 'Last 30 Days'
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Usage Charts</h2>
        <p className="text-gray-600">Visualize your vaping patterns</p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center gap-2">
        {(['day', 'week', 'month'] as Period[]).map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
            className="capitalize"
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Puff Count Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Daily Puff Count - {periodLabels[selectedPeriod]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.dailyStats.map((day) => {
              const percentage = (day.puffCount / maxPuffs) * 100;
              return (
                <div key={day.date} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="font-medium">{day.puffCount} puffs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {stats.dailyStats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No data available for this period
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nicotine Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            Daily Nicotine Intake - {periodLabels[selectedPeriod]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.dailyStats.map((day) => {
              const percentage = (day.nicotineAmount / maxNicotine) * 100;
              return (
                <div key={day.date} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="font-medium">{day.nicotineAmount.toFixed(1)}mg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            {periodLabels[selectedPeriod]} Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.totalPuffs}</div>
              <div className="text-sm text-gray-600">Total Puffs</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalNicotine.toFixed(1)}mg
              </div>
              <div className="text-sm text-gray-600">Total Nicotine</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-green-600">
                {stats.averagePuffsPerDay.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avg Puffs/Day</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600">
                {stats.averageNicotinePerDay.toFixed(1)}mg
              </div>
              <div className="text-sm text-gray-600">Avg Nicotine/Day</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      {stats.dailyStats.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                const recent = stats.dailyStats.slice(0, 3);
                const older = stats.dailyStats.slice(-3);
                const recentAvg = recent.reduce((sum, d) => sum + d.puffCount, 0) / recent.length;
                const olderAvg = older.reduce((sum, d) => sum + d.puffCount, 0) / older.length;
                const trend = recentAvg < olderAvg ? 'improving' : recentAvg > olderAvg ? 'increasing' : 'stable';
                
                return (
                  <div className={`p-4 rounded-lg ${
                    trend === 'improving' ? 'bg-green-50 text-green-700' :
                    trend === 'increasing' ? 'bg-red-50 text-red-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    <div className="font-medium">
                      {trend === 'improving' && '📈 Your usage is decreasing - great progress!'}
                      {trend === 'increasing' && '📉 Your usage is increasing - consider setting goals.'}
                      {trend === 'stable' && '📊 Your usage is stable - maintain awareness.'}
                    </div>
                    <div className="text-sm mt-1">
                      Recent average: {recentAvg.toFixed(1)} puffs/day
                    </div>
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
