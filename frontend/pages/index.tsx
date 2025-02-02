"use client";

import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className={cn("w-full max-w-md p-6 shadow-lg")}>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Bem-vindo ao <span className="text-primary">To_Do</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Button
            className="w-full"
            variant="default"
            onClick={() => router.push("/login")}
          >
            Já tem uma conta? Clique aqui
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => router.push("/register")}
          >
            Ainda não tem uma conta? Clique aqui
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
