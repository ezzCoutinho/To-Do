"use client";

import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Criar Conta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {/* Formulário de Registro */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" type="text" placeholder="Seu Nome" />

            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />

            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>

          <Button className="w-full">Criar Conta</Button>

          <Separator />

          {/* Link para Login */}
          <p className="text-center text-sm">
            Já tem uma conta?{" "}
            <span
              className="text-primary cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Faça login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
