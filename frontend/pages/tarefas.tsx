"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { TaskBoard } from "@/components/TaskBoard";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Tarefa {
  id: number;
  titulo: string;
  descricao?: string;
  status: "pendente" | "andamento" | "concluido";
}

export default function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir o modal
  const [novaTarefa, setNovaTarefa] = useState<Partial<Tarefa>>({
    titulo: "",
    descricao: "",
    status: "pendente",
  });
  const [editandoTarefa, setEditandoTarefa] = useState<Tarefa | null>(null); // Estado para a tarefa sendo editada

  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/tarefas")
      .then((res) => res.json())
      .then((data) => setTarefas(data));
  }, []);

  const adicionarTarefa = async () => {
    if (!novaTarefa.titulo) return; // Evita adicionar sem título

    const response = await fetch("http://localhost:8000/api/tarefas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaTarefa),
    });

    const tarefa = await response.json();
    setTarefas([...tarefas, tarefa]);
    setIsOpen(false);
    setNovaTarefa({ titulo: "", descricao: "", status: "pendente" });
  };

  const atualizarTarefa = async () => {
    if (!editandoTarefa) return;

    const response = await fetch(`http://localhost:8000/api/tarefas/${editandoTarefa.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editandoTarefa),
    });

    const tarefaAtualizada = await response.json();
    setTarefas(tarefas.map((tarefa) => (tarefa.id === tarefaAtualizada.id ? tarefaAtualizada : tarefa)));
    setIsOpen(false);
    setEditandoTarefa(null);
  };

  const deletarTarefa = async (id: number) => {
    await fetch(`http://localhost:8000/api/tarefas/${id}`, {
      method: "DELETE",
    });
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const abrirModal = (tarefa?: Tarefa) => {
    if (tarefa) {
      setEditandoTarefa(tarefa);
    } else {
      setNovaTarefa({ titulo: "", descricao: "", status: "pendente" });
    }
    setIsOpen(true);
  };

  const fecharModal = () => {
    setIsOpen(false);
    setEditandoTarefa(null);
  };

  return (
    <div>
      <Card>
        <CardTitle className="text-center text-2xl font-bold">Tarefas</CardTitle>
        <Button onClick={() => abrirModal()}>Adicionar Tarefa</Button>
        <Button onClick={handleLogout} className="ml-4">Logout</Button>
      </Card>
      <TaskBoard tarefas={tarefas} setTarefas={setTarefas} onDelete={deletarTarefa} onEdit={abrirModal} />
      <Dialog open={isOpen} onOpenChange={fecharModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editandoTarefa ? "Editar Tarefa" : "Adicionar Tarefa"}</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              name="titulo"
              value={editandoTarefa ? editandoTarefa.titulo : novaTarefa.titulo}
              onChange={(e) => {
                const value = e.target.value;
                if (editandoTarefa) {
                  setEditandoTarefa({ ...editandoTarefa, titulo: value });
                } else {
                  setNovaTarefa({ ...novaTarefa, titulo: value });
                }
              }}
              required
            />
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={editandoTarefa ? editandoTarefa.descricao : novaTarefa.descricao}
              onChange={(e) => {
                const value = e.target.value;
                if (editandoTarefa) {
                  setEditandoTarefa({ ...editandoTarefa, descricao: value });
                } else {
                  setNovaTarefa({ ...novaTarefa, descricao: value });
                }
              }}
            />
            <Label htmlFor="status">Status</Label>
            <Select
              value={editandoTarefa ? editandoTarefa.status : novaTarefa.status}
              onValueChange={(value) => {
                if (editandoTarefa) {
                  setEditandoTarefa({ ...editandoTarefa, status: value as Tarefa["status"] });
                } else {
                  setNovaTarefa({ ...novaTarefa, status: value as Tarefa["status"] });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={editandoTarefa ? atualizarTarefa : adicionarTarefa}>
              {editandoTarefa ? "Atualizar Tarefa" : "Adicionar Tarefa"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
