import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.detail || "Credenciais inválidas");
          }

          return {
            id: data.user_id, // Use um ID válido (não o token)
            email: credentials.email,
            token: data.token, // Guardamos o token
          };
        } catch (error) {
          throw new Error("Erro ao autenticar");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        // 🔥 Login via provedor OAuth (GitHub/Google)
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.userType = "provider"; // Marca como usuário de provedor
        token.email = user?.email;
      }

      if (user && !account) {
        // 🔥 Login via credenciais do Django
        token.userType = "backend"; // Marca como usuário do backend
        token.accessToken = user.token; // Token do backend
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      // 🔥 Sempre atualizar os dados da sessão corretamente
      session.user.accessToken = token.accessToken;
      session.user.provider = token.provider || "backend"; // Se não houver provider, é do backend
      session.user.userType = token.userType;
      session.user.email = token.email;
      return session;
    }
  }

});
