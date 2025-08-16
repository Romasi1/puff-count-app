import { api } from "encore.dev/api";
import { puffDB } from "./db";

export interface CreateUserRequest {
  nicotinePerPuff?: number;
  dailyGoal?: number;
}

export interface User {
  id: number;
  createdAt: Date;
  nicotinePerPuff: number;
  dailyGoal: number;
}

// Creates a new user profile.
export const createUser = api<CreateUserRequest, User>(
  { expose: true, method: "POST", path: "/users" },
  async (req) => {
    const nicotinePerPuff = req.nicotinePerPuff ?? 0.5;
    const dailyGoal = req.dailyGoal ?? 0;

    const user = await puffDB.queryRow<{
      id: number;
      created_at: Date;
      nicotine_per_puff: number;
      daily_goal: number;
    }>`
      INSERT INTO users (nicotine_per_puff, daily_goal)
      VALUES (${nicotinePerPuff}, ${dailyGoal})
      RETURNING id, created_at, nicotine_per_puff, daily_goal
    `;

    if (!user) {
      throw new Error("Failed to create user");
    }

    return {
      id: user.id,
      createdAt: user.created_at,
      nicotinePerPuff: user.nicotine_per_puff,
      dailyGoal: user.daily_goal,
    };
  }
);
