"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { Trash } from "lucide-react";

interface Tarefa {
  id: number;
  titulo: string;
  status: "pendente" | "andamento" | "concluido";
  atualizado: string;
  criado: string;
}

export default function Archived() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/tarefas/arquivadas")
      .then((res) => res.json())
      .then((data) => setTarefas(data));
  }, []);

  const deletarTarefa = async (id: number) => {
    await fetch(`http://localhost:8000/api/tarefas/${id}`, {
      method: "DELETE",
    });
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  const tarefasFiltradas = tarefas.filter((tarefa) =>
    tarefa.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <Card>
        <CardTitle className="text-2xl font-bold text-white mb-4">Arquivados</CardTitle>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
        </div>
      </Card>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Ações</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Atualizado</TableHead>
            <TableHead>Criado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tarefasFiltradas.length > 0 ? (
            tarefasFiltradas.map((tarefa) => (
              <TableRow key={tarefa.id}>
                <TableCell>
                  <Button variant="destructive" size="icon" onClick={() => deletarTarefa(tarefa.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>{tarefa.titulo}</TableCell>
                <TableCell>
                  <span className={tarefa.status === "pendente" ? "text-yellow-500" : tarefa.status === "andamento" ? "text-blue-500" : "text-green-500"}>
                    {tarefa.status === "pendente" ? "🟡 Pendente" : tarefa.status === "andamento" ? "🔵 Em andamento" : "🟢 Concluído"}
                  </span>
                </TableCell>
                <TableCell>{tarefa.atualizado}</TableCell>
                <TableCell>{tarefa.criado}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                Nenhuma tarefa arquivada encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
