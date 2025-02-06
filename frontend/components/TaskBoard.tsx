import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { TaskCard } from "@/components/TaskCard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  onEdit: (tarefa: Tarefa) => void;
}

export function TaskBoard({ tarefas, setTarefas, onDelete, onEdit }: TaskBoardProps) {
  const columns: { [key: string]: string } = {
    pendente: "Pendente",
    andamento: "Em andamento",
    concluido: "Concluído",
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedTasks = [...tarefas];
    const movedTask = updatedTasks.find((t) => t.id === parseInt(result.draggableId));

    if (movedTask) {
      movedTask.status = result.destination.droppableId as "pendente" | "andamento" | "concluido";
      setTarefas(updatedTasks);
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
                              onClick={() => onEdit(tarefa)}
                            >
                              <TaskCard tarefa={tarefa} />
                              <Button onClick={(e) => { e.stopPropagation(); onDelete(tarefa.id); }}>Apagar</Button>
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
