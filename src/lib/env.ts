export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  authSecret: process.env.AUTH_SECRET ?? "",
  authUrl: process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "",
  githubClientId: process.env.AUTH_GITHUB_ID ?? "",
  githubClientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
  publicAppUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};
