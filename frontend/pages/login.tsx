"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ usa "next/navigation"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react"; // Importando o ícone do GitHub

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/tarefas");
      } else {
        setMessage(data.detail || "Erro ao fazer login.");
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
          <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} className="space-y-2">
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Mensagem de erro/sucesso */}
          {message && (
            <p className={`text-center text-sm ${message.includes("bem-sucedido") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <Separator />

          {/* Login com GitHub */}
          <Button
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            onClick={() => signIn("github")}
          >
            <Github className="w-5 h-5" />
            Entrar com GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
