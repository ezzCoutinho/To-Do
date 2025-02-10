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
        const res = await fetch("http://127.0.0.1:8000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();

        if (res.ok && data.token) {
          return {
            id: data.token,  // Guardamos o token como ID
            email: credentials.email,
            token: data.token, // Adicionamos o token ao objeto do usuário
          };
        } else {
          throw new Error("Credenciais inválidas");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token; // Salvar token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken; // Adicionar token na sessão
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/tarefas"; // Redireciona para /tarefas após login
    },
  },
});
