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
    <Card className="mb-4 bg-gray-700 text-white p-4 rounded-lg shadow">
      <CardHeader className="font-bold">{tarefa.titulo}</CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300">{tarefa.descricao}</p>
        <span className="text-xs bg-gray-600 px-2 py-1 rounded mt-2 inline-block">
          {tarefa.status}
        </span>
      </CardContent>
    </Card>
  );
}
