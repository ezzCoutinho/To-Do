"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react"; // Importando o ícone do GitHub

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {/* Formulário de Login */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />

            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>

          <Button className="w-full">Entrar</Button>

          <Separator />

          {/* Login com GitHub */}
          <Button
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            onClick={() => signIn("github")}
          >
            <Github className="h-5 w-5" /> {/* Ícone do GitHub */}
            Entrar com GitHub
          </Button>

          {/* Link para Cadastro */}
          <p className="text-center text-sm">
            Ainda não tem uma conta?{" "}
            <span
              className="text-primary cursor-pointer hover:underline"
              onClick={() => router.push("/register")}
            >
              Cadastre-se
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
