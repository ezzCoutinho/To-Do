"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react"; // Ícone do GitHub

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
  >
    <path fill="#4285F4" d="M24 9.5c3.54 0 6.32 1.17 8.38 2.91l6.19-6.19C34.82 2.34 29.91 0 24 0 14.8 0 6.74 5.82 3 14.25l7.59 5.89C12.11 13.06 17.6 9.5 24 9.5z" />
    <path fill="#34A853" d="M46.5 24.5c0-1.54-.14-3.04-.4-4.5H24v9.09h12.91c-.55 2.78-2.09 5.15-4.42 6.76l7.59 5.89c4.42-4.1 6.97-10.12 6.97-17.24z" />
    <path fill="#FBBC05" d="M10.41 28.09c-1.23-3.66-1.23-7.68 0-11.34L3 14.25c-2.84 5.67-2.84 12.34 0 18.01l7.41-4.17z" />
    <path fill="#EA4335" d="M24 48c6.33 0 11.62-2.1 15.49-5.71l-7.59-5.89c-2.08 1.41-4.73 2.27-7.9 2.27-6.4 0-11.89-3.56-14.41-8.89L3 32.26C6.74 40.18 14.8 46 24 46z" />
  </svg>
);

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
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // 🔐 Salva o token no LocalStorage
        console.log("Token salvo no LocalStorage:", data.token);
        router.push("/tarefas"); // ✅ Redireciona para a página de tarefas
      } else {
        setMessage("Email ou senha incorretos!");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setMessage("Erro ao conectar com o servidor.");
    }

    setLoading(false);
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
            <p className={`text-center text-sm ${message.includes("incorretos") ? "text-red-500" : "text-green-500"}`}>
              {message}
            </p>
          )}

          <Separator />

          {/* Login com GitHub */}
          <Button
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            onClick={() => signIn("github", { callbackUrl: "/tarefas" })}
          >
            <Github className="w-5 h-5" />
            Entrar com GitHub
          </Button>

          {/* Login com Google */}
          <Button
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/tarefas" })}
          >
            <GoogleIcon />
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
