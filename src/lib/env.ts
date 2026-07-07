export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  authSecret: process.env.AUTH_SECRET ?? "tabletrail-development-secret",
  authUrl: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  githubClientId: process.env.AUTH_GITHUB_ID ?? "",
  githubClientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
  googleLoginEnabled: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === "true",
  publicAppUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};
