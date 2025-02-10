import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { TaskCard } from "@/components/TaskCard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// URL do WebSocket para Django Channels
const WS_URL = "ws://localhost:8000/ws/tarefas/";

interface Tarefa {
  id: number;
  titulo: string;
  descricao?: string;
  status: "pendente" | "andamento" | "concluido";
}

interface TaskBoardProps {
  tarefas: Tarefa[];
  setTarefas: (tarefas: Tarefa[]) => void;
  onDelete: (id: number) => void;
}

export function TaskBoard({ tarefas, setTarefas, onDelete }: TaskBoardProps) {
  const router = useRouter();
  const columns: { [key: string]: string } = {
    pendente: "Pendente",
    andamento: "Em andamento",
    concluido: "Concluído",
  };

  // Estado para conexão WebSocket
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Estabelecendo a conexão WebSocket com verificação
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("🟢 Conectado ao WebSocket!");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Atualização recebida via WebSocket:", data);

      setTarefas((tarefas) =>
        tarefas.some((t) => t.id === data.id && t.status !== data.status)
          ? tarefas.map((t) => (t.id === data.id ? { ...t, status: data.status } : t))
          : tarefas
      );
    };

    ws.onerror = (error) => console.error("❌ Erro no WebSocket:", error);

    ws.onclose = () => {
      console.log("🔴 WebSocket desconectado, tentando reconectar em 3 segundos...");
      setTimeout(() => setSocket(new WebSocket(WS_URL)), 3000); // Tentativa de reconectar
    };

    setSocket(ws);

    return () => ws.close();
  }, []); // Hook que só rodará uma vez

  // 🔥 Busca tarefas para atualizar a UI após mudança de status
  const fetchTarefas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Nenhum token encontrado!");
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
        console.error("❌ Erro ao buscar tarefas:", response.status);
        return;
      }

      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error("❌ Erro na requisição:", error);
    }
  };

  // 🔄 Atualiza status da tarefa ao arrastar para outra coluna
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Nenhum token encontrado no LocalStorage!");
      router.push("/login");
      return;
    }

    const tarefaId = result.draggableId;
    const novoStatus = result.destination.droppableId;

    try {
      const response = await fetch(`http://localhost:8000/api/tarefas/${tarefaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 Alterado para "Bearer"
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro ao atualizar tarefa:", response.status);
        console.error("❌ Resposta do servidor:", errorText);
        return;
      }

      console.log(`✅ Tarefa ${tarefaId} movida para ${novoStatus}`);

      // Atualizar a UI local após mudança de status
      setTarefas((tarefas) =>
        tarefas.map((t) => (t.id === tarefaId ? { ...t, status: novoStatus } : t))
      );

      // Enviar a atualização via WebSocket para todos os clientes conectados
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            id: tarefaId,
            status: novoStatus,
          })
        );
        console.log("📤 Enviada atualização para WebSocket");
      } else {
        console.log("❌ WebSocket não está aberto. Tentando reconectar...");
        setSocket(new WebSocket(WS_URL)); // Recriar WebSocket se estiver fechado
      }

      // Também pode fazer a busca novamente para garantir a sincronização (se necessário)
      fetchTarefas();
    } catch (error) {
      console.error("❌ Erro na requisição:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-6 min-h-screen">
        {Object.keys(columns).map((columnId) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold">{columns[columnId]}</h2>
                  </CardHeader>
                  <CardContent>
                    {tarefas
                      .filter((tarefa) => tarefa.status === columnId)
                      .map((tarefa, index) => (
                        <Draggable key={tarefa.id} draggableId={tarefa.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4"
                            >
                              <TaskCard tarefa={tarefa} />
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(tarefa.id);
                                }}
                                className="mt-2"
                              >
                                Apagar
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </CardContent>
                </Card>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
