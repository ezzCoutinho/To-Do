import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return <p className="text-center mt-10">Você precisa estar logado.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Olá, {session.user?.name}!</h1>
      <Button className="mt-4" onClick={() => signOut()}>
        Sair
      </Button>
    </div>
  );
}
