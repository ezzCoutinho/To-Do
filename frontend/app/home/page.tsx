'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService, User } from '@/lib/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sun,
  Sunset,
  Moon,
  Coffee,
  Clock,
  Calendar,
  CheckCircle,
  Plus,
  TrendingUp,
  Star,
  LogOut,
  User as UserIcon,
  Settings,
  ListTodo,
  Target,
  Zap,
  Heart
} from "lucide-react"

interface GreetingInfo {
  message: string
  icon: React.ReactElement
  gradient: string
  bgGradient: string
}

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticação
    if (!AuthService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const userData = AuthService.getUser()
    setUser(userData)
    setIsLoading(false)

    // Atualizar o relógio a cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [router])

  const getGreeting = (): GreetingInfo => {
    const hour = currentTime.getHours()

    if (hour >= 5 && hour < 12) {
      return {
        message: "Bom dia",
        icon: <Sun className="h-8 w-8 text-yellow-500" />,
        gradient: "from-yellow-400 to-orange-500",
        bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
      }
    } else if (hour >= 12 && hour < 18) {
      return {
        message: "Boa tarde",
        icon: <Sunset className="h-8 w-8 text-orange-500" />,
        gradient: "from-orange-400 to-red-500",
        bgGradient: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
      }
    } else {
      return {
        message: "Boa noite",
        icon: <Moon className="h-8 w-8 text-blue-400" />,
        gradient: "from-blue-400 to-purple-500",
        bgGradient: "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
      }
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    router.push('/login')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <span className="text-gray-900 dark:text-gray-100">Carregando...</span>
        </div>
      </div>
    )
  }

  const greeting = getGreeting()

  return (
    <div className={`min-h-screen bg-gradient-to-br ${greeting.bgGradient} p-4`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com saudação */}
        <Card className="border-2 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${greeting.gradient} bg-opacity-10`}>
                  {greeting.icon}
                </div>
                <div>
                  <CardTitle className={`text-3xl font-bold bg-gradient-to-r ${greeting.gradient} bg-clip-text text-transparent`}>
                    {greeting.message}, {user?.name?.split(' ')[0] || 'Usuário'}! 👋
                  </CardTitle>
                  <CardDescription className="text-lg mt-1">
                    Que tal começarmos um dia produtivo?
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Informações do usuário e tempo */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-gray-400 transition-colors duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <UserIcon className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <CardTitle className="text-xl">Perfil</CardTitle>
              <CardDescription>Suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Nome:</span>
                <Badge variant="secondary">{user?.name}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                <Badge variant="outline" className="text-xs">{user?.email}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">ID:</span>
                <Badge variant="secondary">#{user?.id}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-gray-400 transition-colors duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-gray-700 mx-auto mb-2" />
              <CardTitle className="text-xl">Horário</CardTitle>
              <CardDescription>Informações de tempo atual</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {formatTime(currentTime)}
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {formatDate(currentTime)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-gray-400 transition-colors duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <CardTitle className="text-xl">Status</CardTitle>
              <CardDescription>Sua jornada produtiva</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <Badge className="mb-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <Heart className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Logado e pronto para conquistar o dia!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de ações rápidas */}
        <Card className="border-2 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Zap className="h-6 w-6 mr-2 text-yellow-500" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              O que você gostaria de fazer agora?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="h-6 w-6" />
                <span>Nova Tarefa</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-green-50 hover:border-green-200">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span>Ver Tarefas</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200">
                <Target className="h-6 w-6 text-purple-600" />
                <span>Metas</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-gray-50 hover:border-gray-300">
                <Settings className="h-6 w-6 text-gray-600" />
                <span>Configurações</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas rápidas */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <ListTodo className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">0</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas Pendentes</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-green-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">0</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas Concluídas</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">100%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Produtividade</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-yellow-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">1</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dia de Sequência</p>
            </CardContent>
          </Card>
        </div>

        {/* Mensagem motivacional */}
        <Card className={`border-2 bg-gradient-to-r ${greeting.bgGradient} hover:shadow-lg transition-all duration-300`}>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Coffee className="h-6 w-6 text-gray-600 mr-2" />
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Dica do Dia
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              "A produtividade não é sobre fazer mais coisas, é sobre fazer as coisas certas.
              Comece pequeno, seja consistente e celebre cada vitória! 🎯"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage