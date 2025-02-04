import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { TaskCard } from "@/components/TaskCard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface Tarefa {
  id: number;
  titulo: string;
  descricao?: string;
  status: "pendente" | "andamento" | "concluido";
}

interface TaskBoardProps {
  tarefas: Tarefa[];
  setTarefas: (tarefas: Tarefa[]) => void;
}

export function TaskBoard({ tarefas, setTarefas }: TaskBoardProps) {
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
        {Object.entries(columns).map(([status, title]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <Card
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-3 shadow-lg h-full max-h-[600px] flex flex-col"
              >
                <CardHeader className="font-semibold text-md text-center">{title}</CardHeader>
                <CardContent className="flex flex-col gap-2 flex-grow overflow-y-auto">
                  {tarefas
                    .filter((t) => t.status === status)
                    .map((tarefa, index) => (
                      <Draggable key={tarefa.id} draggableId={String(tarefa.id)} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex-shrink-0"
                          >
                            <TaskCard tarefa={tarefa} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </CardContent>
              </Card>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
