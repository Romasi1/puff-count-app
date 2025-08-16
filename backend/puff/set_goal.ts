import { api } from "encore.dev/api";
import { puffDB } from "./db";

export interface SetGoalRequest {
  userId: number;
  date: string;
  targetPuffs: number;
}

export interface Goal {
  id: number;
  userId: number;
  date: string;
  targetPuffs: number;
  createdAt: Date;
}

// Sets or updates a daily puff goal for a user.
export const setGoal = api<SetGoalRequest, Goal>(
  { expose: true, method: "POST", path: "/goals" },
  async (req) => {
    const goal = await puffDB.queryRow<{
      id: number;
      user_id: number;
      date: string;
      target_puffs: number;
      created_at: Date;
    }>`
      INSERT INTO goals (user_id, date, target_puffs)
      VALUES (${req.userId}, ${req.date}, ${req.targetPuffs})
      ON CONFLICT (user_id, date)
      DO UPDATE SET target_puffs = ${req.targetPuffs}
      RETURNING id, user_id, date, target_puffs, created_at
    `;

    if (!goal) {
      throw new Error("Failed to set goal");
    }

    return {
      id: goal.id,
      userId: goal.user_id,
      date: goal.date,
      targetPuffs: goal.target_puffs,
      createdAt: goal.created_at,
    };
  }
);
