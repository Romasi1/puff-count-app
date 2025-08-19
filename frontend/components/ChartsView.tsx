import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingDown, Calendar } from 'lucide-react';
import { useTranslation, formatDate, type Language } from '@/lib/i18n';
import backend from '~backend/client';

interface ChartsViewProps {
  userId: number;
  language: Language;
}

type Period = 'day' | 'week' | 'month';

export function ChartsView({ userId, language }: ChartsViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const t = useTranslation(language);

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
        <p className="text-gray-600">{t.noDataCharts}</p>
        <p className="text-sm text-gray-500 mt-2">{t.startTrackingCharts}</p>
      </div>
    );
  }

  const maxPuffs = Math.max(...stats.dailyStats.map(d => d.puffCount), 1);
  const maxNicotine = Math.max(...stats.dailyStats.map(d => d.nicotineAmount), 1);

  const periodLabels = {
    day: t.today,
    week: t.last7Days,
    month: t.last30Days
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.usageCharts}</h2>
        <p className="text-gray-600">{t.visualizePatterns}</p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center gap-2">
        {(['day', 'week', 'month'] as Period[]).map((period) => {
          const periodText = period === 'day' ? t.day : period === 'week' ? t.week : t.month;
          return (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
          >
            {periodText}
          </Button>
          );
        })}
      </div>

      {/* Puff Count Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            {t.dailyPuffCount} - {periodLabels[selectedPeriod]}
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
                      {formatDate(day.date, language)}
                    </span>
                    <span className="font-medium">{day.puffCount} {t.puffs}</span>
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
              {t.noDataCharts}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nicotine Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            {t.dailyNicotineIntake} - {periodLabels[selectedPeriod]}
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
                      {formatDate(day.date, language)}
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
            {periodLabels[selectedPeriod]} {t.summary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.totalPuffs}</div>
              <div className="text-sm text-gray-600">{t.totalPuffs}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalNicotine.toFixed(1)}mg
              </div>
              <div className="text-sm text-gray-600">{t.totalNicotine}</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-green-600">
                {stats.averagePuffsPerDay.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">{t.avgPuffsDay}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600">
                {stats.averageNicotinePerDay.toFixed(1)}mg
              </div>
              <div className="text-sm text-gray-600">{t.avgNicotineDay}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      {stats.dailyStats.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.trendAnalysis}</CardTitle>
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
                      {trend === 'improving' && t.usageDecreasing}
                      {trend === 'increasing' && t.usageIncreasing}
                      {trend === 'stable' && t.usageStable}
                    </div>
                    <div className="text-sm mt-1">
                      {t.recentAverage}: {recentAvg.toFixed(1)} {t.puffs}/{t.day.toLowerCase()}
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
