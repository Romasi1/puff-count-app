import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Calendar, Award, Cigarette, Droplets } from 'lucide-react';
import { useTranslation, formatDate, type Language } from '@/lib/i18n';
import backend from '~backend/client';

interface StatsViewProps {
  userId: number;
  language: Language;
}

export function StatsView({ userId, language }: StatsViewProps) {
  const t = useTranslation(language);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', userId, 'month'],
    queryFn: () => backend.puff.getStats({ userId, period: 'month' }),
  });

  const { data: weekStats } = useQuery({
    queryKey: ['stats', userId, 'week'],
    queryFn: () => backend.puff.getStats({ userId, period: 'week' }),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t.noStatsYet}</p>
        <p className="text-sm text-gray-500 mt-2">{t.startTrackingStats}</p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 1 });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t.yourStatistics}</h2>
        <p className="text-gray-600">{t.last30Days}</p>
      </div>

      {/* Streak Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{stats.currentStreak}</div>
            <div className="text-sm text-green-600">{t.currentStreak}</div>
            <div className="text-xs text-green-500 mt-1">{t.daysClean}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{stats.longestStreak}</div>
            <div className="text-sm text-blue-600">{t.bestStreak}</div>
            <div className="text-xs text-blue-500 mt-1">{t.daysClean}</div>
          </CardContent>
        </Card>
      </div>

      {/* Total Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cigarette className="h-5 w-5 text-gray-600" />
            {t.totalUsage30Days}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">{stats.totalPuffs}</div>
              <div className="text-sm text-gray-600">{t.totalPuffs}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {formatNumber(stats.totalNicotine)}mg
              </div>
              <div className="text-sm text-gray-600">{t.totalNicotine}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Averages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-gray-600" />
            {t.dailyAverages}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{t.puffsPerDay}</div>
              <div className="text-sm text-gray-600">{t.last30Days}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-blue-600">
                {formatNumber(stats.averagePuffsPerDay)}
              </div>
              {weekStats && (
                <Badge variant={weekStats.averagePuffsPerDay < stats.averagePuffsPerDay ? "default" : "secondary"}>
                  {weekStats.averagePuffsPerDay < stats.averagePuffsPerDay ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  )}
                  {weekStats.averagePuffsPerDay < stats.averagePuffsPerDay ? t.improving : t.increasing}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{t.nicotinePerDay}</div>
              <div className="text-sm text-gray-600">{t.last30Days}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-orange-600">
                {formatNumber(stats.averageNicotinePerDay)}mg
              </div>
              {weekStats && (
                <Badge variant={weekStats.averageNicotinePerDay < stats.averageNicotinePerDay ? "default" : "secondary"}>
                  {weekStats.averageNicotinePerDay < stats.averageNicotinePerDay ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  )}
                  {weekStats.averageNicotinePerDay < stats.averageNicotinePerDay ? t.improving : t.increasing}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {stats.dailyStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              {t.recentActivity}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.dailyStats.slice(0, 7).map((day) => (
                <div key={day.date} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDate(day.date, language)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatNumber(day.nicotineAmount)}mg {t.nicotine}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{day.puffCount}</div>
                    <div className="text-sm text-gray-600">{t.puffs}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivational Message */}
      {stats.currentStreak > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-green-700 mb-2">
              {stats.currentStreak} {stats.currentStreak !== 1 ? t.daysClean : t.daysClean.slice(0, -1)} {t.daysCleanMessage}
            </h3>
            <p className="text-green-600">
              {stats.currentStreak >= 7 
                ? t.amazingProgress
                : t.keepBuilding}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}