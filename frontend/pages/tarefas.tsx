"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { TaskBoard } from "@/components/TaskBoard";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";

interface Tarefa {
  id: number;
  titulo: string;
  descricao?: string;
  status: "pendente" | "andamento" | "concluido";
  dataExecucao?: string;
}

export default function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState<Partial<Tarefa>>({
    titulo: "",
    descricao: "",
    status: "pendente",
    dataExecucao: "",
  });

  const router = useRouter();

  const fetchTarefas = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/tarefas");
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    fetchTarefas();
  }, []);

  const atualizarTarefa = async (id: number, updatedTarefa: Partial<Tarefa>) => {
    try {
      await fetch(`http://localhost:8000/api/tarefas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTarefa),
      });
      fetchTarefas(); // Recarrega as tarefas para refletir a mudança
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const adicionarTarefa = async () => {
    if (!novaTarefa.titulo) return;

    try {
      await fetch("http://localhost:8000/api/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTarefa),
      });
      fetchTarefas(); // Atualiza a lista após adicionar
      setNovaTarefa({ titulo: "", descricao: "", status: "pendente", dataExecucao: "" });
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const deletarTarefa = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/tarefas/${id}`, { method: "DELETE" });
      fetchTarefas(); // Atualiza a lista após deletar
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div>
      <Card className="p-4">
        <CardTitle className="text-center text-2xl font-bold">Tarefas</CardTitle>
        <Button onClick={() => setIsOpen(true)}>Adicionar Tarefa</Button>
        <Button onClick={handleLogout} className="ml-4">Logout</Button>
      </Card>

      <TaskBoard tarefas={tarefas} setTarefas={setTarefas} onDelete={deletarTarefa} onUpdate={atualizarTarefa} />

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="bg-white text-black p-6 w-[400px] rounded-md shadow-lg border">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">Nova Tarefa</DrawerTitle>
          </DrawerHeader>

          <Input
            placeholder="Título"
            value={novaTarefa.titulo}
            onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
            className="mb-4 border border-gray-300 bg-white text-black"
          />

          <div className="flex items-center gap-2 mb-4">
            <Select
              value={novaTarefa.status}
              onValueChange={(value) => setNovaTarefa({ ...novaTarefa, status: value as "pendente" | "andamento" | "concluido" })}
            >
              <SelectTrigger className="w-full border border-gray-300 bg-white text-black">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">🟡 Pendente</SelectItem>
                <SelectItem value="andamento">🔵 Em Andamento</SelectItem>
                <SelectItem value="concluido">🟢 Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Descrição"
            value={novaTarefa.descricao}
            onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
            className="mb-4 border border-gray-300 bg-white text-black"
          />

          <Calendar
            selected={novaTarefa.dataExecucao ? new Date(novaTarefa.dataExecucao) : undefined}
            onSelect={(date) => setNovaTarefa({ ...novaTarefa, dataExecucao: date?.toISOString() })}
            className="mb-4"
          />

          <Button onClick={adicionarTarefa}>Salvar</Button>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
