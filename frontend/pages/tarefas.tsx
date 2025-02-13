"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Textarea } from "@/components/ui/textarea";
// import { io } from "socket.io-client";

interface Tarefa {
  id: number;
  titulo: string;
  descricao?: string;
  status: "pendente" | "andamento" | "concluido";
  dataExecucao?: string;
  file_url?: string;
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
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit],
    content: novaTarefa.descricao || "",
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

    const socket = new WebSocket("ws://127.0.0.1:8000/ws/tarefas/");
    setWs(socket);

    socket.onopen = () => {
      console.log("Conectado ao WebSocket!");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Mensagem recebida via WebSocket:", data);

      if (data.id) {
        setTarefas((prevTarefas) => {
          const index = prevTarefas.findIndex((t) => t.id === data.id);
          if (index !== -1) {
            // Atualiza a tarefa existente
            const novasTarefas = [...prevTarefas];
            novasTarefas[index] = data;
            return novasTarefas;
          }
          // Adiciona uma nova tarefa
          return [...prevTarefas, data];
        });
      }
    };

    socket.onclose = () => {
      console.log("Desconectado do WebSocket!");
    };

    socket.onerror = (error) => {
      console.log("Erro no WebSocket:", error);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

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
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar tarefas");
      }
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      setTarefas([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreateTarefa = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("titulo", novaTarefa.titulo);
    formData.append("descricao", novaTarefa.descricao || "");
    formData.append("status", novaTarefa.status || "pendente");

    if (file) {
      formData.append("file", file);  // ✅ Adiciona o arquivo ao FormData
    }

    try {
      const response = await axios.post("http://localhost:8000/api/tarefas", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Tarefa criada com sucesso:", response.data);
      fetchTarefas(); // Atualiza a lista
      resetForm();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  // const handleCreateTarefa = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return router.push("/login");
  //   if (!novaTarefa.titulo) return;

  //   try {
  //     const payload = {
  //       titulo: novaTarefa.titulo,
  //       descricao: novaTarefa.descricao || "",
  //       status: novaTarefa.status || "pendente",
  //     };

  //     const response = await axios.post("http://localhost:8000/api/tarefas", payload, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     console.log("Tarefa criada com sucesso:", response.data);
  //     fetchTarefas();
  //     resetForm();
  //   } catch (error) {
  //     console.error("Erro ao criar tarefa:", error);
  //   }
  // };

  const handleUpdateTarefa = async () => {
    const token = localStorage.getItem("token");
    if (!token || !editingTarefa) return;

    const formData = new FormData();
    formData.append("titulo", novaTarefa.titulo);
    formData.append("descricao", novaTarefa.descricao || "");
    formData.append("status", novaTarefa.status);

    if (file) {
      formData.append("file", file); // ✅ Adiciona o arquivo ao FormData
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/tarefas/${editingTarefa.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // ✅ Necessário para enviar arquivos
        },
      });

      console.log("Tarefa atualizada com sucesso:", response.data);
      fetchTarefas(); // Atualiza a lista de tarefas
      resetForm();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error.response?.data || error);
    }
  };


  // const handleUpdateTarefa = async () => {
  //   if (!editingTarefa) return;
  //   const token = localStorage.getItem("token");
  //   if (!token) return router.push("/login");

  //   try {
  //     const payload = {
  //       titulo: novaTarefa.titulo,
  //       descricao: novaTarefa.descricao,
  //       status: novaTarefa.status,
  //       dataExecucao: novaTarefa.dataExecucao,
  //     };

  //     const response = await axios.put(
  //       `http://localhost:8000/api/tarefas/${editingTarefa.id}`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("Tarefa atualizada com sucesso:", response.data);
  //     fetchTarefas();
  //     resetForm();
  //   } catch (error) {
  //     console.error("Erro ao atualizar tarefa:", error);
  //   }
  // };

  const handleDeleteTarefa = async (tarefaId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    try {
      await axios.delete(`http://localhost:8000/api/tarefas/${tarefaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Tarefa deletada com sucesso");
      fetchTarefas();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const resetForm = () => {
    setNovaTarefa({ titulo: "", descricao: "", status: "pendente", dataExecucao: "" });
    setArquivo(null);
    setEditingTarefa(null);
    setIsOpen(false);
    if (editor) {
      editor.commands.setContent("");
    }
  };

  const handleEditTarefa = (tarefa: Tarefa) => {
    setEditingTarefa(tarefa);
    setNovaTarefa({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || "",
      status: tarefa.status,
      dataExecucao: tarefa.dataExecucao || "",
    });
    if (editor) {
      editor.commands.setContent(tarefa.descricao || "");
    }
    setIsOpen(true);
  };

  const handleSaveTarefa = () => {
    if (editor) {
      setNovaTarefa((prev) => ({
        ...prev,
        descricao: editor.getHTML(),
      }));
    }

    if (editingTarefa) {
      handleUpdateTarefa();
    } else {
      handleCreateTarefa();
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const tarefaId = parseInt(draggableId);
    const novoStatus = destination.droppableId;

    // Atualiza o estado local
    const updatedTarefas = [...tarefas];
    const tarefaIndex = updatedTarefas.findIndex((t) => t.id === tarefaId);
    if (tarefaIndex === -1) return;

    updatedTarefas[tarefaIndex] = {
      ...updatedTarefas[tarefaIndex],
      status: novoStatus,
    };
    setTarefas(updatedTarefas);

    // Atualiza o backend
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      await axios.put(
        `http://localhost:8000/api/tarefas/${tarefaId}`,
        { status: novoStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Tarefa ${tarefaId} movida para ${novoStatus}`);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setTarefas(tarefas);
    }
  };

  return (
    <div className="py-3 px-4 bg-gray-900 text-white min-h-screen">
      <Card className="py-4 px-8 shadow-lg rounded-xl bg-gray-800">
        <CardTitle className="text-center text-3xl font-semibold mb-4 text-white">Tarefas</CardTitle>
        <div className="flex justify-between items-center">
          <Button
            onClick={() => {
              resetForm();
              setIsOpen(true);
            }}
            className="bg-blue-500 text-white"
          >
            + Adicionar Tarefa
          </Button>
          <Button onClick={() => router.push("/login")} className="bg-red-500 text-white ml-4">
            Logout
          </Button>
        </div>
      </Card>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-6 overflow-auto">
          {["pendente", "andamento", "concluido"].map((status) => (
            <div key={status} className="flex-1">
              {/* Cabeçalho separado */}
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                {status === "pendente" ? "🟡 Pendente" : status === "andamento" ? "🔵 Em Andamento" : "🟢 Concluído"}
              </h2>
              <hr className="border-t border-white mb-2" />

              {/* Coluna Droppable */}
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-700 p-4 rounded-lg min-w-[300px] border border-white min-h-[200px]"
                  >
                    <div className="space-y-4">
                      {tarefas.filter((tarefa) => tarefa.status === status).length === 0 ? (
                        <p className="text-gray-400 text-center mt-4">Nada aqui.</p>
                      ) : (
                        tarefas
                          .filter((tarefa) => tarefa.status === status)
                          .map((tarefa, index) => (
                            <Draggable key={tarefa.id} draggableId={tarefa.id.toString()} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-gray-800 p-4 rounded-lg mb-4"
                                >
                                  <h3 className="text-lg font-semibold text-white">{tarefa.titulo}</h3>
                                  <p className="text-gray-300 text-sm">{tarefa.descricao}</p>
                                  {tarefa.file_url && (
                                        <a
                                          href={tarefa.file_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-400 underline mt-2 block"
                                        >
                                          📎 Ver Anexo
                                        </a>
                                      )}

                                  <div className="mt-2 flex justify-between">
                                    <Button
                                      onClick={() => handleEditTarefa(tarefa)}
                                      className="bg-blue-500 text-white text-sm px-3 py-1"
                                    >
                                      Editar
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteTarefa(tarefa.id)}
                                      className="bg-red-500 text-white text-sm px-3 py-1"
                                    >
                                      - Apagar
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>


      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="p-4 w-[300px] bg-gray-800 rounded-xl shadow-2xl">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-semibold text-white">
              {editingTarefa ? "Editar Tarefa" : "Nova Tarefa"}
            </DrawerTitle>
          </DrawerHeader>
          <Input
            placeholder="Título..."
            value={novaTarefa.titulo}
            onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
            className="mb-4 w-full border border-gray-700 bg-gray-600 rounded-md p-3 text-white"
          />
          <div className="mb-4">
            <Select
              value={novaTarefa.status}
              onValueChange={(value) =>
                setNovaTarefa({ ...novaTarefa, status: value as "pendente" | "andamento" | "concluido" })
              }
            >
              <SelectTrigger className="w-full border border-gray-700 bg-gray-600 rounded-md p-3 text-white">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700">
                <SelectItem value="pendente" className="bg-gray-700 text-white">🟡 Pendente</SelectItem>
                <SelectItem value="andamento" className="bg-gray-700 text-white">🔵 Em Andamento</SelectItem>
                <SelectItem value="concluido" className="bg-gray-700 text-white">🟢 Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border border-gray-700 bg-gray-600 rounded-md p-4 min-h-[200px] text-white">
            <Textarea
              placeholder="Adicione uma descrição para a tarefa"
              className="w-full min-h-[150px] bg-gray-800 text-white border-gray-700"
              value={novaTarefa.descricao}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
            />
          </div>

          {/* Novo campo de upload de arquivo */}
          <div className="mt-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md"
            />
          </div>

          {/* Botão de salvar */}
          <div className="mt-4">
            <Button onClick={handleSaveTarefa} className="bg-gray-600 text-white w-full py-2">
              Salvar
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
