"use client";

import { useState, useEffect } from "react";
import { TaskBoard } from "@/components/TaskBoard";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

interface Tarefa {
  id: number;
  titulo: string;
  descricao?: string;
  status: "pendente" | "andamento" | "concluido";
}

export default function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/tarefas/")
      .then((res) => res.json())
      .then((data) => setTarefas(data));
  }, []);

  const adicionarTarefa = async () => {
    const novaTarefa: Tarefa = {
      id: Math.floor(Math.random() * 10000),
      titulo: "Nova Tarefa",
      descricao: "Descrição da tarefa",
      status: "pendente",
    };

    setTarefas([...tarefas, novaTarefa]);

    await fetch("http://localhost:8000/api/tarefas/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaTarefa),
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <Card className="w-full p-4 shadow-md flex justify-between items-center">
        <CardTitle className="text-2xl font-semibold">Gerenciador de Tarefas</CardTitle>
        <Button onClick={adicionarTarefa} className="bg-gray-700 text-white px-3 py-1 text-sm hover:bg-gray-600">
          + Adicionar
        </Button>
      </Card>

      {/* Kanban Board */}
      <div className="mt-6">
        <TaskBoard tarefas={tarefas} setTarefas={setTarefas} />
      </div>
    </div>
  );
}
