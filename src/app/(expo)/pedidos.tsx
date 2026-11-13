import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Trash2,
  Calendar,
  User,
  Package,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react-native';

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

type StatusColuna = 'Novos' | 'Produção' | 'Revisão' | 'Finalizados' | 'Descartados';
type NivelPrioridade = 'Alta' | 'Média' | 'Baixa';

interface Pedido {
  id: string;
  codigo: string;
  maquina: string;
  cliente: string;
  prioridade: NivelPrioridade;
  prazo: string;
  status: StatusColuna;
  observacoes?: string;
}

const COLUNAS: { titulo: StatusColuna; corTopo: string; corBadge: string; corTexto: string }[] = [
  { titulo: 'Novos', corTopo: 'border-t-blue-500', corBadge: 'bg-blue-500/20', corTexto: 'text-blue-500' },
  { titulo: 'Produção', corTopo: 'border-t-amber-500', corBadge: 'bg-amber-500/20', corTexto: 'text-amber-500' },
  { titulo: 'Revisão', corTopo: 'border-t-purple-500', corBadge: 'bg-purple-500/20', corTexto: 'text-purple-500' },
  { titulo: 'Finalizados', corTopo: 'border-t-emerald-500', corBadge: 'bg-emerald-500/20', corTexto: 'text-emerald-500' },
  { titulo: 'Descartados', corTopo: 'border-t-rose-500', corBadge: 'bg-rose-500/20', corTexto: 'text-rose-500' },
];

const PEDIDOS_INICIAIS: Pedido[] = [
  {
    id: '1',
    codigo: '#PED-1042',
    maquina: 'Moinho Triturador H-500',
    cliente: 'Agropecuária São José',
    prioridade: 'Alta',
    prazo: '20/11/2026',
    status: 'Novos',
    observacoes: 'Motor trifásico 15CV com acabamento reforçado.',
  },
  {
    id: '2',
    codigo: '#PED-1045',
    maquina: 'Misturador de Ração MV-1000',
    cliente: 'Fazenda Boa Vista',
    prioridade: 'Média',
    prazo: '25/11/2026',
    status: 'Novos',
    observacoes: 'Capacidade de 1000kg por batelada.',
  },
  {
    id: '3',
    codigo: '#PED-1038',
    maquina: 'Rosca Transportadora RT-300',
    cliente: 'Cooperativa Seridó',
    prioridade: 'Alta',
    prazo: '18/11/2026',
    status: 'Produção',
    observacoes: 'Tubo de 6 metros em aço carbono.',
  },
  {
    id: '4',
    codigo: '#PED-1035',
    maquina: 'Ensacadeira Automática EA-50',
    cliente: 'Granja Santa Clara',
    prioridade: 'Baixa',
    prazo: '22/11/2026',
    status: 'Revisão',
    observacoes: 'Aguardando calibração da balança digital.',
  },
  {
    id: '5',
    codigo: '#PED-1029',
    maquina: 'Triturador Forrageiro TF-200',
    cliente: 'Agro Industrial Norte',
    prioridade: 'Média',
    prazo: '10/11/2026',
    status: 'Finalizados',
    observacoes: 'Pronto para expedição e entrega.',
  },
];

const { width } = Dimensions.get('window');
const LARGURA_COLUNA = Math.min(width * 0.85, 340);

export default function PedidosScreen() {
  const { isDark, toggleTheme } = useGlobalTheme();
  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS_INICIAIS);
  const [cardExpandidoId, setCardExpandidoId] = useState<string | null>('1');

  // Estados do Modal de Novo Pedido
  const [modalVisible, setModalVisible] = useState(false);
  const [novaMaquina, setNovaMaquina] = useState('');
  const [novoCliente, setNovoCliente] = useState('');
  const [novaPrioridade, setNovaPrioridade] = useState<NivelPrioridade>('Média');
  const [novoPrazo, setNovoPrazo] = useState('');
  const [novaObs, setNovaObs] = useState('');

  const toggleExpandir = (id: string) => {
    setCardExpandidoId((prev) => (prev === id ? null : id));
  };

  const avancarEtapa = (id: string, statusAtual: StatusColuna) => {
    const ordemFluxo: StatusColuna[] = ['Novos', 'Produção', 'Revisão', 'Finalizados'];
    const indiceAtual = ordemFluxo.indexOf(statusAtual);

    if (indiceAtual !== -1 && indiceAtual < ordemFluxo.length - 1) {
      const proximoStatus = ordemFluxo[indiceAtual + 1];
      setPedidos((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: proximoStatus } : item))
      );
    }
  };

  const alterarDescarte = (id: string, statusAtual: StatusColuna) => {
    const novoStatus: StatusColuna = statusAtual === 'Descartados' ? 'Novos' : 'Descartados';
    setPedidos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: novoStatus } : item))
    );
  };

  const handleAdicionarPedido = () => {
    if (!novaMaquina.trim() || !novoCliente.trim()) return;

    const novoPedido: Pedido = {
      id: String(Date.now()),
      codigo: `#PED-${Math.floor(1050 + Math.random() * 900)}`,
      maquina: novaMaquina.trim(),
      cliente: novoCliente.trim(),
      prioridade: novaPrioridade,
      prazo: novoPrazo.trim() || 'A definir',
      status: 'Novos',
      observacoes: novaObs.trim() || 'Ordem registada via aplicação mobile.',
    };

    setPedidos((prev) => [novoPedido, ...prev]);
    setCardExpandidoId(novoPedido.id);

    setNovaMaquina('');
    setNovoCliente('');
    setNovaPrioridade('Média');
    setNovoPrazo('');
    setNovaObs('');
    setModalVisible(false);
  };

  const getEstiloPrioridade = (prioridade: NivelPrioridade) => {
    switch (prioridade) {
      case 'Alta':
        return { bg: 'bg-red-500/15', text: 'text-red-500' };
      case 'Média':
        return { bg: 'bg-amber-500/15', text: 'text-amber-500' };
      case 'Baixa':
        return { bg: 'bg-emerald-500/15', text: 'text-emerald-500' };
    }
  };

  // Classes dinâmicas do Tema Global
  const bgTela = isDark ? 'bg-slate-950' : 'bg-slate-100';
  const bgColuna = isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/80 border-slate-200';
  const bgCard = isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-100';
  const textoTitulo = isDark ? 'text-white' : 'text-slate-800';
  const textoSub = isDark ? 'text-slate-400' : 'text-slate-500';
  const bgModal = isDark ? 'bg-slate-900' : 'bg-white';
  const bgInput = isDark
    ? 'bg-slate-800 border-slate-700 text-white'
    : 'bg-slate-50 border-slate-200 text-slate-800';

  return (
    <View className={`flex-1 ${bgTela}`}>
      {/* Cabeçalho da Tela */}
      <View className="bg-slate-900 pt-12 pb-5 px-6 rounded-b-3xl shadow-md">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Chão de Fábrica • Hmaz
            </Text>
            <Text className="text-white text-2xl font-bold mt-0.5">
              Quadro Kanban
            </Text>
          </View>

          <View className="flex-row items-center gap-2.5">
            <View className="bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 rounded-full">
              <Text className="text-blue-400 text-xs font-bold">
                {pedidos.length} Pedidos
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleTheme}
              className={`p-2 rounded-xl border ${
                isDark
                  ? 'bg-amber-500/20 border-amber-500/40'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              {isDark ? (
                <Sun size={18} color="#fbbf24" />
              ) : (
                <Moon size={18} color="#94a3b8" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Rolagem Horizontal das Colunas do Kanban */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={LARGURA_COLUNA + 16}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
      >
        {COLUNAS.map((coluna) => {
          const pedidosDaColuna = pedidos.filter((p) => p.status === coluna.titulo);

          return (
            <View
              key={coluna.titulo}
              style={{ width: LARGURA_COLUNA }}
              className={`rounded-2xl mr-4 p-3.5 border border-t-4 ${bgColuna} ${coluna.corTopo}`}
            >
              {/* Cabeçalho da Coluna */}
              <View className="flex-row justify-between items-center mb-3 px-1">
                <Text className={`text-base font-bold ${textoTitulo}`}>
                  {coluna.titulo}
                </Text>
                <View className={`px-2.5 py-0.5 rounded-full ${coluna.corBadge}`}>
                  <Text className={`text-xs font-bold ${coluna.corTexto}`}>
                    {pedidosDaColuna.length}
                  </Text>
                </View>
              </View>

              {/* Lista de Cartões da Coluna */}
              <ScrollView showsVerticalScrollIndicator={false}>
                {pedidosDaColuna.length === 0 ? (
                  <View
                    className={`rounded-xl p-6 items-center justify-center border border-dashed mt-2 ${
                      isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white/60 border-slate-300'
                    }`}
                  >
                    <Text className="text-slate-400 text-sm font-medium">
                      Nenhum pedido nesta etapa
                    </Text>
                  </View>
                ) : (
                  pedidosDaColuna.map((pedido) => {
                    const expandido = cardExpandidoId === pedido.id;
                    const estiloPrio = getEstiloPrioridade(pedido.prioridade);

                    return (
                      <TouchableOpacity
                        key={pedido.id}
                        activeOpacity={0.85}
                        onPress={() => toggleExpandir(pedido.id)}
                        className={`rounded-xl p-4 mb-3 shadow-sm border ${bgCard}`}
                      >
                        <View className="flex-row justify-between items-center mb-2">
                          <Text className="text-xs font-bold text-slate-400">
                            {pedido.codigo}
                          </Text>
                          <View className={`px-2 py-0.5 rounded-md ${estiloPrio.bg}`}>
                            <Text className={`text-xs font-bold ${estiloPrio.text}`}>
                              {pedido.prioridade}
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row justify-between items-start">
                          <View className="flex-1 pr-2">
                            <Text className={`text-base font-bold ${textoTitulo}`}>
                              {pedido.maquina}
                            </Text>
                            <View className="flex-row items-center mt-1">
                              <User size={13} color="#64748b" />
                              <Text className={`text-xs ml-1.5 font-medium ${textoSub}`}>
                                {pedido.cliente}
                              </Text>
                            </View>
                          </View>
                          <View className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            {expandido ? (
                              <ChevronUp size={16} color={isDark ? '#cbd5e1' : '#475569'} />
                            ) : (
                              <ChevronDown size={16} color={isDark ? '#cbd5e1' : '#475569'} />
                            )}
                          </View>
                        </View>

                        {expandido && (
                          <View className={`mt-3 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                            <View className="flex-row items-center mb-2">
                              <Calendar size={14} color={isDark ? '#94a3b8' : '#475569'} />
                              <Text className={`text-xs ml-1.5 font-semibold ${textoSub}`}>
                                Prazo de Entrega: {pedido.prazo}
                              </Text>
                            </View>

                            {pedido.observacoes ? (
                              <View className={`p-2.5 rounded-lg mb-3 ${isDark ? 'bg-slate-900/70' : 'bg-slate-50'}`}>
                                <Text className={`text-xs leading-relaxed ${textoSub}`}>
                                  {pedido.observacoes}
                                </Text>
                              </View>
                            ) : null}

                            <View className="flex-row gap-2 mt-1">
                              {pedido.status !== 'Finalizados' &&
                                pedido.status !== 'Descartados' && (
                                  <TouchableOpacity
                                    onPress={() => avancarEtapa(pedido.id, pedido.status)}
                                    className="flex-1 bg-blue-600 py-2.5 px-3 rounded-lg flex-row items-center justify-center"
                                  >
                                    <Text className="text-white text-xs font-bold mr-1.5">
                                      Avançar Etapa
                                    </Text>
                                    <ArrowRight size={14} color="#FFF" />
                                  </TouchableOpacity>
                                )}

                              <TouchableOpacity
                                onPress={() => alterarDescarte(pedido.id, pedido.status)}
                                className={`py-2.5 px-3 rounded-lg flex-row items-center justify-center ${
                                  pedido.status === 'Descartados'
                                    ? 'bg-emerald-500/20 border border-emerald-500/30 flex-1'
                                    : 'bg-rose-500/15 border border-rose-500/30'
                                }`}
                              >
                                {pedido.status === 'Descartados' ? (
                                  <>
                                    <RotateCcw size={14} color="#10b981" />
                                    <Text className="text-emerald-500 text-xs font-bold ml-1.5">
                                      Restaurar para Novos
                                    </Text>
                                  </>
                                ) : (
                                  <Trash2 size={15} color="#f43f5e" />
                                )}
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      {/* Botão Flutuante (FAB) */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg elevation-5"
      >
        <Plus color="#FFFFFF" size={28} />
      </TouchableOpacity>

      {/* Modal de Cadastro de Novo Pedido */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/60"
        >
          <View className={`rounded-t-3xl p-6 shadow-2xl ${bgModal}`}>
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center">
                <View className="bg-blue-500/15 p-2 rounded-xl mr-3">
                  <Package size={20} color="#3b82f6" />
                </View>
                <Text className={`text-xl font-bold ${textoTitulo}`}>
                  Novo Pedido de Produção
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className={`p-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
              >
                <X size={20} color={isDark ? '#cbd5e1' : '#475569'} />
              </TouchableOpacity>
            </View>

            <Text className={`text-sm font-semibold mb-1 ${textoSub}`}>
              Modelo da Máquina *
            </Text>
            <TextInput
              placeholder="Ex: Moinho Triturador H-500"
              placeholderTextColor="#64748b"
              value={novaMaquina}
              onChangeText={setNovaMaquina}
              className={`border rounded-xl px-4 py-3 mb-3.5 ${bgInput}`}
            />

            <Text className={`text-sm font-semibold mb-1 ${textoSub}`}>
              Cliente Vinculado *
            </Text>
            <TextInput
              placeholder="Ex: Agropecuária São José"
              placeholderTextColor="#64748b"
              value={novoCliente}
              onChangeText={setNovoCliente}
              className={`border rounded-xl px-4 py-3 mb-3.5 ${bgInput}`}
            />

            <Text className={`text-sm font-semibold mb-2 ${textoSub}`}>
              Nível de Prioridade
            </Text>
            <View className="flex-row gap-2 mb-3.5">
              {(['Baixa', 'Média', 'Alta'] as const).map((nivel) => {
                const selecionado = novaPrioridade === nivel;
                return (
                  <TouchableOpacity
                    key={nivel}
                    onPress={() => setNovaPrioridade(nivel)}
                    className={`flex-1 py-2.5 rounded-xl border items-center ${
                      selecionado
                        ? nivel === 'Alta'
                          ? 'bg-red-500/20 border-red-500'
                          : nivel === 'Média'
                          ? 'bg-amber-500/20 border-amber-500'
                          : 'bg-emerald-500/20 border-emerald-500'
                        : isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text
                      className={`font-semibold text-sm ${
                        selecionado
                          ? nivel === 'Alta'
                            ? 'text-red-500'
                            : nivel === 'Média'
                            ? 'text-amber-500'
                            : 'text-emerald-500'
                          : textoSub
                      }`}
                    >
                      {nivel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className={`text-sm font-semibold mb-1 ${textoSub}`}>
              Prazo de Entrega
            </Text>
            <TextInput
              placeholder="Ex: 30/11/2026"
              placeholderTextColor="#64748b"
              value={novoPrazo}
              onChangeText={setNovoPrazo}
              className={`border rounded-xl px-4 py-3 mb-3.5 ${bgInput}`}
            />

            <Text className={`text-sm font-semibold mb-1 ${textoSub}`}>
              Especificações / Observações
            </Text>
            <TextInput
              placeholder="Ex: Motor trifásico, pintura especial..."
              placeholderTextColor="#64748b"
              value={novaObs}
              onChangeText={setNovaObs}
              className={`border rounded-xl px-4 py-3 mb-6 ${bgInput}`}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className={`flex-1 py-3.5 rounded-xl items-center ${
                  isDark ? 'bg-slate-800' : 'bg-slate-100'
                }`}
              >
                <Text className={`font-semibold ${textoSub}`}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAdicionarPedido}
                className="flex-1 py-3.5 rounded-xl bg-blue-600 items-center"
              >
                <Text className="font-bold text-white">Criar Pedido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}