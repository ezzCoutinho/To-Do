import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

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
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, title]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-800 p-4 rounded-lg min-h-[300px]"
              >
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                {tarefas
                  .filter((t) => t.status === status)
                  .map((tarefa, index) => (
                    <Draggable key={tarefa.id} draggableId={String(tarefa.id)} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TaskCard tarefa={tarefa} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
