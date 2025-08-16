import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { puffDB } from "./db";

export interface GetPuffsParams {
  userId: number;
  startDate?: Query<string>;
  endDate?: Query<string>;
  limit?: Query<number>;
}

export interface Puff {
  id: number;
  userId: number;
  timestamp: Date;
  nicotineAmount: number;
}

export interface GetPuffsResponse {
  puffs: Puff[];
}

// Retrieves puffs for a user within a date range.
export const getPuffs = api<GetPuffsParams, GetPuffsResponse>(
  { expose: true, method: "GET", path: "/users/:userId/puffs" },
  async (params) => {
    let query = `
      SELECT id, user_id, timestamp, nicotine_amount
      FROM puffs
      WHERE user_id = $1
    `;
    const queryParams: any[] = [params.userId];
    let paramIndex = 2;

    if (params.startDate) {
      query += ` AND timestamp >= $${paramIndex++}`;
      queryParams.push(params.startDate);
    }

    if (params.endDate) {
      query += ` AND timestamp <= $${paramIndex++}`;
      queryParams.push(params.endDate);
    }

    query += ` ORDER BY timestamp DESC`;

    if (params.limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(params.limit);
    }

    const rows = await puffDB.rawQueryAll<{
      id: number;
      user_id: number;
      timestamp: Date;
      nicotine_amount: number;
    }>(query, ...queryParams);

    const puffs = rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      timestamp: row.timestamp,
      nicotineAmount: row.nicotine_amount,
    }));

    return { puffs };
  }
);
