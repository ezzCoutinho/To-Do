"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function ProviderButtons() {
  const handleProviderLogin = (provider: string) => {
    signIn(provider);
  };

  return (
    <div className="space-y-2">
      <Button onClick={() => handleProviderLogin("google")} className="w-full">
        Login com Google
      </Button>
      <Button onClick={() => handleProviderLogin("github")} className="w-full">
        Login com GitHub
      </Button>
    </div>
  );
}
