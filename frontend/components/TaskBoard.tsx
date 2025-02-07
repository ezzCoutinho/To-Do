import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { TaskCard } from "@/components/TaskCard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// WebSocket padrão do Django Channels
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
  onUpdate: (id: number, updatedTarefa: Partial<Tarefa>) => void;
}

export function TaskBoard({ tarefas, setTarefas, onDelete }: TaskBoardProps) {
  const columns: { [key: string]: string } = {
    pendente: "Pendente",
    andamento: "Em andamento",
    concluido: "Concluído",
  };

  // Estado para armazenar a conexão WebSocket
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Criar a conexão WebSocket
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("🟢 Conectado ao WebSocket!");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Atualização recebida via WebSocket:", data);

      // Atualiza a UI com a nova tarefa recebida
      setTarefas((tarefas) =>
        tarefas.map((t) => (t.id === data.id ? { ...t, status: data.status } : t))
      );
    };

    ws.onerror = (error) => {
      console.error("❌ Erro no WebSocket:", error);
    };

    ws.onclose = () => {
      console.log("🔴 WebSocket desconectado, tentando reconectar em 3 segundos...");
      setTimeout(() => setSocket(new WebSocket(WS_URL)), 3000);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // Atualiza o status da tarefa e envia pelo WebSocket
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const tarefaId = parseInt(draggableId);
    const novoStatus = destination.droppableId as "pendente" | "andamento" | "concluido";

    setTarefas((tarefas) =>
      tarefas.map((t) => (t.id === tarefaId ? { ...t, status: novoStatus } : t))
    );

    try {
      const response = await fetch(`http://localhost:8000/api/tarefas/${tarefaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (response.ok) {
        console.log("✅ Tarefa atualizada no backend!");
        if (socket) {
          socket.send(JSON.stringify({ id: tarefaId, status: novoStatus }));
          console.log("📡 Atualização enviada via WebSocket!");
        }
      } else {
        console.error("❌ Erro ao atualizar a tarefa no backend.");
      }
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
