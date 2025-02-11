import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskBoard } from "@/components/TaskBoard";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import axios from "axios";

interface Tarefa {
  id: number;
  titulo: string;
  descricao?: string;
  status: "pendente" | "andamento" | "concluido";
  dataExecucao?: string;
  file_url?: string; // Adicionando a URL do arquivo
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

  const [arquivo, setArquivo] = useState<File | null>(null); // Estado para o arquivo
  const router = useRouter();

  // Editor do Tiptap
  const editor = useEditor({
    extensions: [StarterKit],
    content: novaTarefa.descricao || '',
    onUpdate: ({ editor }) => {
      setNovaTarefa({ ...novaTarefa, descricao: editor.getHTML() });
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchTarefas();
    }
  }, []);

  // 🔥 Busca as tarefas autenticadas
  const fetchTarefas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/tarefas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Erro ao buscar tarefas:", response.status);
        return;
      }

      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  // ➕ Adiciona uma nova tarefa
  const adicionarTarefa = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    if (!novaTarefa.titulo) return;

    try {
      const formData = new FormData();
      formData.append("titulo", novaTarefa.titulo);
      formData.append("descricao", novaTarefa.descricao || "");
      formData.append("status", novaTarefa.status || "pendente");
      formData.append("dataExecucao", novaTarefa.dataExecucao || "");

      if (arquivo) {
        formData.append("file", arquivo); // Envia o arquivo
      }

      const response = await axios.post("http://localhost:8000/api/tarefas", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Configura para enviar arquivos
        },
      });

      fetchTarefas();
      setNovaTarefa({ titulo: "", descricao: "", status: "pendente", dataExecucao: "" });
      setArquivo(null); // Limpa o arquivo
      setIsOpen(false);

      console.log("Tarefa salva com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Card className="p-6 shadow-lg rounded-xl bg-gray-800">
        <CardTitle className="text-center text-3xl font-semibold mb-4">Tarefas</CardTitle>
        <div className="flex justify-between items-center">
          <Button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white">
            Adicionar Tarefa
          </Button>
          <Button onClick={() => router.push("/login")} className="bg-red-500 text-white ml-4">
            Logout
          </Button>
        </div>
      </Card>

      <TaskBoard tarefas={tarefas} setTarefas={setTarefas} />

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="p-6 w-[400px] bg-gray-800 rounded-xl shadow-2xl">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-semibold text-white">Nova Tarefa</DrawerTitle>
          </DrawerHeader>

          <Input
            placeholder="Título"
            value={novaTarefa.titulo}
            onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
            className="mb-4 w-full border border-gray-700 bg-gray-600 rounded-md p-3 text-white"
          />

          <div className="mb-4">
            <Select
              value={novaTarefa.status}
              onValueChange={(value) => setNovaTarefa({ ...novaTarefa, status: value as "pendente" | "andamento" | "concluido" })}
            >
              <SelectTrigger className="w-full border border-gray-700 bg-gray-600 rounded-md p-3 text-white">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">🟡 Pendente</SelectItem>
                <SelectItem value="andamento">🔵 Em Andamento</SelectItem>
                <SelectItem value="concluido">🟢 Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Editor Tiptap */}
          <div className="mb-4">
            <EditorContent editor={editor} className="border border-gray-700 bg-gray-600 rounded-md p-4 min-h-[200px] text-white" />
          </div>

          <Calendar
            selected={novaTarefa.dataExecucao ? new Date(novaTarefa.dataExecucao) : undefined}
            onSelect={(date) => setNovaTarefa({ ...novaTarefa, dataExecucao: date?.toISOString() })}
            className="mb-4"
          />

          <Input
            type="file"
            onChange={(e) => setArquivo(e.target.files ? e.target.files[0] : null)} // Captura o arquivo
            className="mb-4 w-full"
          />

          <Button onClick={adicionarTarefa} className="bg-green-500 text-white w-full py-2">
            Salvar
          </Button>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
