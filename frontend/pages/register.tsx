"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ usa "next/navigation"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "", // Adicionando o campo de confirmação de senha
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Verificar se as senhas coincidem antes de enviar
    if (formData.password !== formData.confirm_password) {
      setMessage("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registrado com sucesso! Redirecionando...");
        setTimeout(() => window.location.href = "http://localhost:3000/login", 5000);
      } else {
        setMessage(data.detail || "Erro ao criar conta.");
      }
    } catch (error) {
      setMessage("Erro no servidor. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Criar Conta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {/* Formulário de Registro */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <Label htmlFor="username">Nome</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Seu Nome"
              onChange={handleChange}
              required
            />

            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              onChange={handleChange}
              required
            />

            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />

            <Label htmlFor="confirm_password">Confirmar Senha</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando Conta..." : "Criar Conta"}
            </Button>
          </form>

          {/* Mensagem de erro/sucesso */}
          {message && (
            <p className={`text-center text-sm ${message.includes("sucesso") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}

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
