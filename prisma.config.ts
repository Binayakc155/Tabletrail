import { existsSync } from "fs";
import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env.local first (for Next.js projects)
if (existsSync(".env.local")) {
  loadEnv({ path: ".env.local" });
}

// Load .env only if variables are not already loaded
loadEnv();

export default defineConfig({
  schema: "./prisma/schema.prisma",

  datasource: {
    url: env("DATABASE_URL"),
  },

  migrations: {
    path: "./prisma/migrations",
  },
});