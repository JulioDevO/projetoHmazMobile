import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sun,
  Moon,
  LogOut,
  Package,
  Factory,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench,
} from 'lucide-react-native';
import * as AuthModule from '../../context/AuthContext';

// --- SINCRONIZADOR GLOBAL DE TEMA (CLARO / ESCURO) ---
const globalTheme = globalThis as unknown as {
  __hmazIsDark?: boolean;
  __hmazListeners?: Set<(val: boolean) => void>;
};
if (!globalTheme.__hmazListeners) {
  globalTheme.__hmazListeners = new Set();
}

function useGlobalTheme() {
  const [isDark, setIsDark] = useState<boolean>(!!globalTheme.__hmazIsDark);

  useEffect(() => {
    const listener = (novoValor: boolean) => setIsDark(novoValor);
    globalTheme.__hmazListeners!.add(listener);
    setIsDark(!!globalTheme.__hmazIsDark);
    return () => {
      globalTheme.__hmazListeners!.delete(listener);
    };
  }, []);

  const toggleTheme = () => {
    const novoValor = !globalTheme.__hmazIsDark;
    globalTheme.__hmazIsDark = novoValor;
    globalTheme.__hmazListeners!.forEach((fn) => fn(novoValor));
  };

  return { isDark, toggleTheme };
}
// -----------------------------------------------------

export default function DashboardScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useGlobalTheme();

  // Conecta ao AuthContext do projeto para encerrar a sessão real
  const authHook = (AuthModule as any).useAuth;
  const authContextObj = (AuthModule as any).AuthContext || (AuthModule as any).default;
  const auth = authHook ? authHook() : authContextObj ? useContext(authContextObj) : null;

  const kpis = {
    totalPedidos: 12,
    emProducao: 5,
    clientesAtivos: 8,
    taxaConclusao: '84%',
  };

  const etapasFabrica = [
    { label: 'Novos', qtd: 3, cor: 'bg-blue-500', pct: 25 },
    { label: 'Produção', qtd: 5, cor: 'bg-amber-500', pct: 42 },
    { label: 'Revisão', qtd: 2, cor: 'bg-purple-500', pct: 17 },
    { label: 'Finalizados', qtd: 2, cor: 'bg-emerald-500', pct: 16 },
  ];

  const ordensUrgentes = [
    {
      id: '1',
      codigo: '#PED-1042',
      maquina: 'Moinho Triturador H-500',
      cliente: 'Agropecuária São José',
      etapa: 'Novos',
      prazo: '20/11/2026',
    },
    {
      id: '2',
      codigo: '#PED-1038',
      maquina: 'Rosca Transportadora RT-300',
      cliente: 'Cooperativa Seridó',
      etapa: 'Produção',
      prazo: '18/11/2026',
    },
  ];

  // Encerra a sessão no AuthContext e volta para a página única de Login (src/app/login.tsx)
  const handleLogout = () => {
    if (auth) {
      if (typeof auth.signOut === 'function') auth.signOut();
      else if (typeof auth.logout === 'function') auth.logout();
      else if (typeof auth.logOut === 'function') auth.logOut();
      else if (typeof auth.deslogar === 'function') auth.deslogar();
      else if (typeof auth.setUser === 'function') auth.setUser(null);
      else if (typeof auth.setSigned === 'function') auth.setSigned(false);
    }
    router.replace('/login');
  };

  const bgTela = isDark ? 'bg-slate-950' : 'bg-slate-100';
  const bgCard = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
  const bgSubCard = isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200/60';
  const textoTitulo = isDark ? 'text-white' : 'text-slate-800';
  const textoSub = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <View className={`flex-1 ${bgTela}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Cabeçalho Curvo Moderno */}
        <View className="bg-slate-900 pt-12 pb-16 px-6 rounded-b-3xl shadow-md">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                ERP Grupo Hmaz
              </Text>
              <Text className="text-white text-2xl font-bold mt-0.5">
                Painel de Controle
              </Text>
              <Text className="text-slate-400 text-xs mt-0.5">
                Visão geral do chão de fábrica em tempo real
              </Text>
            </View>

            <View className="flex-row items-center gap-2.5">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={toggleTheme}
                className={`p-2.5 rounded-xl border ${
                  isDark
                    ? 'bg-amber-500/20 border-amber-500/40'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                {isDark ? (
                  <Sun size={20} color="#fbbf24" />
                ) : (
                  <Moon size={20} color="#94a3b8" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleLogout}
                className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30"
              >
                <LogOut size={20} color="#fb7185" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center mt-4">
            <View className="bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-full flex-row items-center">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  isDark ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              <Text className="text-slate-300 text-[11px] font-semibold">
                Tema Global: {isDark ? 'Modo Escuro (Chão de Fábrica)' : 'Modo Claro (Alto Contraste)'}
              </Text>
            </View>
          </View>
        </View>

        {/* Cartões Flutuantes de KPIs */}
        <View className="px-4 -mt-10">
          <View className="flex-row gap-3">
            <View className={`flex-1 rounded-2xl p-4 shadow-sm border ${bgCard}`}>
              <View className="w-9 h-9 rounded-xl bg-blue-500/15 items-center justify-center mb-2.5">
                <Package size={18} color="#3b82f6" />
              </View>
              <Text className={`text-2xl font-extrabold ${textoTitulo}`}>
                {kpis.totalPedidos}
              </Text>
              <Text className={`text-xs font-semibold mt-0.5 ${textoSub}`}>
                Pedidos Totais
              </Text>
            </View>

            <View className={`flex-1 rounded-2xl p-4 shadow-sm border ${bgCard}`}>
              <View className="w-9 h-9 rounded-xl bg-amber-500/15 items-center justify-center mb-2.5">
                <Factory size={18} color="#f59e0b" />
              </View>
              <Text className={`text-2xl font-extrabold ${textoTitulo}`}>
                {kpis.emProducao}
              </Text>
              <Text className={`text-xs font-semibold mt-0.5 ${textoSub}`}>
                Em Produção
              </Text>
            </View>

            <View className={`flex-1 rounded-2xl p-4 shadow-sm border ${bgCard}`}>
              <View className="w-9 h-9 rounded-xl bg-emerald-500/15 items-center justify-center mb-2.5">
                <Users size={18} color="#10b981" />
              </View>
              <Text className={`text-2xl font-extrabold ${textoTitulo}`}>
                {kpis.clientesAtivos}
              </Text>
              <Text className={`text-xs font-semibold mt-0.5 ${textoSub}`}>
                Clientes Ativos
              </Text>
            </View>
          </View>
        </View>

        {/* Gráfico em Barra de Progresso do Fluxo Produtivo */}
        <View className="px-4 mt-4">
          <View className={`rounded-2xl p-5 shadow-sm border ${bgCard}`}>
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-blue-500/15 items-center justify-center mr-2.5">
                  <TrendingUp size={16} color="#3b82f6" />
                </View>
                <View>
                  <Text className={`text-base font-bold ${textoTitulo}`}>
                    Distribuição da Fábrica
                  </Text>
                  <Text className={`text-xs ${textoSub}`}>
                    Ocupação por etapa do Kanban
                  </Text>
                </View>
              </View>
              <View className="bg-emerald-500/15 px-2.5 py-1 rounded-lg">
                <Text className="text-emerald-500 text-xs font-bold">
                  {kpis.taxaConclusao} no prazo
                </Text>
              </View>
            </View>

            <View className={`h-4 w-full rounded-full overflow-hidden flex-row mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              {etapasFabrica.map((etapa) => (
                <View
                  key={etapa.label}
                  style={{ width: `${etapa.pct}%` }}
                  className={`h-full ${etapa.cor} border-r border-white/20`}
                />
              ))}
            </View>

            <View className="flex-row flex-wrap justify-between gap-y-3 pt-2">
              {etapasFabrica.map((etapa) => (
                <View
                  key={etapa.label}
                  className={`w-[48%] p-3 rounded-xl border ${bgSubCard} flex-row items-center justify-between`}
                >
                  <View className="flex-row items-center">
                    <View className={`w-3 h-3 rounded-full ${etapa.cor} mr-2`} />
                    <Text className={`text-xs font-semibold ${textoTitulo}`}>
                      {etapa.label}
                    </Text>
                  </View>
                  <Text className={`text-xs font-bold ${textoSub}`}>
                    {etapa.qtd} ({etapa.pct}%)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Ordens de Alta Prioridade */}
        <View className="px-4 mt-4">
          <View className={`rounded-2xl p-5 shadow-sm border ${bgCard}`}>
            <View className="flex-row justify-between items-center mb-3.5">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-red-500/15 items-center justify-center mr-2.5">
                  <AlertCircle size={16} color="#ef4444" />
                </View>
                <View>
                  <Text className={`text-base font-bold ${textoTitulo}`}>
                    Ordens de Alta Prioridade
                  </Text>
                  <Text className={`text-xs ${textoSub}`}>
                    Acompanhamento prioritário no turno
                  </Text>
                </View>
              </View>
            </View>

            {ordensUrgentes.map((ordem, index) => (
              <View
                key={ordem.id}
                className={`p-3.5 rounded-xl border ${bgSubCard} ${
                  index > 0 ? 'mt-2.5' : ''
                }`}
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-xs font-bold text-blue-500">
                    {ordem.codigo} • {ordem.etapa}
                  </Text>
                  <View className="bg-red-500/15 px-2 py-0.5 rounded-md">
                    <Text className="text-[10px] font-bold text-red-500">
                      Prioridade Alta
                    </Text>
                  </View>
                </View>

                <Text className={`text-sm font-bold ${textoTitulo}`}>
                  {ordem.maquina}
                </Text>

                <View className="flex-row justify-between items-center mt-1.5">
                  <Text className={`text-xs ${textoSub}`}>
                    Cliente: {ordem.cliente}
                  </Text>
                  <View className="flex-row items-center">
                    <Clock size={12} color="#94a3b8" />
                    <Text className={`text-xs font-semibold ml-1 ${textoSub}`}>
                      {ordem.prazo}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Status Operacional */}
        <View className="px-4 mt-4">
          <View className={`rounded-2xl p-4 shadow-sm border flex-row items-center justify-between ${bgCard}`}>
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-emerald-500/15 items-center justify-center mr-3">
                <Wrench size={18} color="#10b981" />
              </View>
              <View>
                <Text className={`text-sm font-bold ${textoTitulo}`}>
                  Linha de Montagem Operacional
                </Text>
                <Text className={`text-xs ${textoSub}`}>
                  Sincronizado com o módulo Web Hmaz
                </Text>
              </View>
            </View>
            <CheckCircle2 size={20} color="#10b981" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}