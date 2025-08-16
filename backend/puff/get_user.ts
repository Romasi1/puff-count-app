import { api, APIError } from "encore.dev/api";
import { puffDB } from "./db";

export interface GetUserParams {
  id: number;
}

export interface User {
  id: number;
  createdAt: Date;
  nicotinePerPuff: number;
  dailyGoal: number;
}

// Retrieves a user profile by ID.
export const getUser = api<GetUserParams, User>(
  { expose: true, method: "GET", path: "/users/:id" },
  async (params) => {
    const user = await puffDB.queryRow<{
      id: number;
      created_at: Date;
      nicotine_per_puff: number;
      daily_goal: number;
    }>`
      SELECT id, created_at, nicotine_per_puff, daily_goal
      FROM users
      WHERE id = ${params.id}
    `;

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
