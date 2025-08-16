import { SQLDatabase } from "encore.dev/storage/sqldb";

export const puffDB = new SQLDatabase("puff", {
  migrations: "./migrations",
});
