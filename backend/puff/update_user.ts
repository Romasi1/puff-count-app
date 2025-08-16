import { api, APIError } from "encore.dev/api";
import { puffDB } from "./db";

export interface UpdateUserParams {
  id: number;
}

export interface UpdateUserRequest {
  nicotinePerPuff?: number;
  dailyGoal?: number;
}

export interface User {
  id: number;
  createdAt: Date;
  nicotinePerPuff: number;
  dailyGoal: number;
}

// Updates a user's settings.
export const updateUser = api<UpdateUserParams & UpdateUserRequest, User>(
  { expose: true, method: "PUT", path: "/users/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (req.nicotinePerPuff !== undefined) {
      updates.push(`nicotine_per_puff = $${paramIndex++}`);
      values.push(req.nicotinePerPuff);
    }

    if (req.dailyGoal !== undefined) {
      updates.push(`daily_goal = $${paramIndex++}`);
      values.push(req.dailyGoal);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    values.push(req.id);
    const query = `
      UPDATE users 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, created_at, nicotine_per_puff, daily_goal
    `;

    const user = await puffDB.rawQueryRow<{
      id: number;
      created_at: Date;
      nicotine_per_puff: number;
      daily_goal: number;
    }>(query, ...values);

    if (!user) {
      throw APIError.notFound("user not found");
    }

    return {
      id: user.id,
      createdAt: user.created_at,
      nicotinePerPuff: user.nicotine_per_puff,
      dailyGoal: user.daily_goal,
    };
  }
);
