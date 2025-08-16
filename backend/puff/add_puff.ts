import { api, APIError } from "encore.dev/api";
import { puffDB } from "./db";

export interface AddPuffRequest {
  userId: number;
  nicotineAmount?: number;
}

export interface Puff {
  id: number;
  userId: number;
  timestamp: Date;
  nicotineAmount: number;
}

// Records a new puff for the user.
export const addPuff = api<AddPuffRequest, Puff>(
  { expose: true, method: "POST", path: "/puffs" },
  async (req) => {
    // Get user's default nicotine per puff if not provided
    let nicotineAmount = req.nicotineAmount;
    
    if (nicotineAmount === undefined) {
      const user = await puffDB.queryRow<{ nicotine_per_puff: number }>`
        SELECT nicotine_per_puff FROM users WHERE id = ${req.userId}
      `;
      
      if (!user) {
        throw APIError.notFound("user not found");
      }
      
      nicotineAmount = user.nicotine_per_puff;
    }

    const puff = await puffDB.queryRow<{
      id: number;
      user_id: number;
      timestamp: Date;
      nicotine_amount: number;
    }>`
      INSERT INTO puffs (user_id, nicotine_amount)
      VALUES (${req.userId}, ${nicotineAmount})
      RETURNING id, user_id, timestamp, nicotine_amount
    `;

    if (!puff) {
      throw new Error("Failed to add puff");
    }

    return {
      id: puff.id,
      userId: puff.user_id,
      timestamp: puff.timestamp,
      nicotineAmount: puff.nicotine_amount,
    };
  }
);
