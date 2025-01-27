import { betterAuth } from "better-auth";

export const { handler } = betterAuth({
  providers: [
    // Configure os provedores de autenticação, como Google e GitHub
    {
      id: "google",
      name: "Google",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
