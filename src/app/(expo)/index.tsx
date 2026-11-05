import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, LogOut, Package, Users, Activity, TrendingUp } from 'lucide-react-native';

// 1. Componente para os "Cards" de Resumo (KPIs)
const KPICard = ({ titulo, valor, icone: Icon, cor }: any) => (
  <View className="bg-white dark:bg-zinc-800 p-4 rounded-2xl flex-1 mx-1 shadow-sm border border-zinc-200 dark:border-zinc-700">
    <View className={`w-10 h-10 rounded-full ${cor} items-center justify-center mb-3`}>
      <Icon size={20} color="#ffffff" />
    </View>
    <Text className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold mb-1">{titulo}</Text>
    <Text className="text-zinc-900 dark:text-zinc-100 text-2xl font-bold">{valor}</Text>
  </View>
);

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <ScrollView 
      className="flex-1 bg-zinc-50 dark:bg-[#0a0a0a]"
      showsVerticalScrollIndicator={false}
    >
      {/* 2. Cabeçalho Curvo (Estilo App de Banco) */}
      <View className="pt-16 pb-12 px-6 bg-blue-600 rounded-b-[40px]">
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-blue-100 text-sm font-medium mb-1">Bem-vindo de volta,</Text>
            <Text className="text-white text-2xl font-bold">{user?.nome || 'Utilizador'}</Text>
          </View>
          <View className="bg-white/20 p-3 rounded-full">
            <LayoutDashboard size={24} color="#ffffff" />
          </View>
        </View>
      </View>

      {/* 3. Área de Conteúdo (Sobreposta ao cabeçalho curvo) */}
      <View className="px-5 -mt-8">
        
        {/* Linha de KPIs */}
        <View className="flex-row justify-between mb-6">
           <KPICard titulo="Pedidos" valor="12" icone={Package} cor="bg-blue-500" />
           <KPICard titulo="Produção" valor="05" icone={Activity} cor="bg-amber-500" />
           <KPICard titulo="Clientes" valor="48" icone={Users} cor="bg-emerald-500" />
        </View>

        {/* 4. Gráfico Simulado (Barra de Status da Fábrica) */}
        <View className="bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 mb-8">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">Visão Geral da Produção</Text>
            <TrendingUp size={20} color="#71717a" />
          </View>

          {/* Barra de Progresso Customizada (O 'Gráfico') */}
          <View className="h-4 rounded-full flex-row overflow-hidden mb-4">
            <View className="bg-blue-500 w-[25%]" />
            <View className="bg-amber-500 w-[50%]" />
            <View className="bg-emerald-500 w-[25%]" />
          </View>

          {/* Legenda do Gráfico */}
          <View className="flex-row justify-between px-1">
            <View className="items-center">
              <View className="flex-row items-center">
                <View className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"/>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Novos (25%)</Text>
              </View>
            </View>
            <View className="items-center">
              <View className="flex-row items-center">
                <View className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"/>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Fábrica (50%)</Text>
              </View>
            </View>
            <View className="items-center">
              <View className="flex-row items-center">
                <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"/>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Prontos (25%)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. Botão de Logout Moderno */}
        <TouchableOpacity 
          onPress={logout}
          activeOpacity={0.7}
          className="flex-row items-center bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-6 py-4 rounded-xl w-full justify-center mb-10"
        >
          <LogOut color="#ef4444" size={20} />
          <Text className="text-red-500 dark:text-red-400 font-bold text-base ml-2">
            Encerrar Sessão
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}