import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ListTodo, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <ListTodo className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              To-Do
            </h1>
          </div>
          <h2 className="text-2xl text-gray-600 dark:text-gray-300">
            Bem vindo ao To-Do ;)
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Organize suas tarefas de forma simples e eficiente. Transforme sua produtividade com nossa plataforma intuitiva.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-indigo-300 transition-colors duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-xl">Organize</CardTitle>
              <CardDescription>
                Mantenha suas tarefas organizadas e nunca perca o foco
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Intuitivo
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interface limpa e fácil de usar para máxima produtividade
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-indigo-300 transition-colors duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <ListTodo className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-xl">Priorize</CardTitle>
              <CardDescription>
                Defina prioridades e foque no que realmente importa
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Eficiente
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sistema de prioridades para otimizar seu tempo
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-indigo-300 transition-colors duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-2" />
              <CardTitle className="text-xl">Conquiste</CardTitle>
              <CardDescription>
                Acompanhe seu progresso e celebre suas conquistas
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Motivador
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualize seu progresso e mantenha-se motivado
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Pronto para começar?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <ListTodo className="h-5 w-5 mr-2" />
              Criar Primeira Tarefa
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Ver Funcionalidades
            </Button>
          </div>
        </div>

        <div className="text-center pt-8">
          <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
            <Sparkles className="h-4 w-4" />
            <span>Desenvolvido com ❤️ para aumentar sua produtividade</span>
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
