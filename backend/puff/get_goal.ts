import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { puffDB } from "./db";

export interface GetGoalParams {
  userId: number;
  date?: Query<string>;
}

export interface Goal {
  id: number;
  userId: number;
  date: string;
  targetPuffs: number;
  createdAt: Date;
}

export interface GetGoalResponse {
  goal: Goal | null;
  currentPuffs: number;
  progress: number;
}

// Retrieves the goal for a specific date and current progress.
export const getGoal = api<GetGoalParams, GetGoalResponse>(
  { expose: true, method: "GET", path: "/users/:userId/goal" },
  async (params) => {
    const targetDate = params.date || new Date().toISOString().split('T')[0];

    const goal = await puffDB.queryRow<{
      id: number;
      user_id: number;
      date: string;
      target_puffs: number;
      created_at: Date;
    }>`
      SELECT id, user_id, date, target_puffs, created_at
      FROM goals
      WHERE user_id = ${params.userId} AND date = ${targetDate}
    `;

    // Get current puff count for the date
    const startOfDay = `${targetDate} 00:00:00`;
    const endOfDay = `${targetDate} 23:59:59`;

    const puffCount = await puffDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count
      FROM puffs
      WHERE user_id = ${params.userId}
        AND timestamp >= ${startOfDay}
        AND timestamp <= ${endOfDay}
    `;

    const currentPuffs = puffCount?.count || 0;
    const targetPuffs = goal?.target_puffs || 0;
    const progress = targetPuffs > 0 ? (currentPuffs / targetPuffs) * 100 : 0;

    return {
      goal: goal ? {
        id: goal.id,
        userId: goal.user_id,
        date: goal.date,
        targetPuffs: goal.target_puffs,
        createdAt: goal.created_at,
      } : null,
      currentPuffs,
      progress: Math.min(progress, 100),
    };
  }
);
