import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { puffDB } from "./db";

export interface GetStatsParams {
  userId: number;
  period?: Query<"day" | "week" | "month">;
}

export interface DailyStats {
  date: string;
  puffCount: number;
  nicotineAmount: number;
}

export interface GetStatsResponse {
  totalPuffs: number;
  totalNicotine: number;
  averagePuffsPerDay: number;
  averageNicotinePerDay: number;
  dailyStats: DailyStats[];
  currentStreak: number;
  longestStreak: number;
}

// Retrieves comprehensive statistics for a user.
export const getStats = api<GetStatsParams, GetStatsResponse>(
  { expose: true, method: "GET", path: "/users/:userId/stats" },
  async (params) => {
    const period = params.period || "month";
    
    // Calculate date range based on period
    let daysBack = 30;
    if (period === "day") daysBack = 1;
    else if (period === "week") daysBack = 7;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    startDate.setHours(0, 0, 0, 0);

    // Get total stats
    const totalStats = await puffDB.queryRow<{
      total_puffs: number;
      total_nicotine: number;
      days_active: number;
    }>`
      SELECT 
        COUNT(*) as total_puffs,
        COALESCE(SUM(nicotine_amount), 0) as total_nicotine,
        COUNT(DISTINCT DATE(timestamp)) as days_active
      FROM puffs
      WHERE user_id = ${params.userId}
        AND timestamp >= ${startDate.toISOString()}
    `;

    // Get daily breakdown
    const dailyStatsRows = await puffDB.queryAll<{
      date: string;
      puff_count: number;
      nicotine_amount: number;
    }>`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as puff_count,
        COALESCE(SUM(nicotine_amount), 0) as nicotine_amount
      FROM puffs
      WHERE user_id = ${params.userId}
        AND timestamp >= ${startDate.toISOString()}
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `;

    // Calculate streaks (days without vaping)
    const allDays = await puffDB.queryAll<{ date: string }>`
      SELECT DISTINCT DATE(timestamp) as date
      FROM puffs
      WHERE user_id = ${params.userId}
      ORDER BY date DESC
    `;

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate current streak (consecutive days without vaping from today backwards)
    let checkDate = new Date(today);
    const vapingDates = new Set(allDays.map(d => d.date));
    
    while (!vapingDates.has(checkDate.toISOString().split('T')[0])) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      
      // Limit to reasonable timeframe
      if (currentStreak > 365) break;
    }

    // Calculate longest streak
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!vapingDates.has(dateStr)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    const totalPuffs = totalStats?.total_puffs || 0;
    const totalNicotine = totalStats?.total_nicotine || 0;
    const daysActive = totalStats?.days_active || 1;

    return {
      totalPuffs,
      totalNicotine,
      averagePuffsPerDay: totalPuffs / Math.max(daysBack, 1),
      averageNicotinePerDay: totalNicotine / Math.max(daysBack, 1),
      dailyStats: dailyStatsRows.map(row => ({
        date: row.date,
        puffCount: row.puff_count,
        nicotineAmount: row.nicotine_amount,
      })),
      currentStreak,
      longestStreak,
    };
  }
);
