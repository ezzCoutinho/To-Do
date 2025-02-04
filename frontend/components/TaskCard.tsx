import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface TaskProps {
  tarefa: {
    id: number;
    titulo: string;
    descricao?: string;
    status: "pendente" | "andamento" | "concluido";
  };
}

export function TaskCard({ tarefa }: TaskProps) {
  return (
    <Card className="bg-card text-white p-3 rounded-lg shadow-md hover:shadow-lg transition min-h-[80px] max-w-[250px] flex flex-col">
      <CardHeader className="font-semibold text-sm leading-tight truncate">{tarefa.titulo}</CardHeader>
      <CardContent className="text-xs text-gray-300 overflow-hidden text-ellipsis">
        {tarefa.descricao}
      </CardContent>
    </Card>
  );
}
