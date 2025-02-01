// filepath: /pages/index.tsx
import { useSession } from "next-auth/react";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import { LoginForm } from "@/components/auth/LoginForm";
import { ProviderButtons } from "@/components/auth/ProviderButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {session ? (
        <>
          <div>
            <h1>Welcome to NextAuth.js</h1>
            <p>Signed in as {session?.user?.email}</p>
            <LogoutButton />
          </div>
        </>
      ) : (
        <Card className="w-full max-w-sm p-4 shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Formulário de Login */}
            <LoginForm />
            <div className="my-6" />
            {/* Botões de Login com provedores */}
            <ProviderButtons />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
