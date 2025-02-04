import { useState, useEffect } from "react";
import { TaskBoard } from "@/components/TaskBoard";

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
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tarefas</h1>
        <button
          onClick={adicionarTarefa}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          + Tarefa
        </button>
      </div>
      <TaskBoard tarefas={tarefas} setTarefas={setTarefas} />
    </div>
  );
}
