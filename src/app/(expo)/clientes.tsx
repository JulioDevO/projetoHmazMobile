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
} from 'react-native';
import {
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Building2,
  Search,
  Edit3,
  Trash2,
  PackageCheck,
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

interface Cliente {
  id: string;
  codigo: string;
  nome: string;
  responsavel: string;
  telefone: string;
  localizacao: string;
  pedidosAtivos: number;
  segmento: string;
}

const CLIENTES_INICIAIS: Cliente[] = [
  {
    id: '1',
    codigo: '#CLI-01',
    nome: 'Agropecuária São José',
    responsavel: 'Carlos Eduardo',
    telefone: '(83) 99912-3456',
    localizacao: 'Campina Grande - PB',
    pedidosAtivos: 2,
    segmento: 'Nutrição Animal',
  },
  {
    id: '2',
    codigo: '#CLI-02',
    nome: 'Cooperativa Seridó',
    responsavel: 'Fernanda Lima',
    telefone: '(83) 99845-6789',
    localizacao: 'Junco do Seridó - PB',
    pedidosAtivos: 1,
    segmento: 'Beneficiamento de Grãos',
  },
  {
    id: '3',
    codigo: '#CLI-03',
    nome: 'Fazenda Boa Vista',
    responsavel: 'Roberto Alves',
    telefone: '(83) 99654-3210',
    localizacao: 'Patos - PB',
    pedidosAtivos: 1,
    segmento: 'Pecuária de Corte',
  },
  {
    id: '4',
    codigo: '#CLI-04',
    nome: 'Granja Santa Clara',
    responsavel: 'Mariana Costa',
    telefone: '(83) 99123-9876',
    localizacao: 'Queimadas - PB',
    pedidosAtivos: 1,
    segmento: 'Avicultura',
  },
  {
    id: '5',
    codigo: '#CLI-05',
    nome: 'Agro Industrial Norte',
    responsavel: 'João Pedro',
    telefone: '(84) 99876-5432',
    localizacao: 'Caicó - RN',
    pedidosAtivos: 0,
    segmento: 'Agroindústria',
  },
];

export default function ClientesScreen() {
  const { isDark, toggleTheme } = useGlobalTheme();
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INICIAIS);
  const [cardExpandidoId, setCardExpandidoId] = useState<string | null>('1');
  const [busca, setBusca] = useState('');

  // Estados do Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteEditandoId, setClienteEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [telefone, setTelefone] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [segmento, setSegmento] = useState('');

  const toggleExpandir = (id: string) => {
    setCardExpandidoId((prev) => (prev === id ? null : id));
  };

  const abrirModalNovo = () => {
    setClienteEditandoId(null);
    setNome('');
    setResponsavel('');
    setTelefone('');
    setLocalizacao('');
    setSegmento('');
    setModalVisible(true);
  };

  const abrirModalEditar = (cliente: Cliente) => {
    setClienteEditandoId(cliente.id);
    setNome(cliente.nome);
    setResponsavel(cliente.responsavel);
    setTelefone(cliente.telefone);
    setLocalizacao(cliente.localizacao);
    setSegmento(cliente.segmento);
    setModalVisible(true);
  };

  const handleSalvarCliente = () => {
    if (!nome.trim()) return;

    if (clienteEditandoId) {
      setClientes((prev) =>
        prev.map((item) =>
          item.id === clienteEditandoId
            ? {
                ...item,
                nome: nome.trim(),
                responsavel: responsavel.trim() || 'Não informado',
                telefone: telefone.trim() || '(83) 99999-0000',
                localizacao: localizacao.trim() || 'Campina Grande - PB',
                segmento: segmento.trim() || 'Agroindústria',
              }
            : item
        )
      );
    } else {
      const novoCliente: Cliente = {
        id: String(Date.now()),
        codigo: `#CLI-0${clientes.length + 1}`,
        nome: nome.trim(),
        responsavel: responsavel.trim() || 'Não informado',
        telefone: telefone.trim() || '(83) 99999-0000',
        localizacao: localizacao.trim() || 'Campina Grande - PB',
        pedidosAtivos: 0,
        segmento: segmento.trim() || 'Agroindústria',
      };

      setClientes((prev) => [novoCliente, ...prev]);
      setCardExpandidoId(novoCliente.id);
    }

    setModalVisible(false);
  };

  const handleRemoverCliente = (id: string) => {
    setClientes((prev) => prev.filter((item) => item.id !== id));
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.localizacao.toLowerCase().includes(busca.toLowerCase()) ||
      c.responsavel.toLowerCase().includes(busca.toLowerCase())
  );

  // Classes dinâmicas do Tema Global
  const bgTela = isDark ? 'bg-slate-950' : 'bg-slate-100';
  const bgCard = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
  const bgSubCard = isDark ? 'bg-slate-800/80' : 'bg-slate-50';
  const textoTitulo = isDark ? 'text-white' : 'text-slate-800';
  const textoSub = isDark ? 'text-slate-400' : 'text-slate-500';
  const bgModal = isDark ? 'bg-slate-900' : 'bg-white';
  const bgInput = isDark
    ? 'bg-slate-800 border-slate-700 text-white'
    : 'bg-slate-50 border-slate-200 text-slate-800';

  return (
    <View className={`flex-1 ${bgTela}`}>
      {/* Cabeçalho da Tela */}
      <View className="bg-slate-900 pt-12 pb-6 px-6 rounded-b-3xl shadow-md">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Diretório Comercial • Hmaz
            </Text>
            <Text className="text-white text-2xl font-bold mt-0.5">
              Carteira de Clientes
            </Text>
          </View>

          <View className="flex-row items-center gap-2.5">
            <View className="bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-full">
              <Text className="text-emerald-400 text-xs font-bold">
                {clientes.length} Parceiros
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

        {/* Barra de Pesquisa */}
        <View className="flex-row items-center bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5">
          <Search size={18} color="#94a3b8" />
          <TextInput
            placeholder="Pesquisar por empresa, responsável ou cidade..."
            placeholderTextColor="#64748b"
            value={busca}
            onChangeText={setBusca}
            className="flex-1 text-white text-sm ml-2.5"
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista Vertical de Clientes */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
      >
        {clientesFiltrados.length === 0 ? (
          <View
            className={`rounded-2xl p-8 items-center justify-center border border-dashed mt-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
            }`}
          >
            <Text className="text-slate-400 text-sm font-medium">
              Nenhum cliente encontrado para "{busca}"
            </Text>
          </View>
        ) : (
          clientesFiltrados.map((cliente) => {
            const expandido = cardExpandidoId === cliente.id;

            return (
              <TouchableOpacity
                key={cliente.id}
                activeOpacity={0.85}
                onPress={() => toggleExpandir(cliente.id)}
                className={`rounded-2xl p-4 mb-3.5 shadow-sm border ${bgCard}`}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-row items-center flex-1 pr-2">
                    <View className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/20 items-center justify-center mr-3">
                      <Building2 size={20} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-xs font-bold text-slate-400">
                          {cliente.codigo}
                        </Text>
                        <View className={`px-2 py-0.5 rounded-md ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          <Text className={`text-[11px] font-semibold ${textoSub}`}>
                            {cliente.segmento}
                          </Text>
                        </View>
                      </View>
                      <Text className={`text-base font-bold mt-0.5 ${textoTitulo}`}>
                        {cliente.nome}
                      </Text>
                      <Text className={`text-xs font-medium ${textoSub}`}>
                        Resp: {cliente.responsavel}
                      </Text>
                    </View>
                  </View>

                  <View className={`p-1.5 rounded-lg mt-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    {expandido ? (
                      <ChevronUp size={16} color={isDark ? '#cbd5e1' : '#475569'} />
                    ) : (
                      <ChevronDown size={16} color={isDark ? '#cbd5e1' : '#475569'} />
                    )}
                  </View>
                </View>

                {expandido && (
                  <View className={`mt-3.5 pt-3.5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <View className={`rounded-xl p-3 mb-3 ${bgSubCard}`}>
                      <View className="flex-row items-center mb-2">
                        <Phone size={14} color="#3b82f6" />
                        <Text className={`text-xs ml-2 font-semibold ${textoSub}`}>
                          Telefone / WhatsApp: {cliente.telefone}
                        </Text>
                      </View>

                      <View className="flex-row items-center mb-2">
                        <MapPin size={14} color="#10b981" />
                        <Text className={`text-xs ml-2 font-semibold ${textoSub}`}>
                          Localização: {cliente.localizacao}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <PackageCheck size={14} color="#f59e0b" />
                        <Text className={`text-xs ml-2 font-semibold ${textoSub}`}>
                          Pedidos no Kanban: {cliente.pedidosAtivos} em andamento
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => abrirModalEditar(cliente)}
                        className="flex-1 bg-blue-600 py-2.5 px-3 rounded-xl flex-row items-center justify-center"
                      >
                        <Edit3 size={14} color="#FFFFFF" />
                        <Text className="text-white text-xs font-bold ml-1.5">
                          Editar Dados
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleRemoverCliente(cliente.id)}
                        className="bg-rose-500/15 border border-rose-500/30 py-2.5 px-3.5 rounded-xl items-center justify-center"
                      >
                        <Trash2 size={15} color="#f43f5e" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Botão Flutuante (FAB) */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={abrirModalNovo}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg elevation-5"
      >
        <Plus color="#FFFFFF" size={28} />
      </TouchableOpacity>

      {/* Modal de Cadastro e Edição de Cliente */}
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
                  <Building2 size={20} color="#3b82f6" />
                </View>
                <Text className={`text-xl font-bold ${textoTitulo}`}>
                  {clienteEditandoId ? 'Editar Cliente' : 'Novo Cliente'}
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
              Nome da Empresa / Fazenda *
            </Text>
            <TextInput
              placeholder="Ex: Cooperativa Agrícola Seridó"
              placeholderTextColor="#64748b"
              value={nome}
              onChangeText={setNome}
              className={`border rounded-xl px-4 py-3 mb-3.5 ${bgInput}`}
            />

            <Text className={`text-sm font-semibold mb-1 ${textoSub}`}>
              Nome do Responsável
            </Text>
            <TextInput
              placeholder="Ex: Carlos Eduardo"
              placeholderTextColor="#64748b"
              value={responsavel}
              onChangeText={setResponsavel}
              className={`border rounded-xl px-4 py-3 mb-3.5 ${bgInput}`}
            />

            <Text className={`text-sm font-semibold mb-1 ${textoSub}`}>
              Telefone / WhatsApp
            </Text>
            <TextInput
              placeholder="Ex: (83) 99888-7766"
              placeholderTextColor="#64748b"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
              className={`border rounded-xl px-4 py-3 mb-3.5 ${bgInput}`}
            />

            <Text className={`text-sm font-semibold mb-1 ${textoSub}`}>
              Cidade / Estado
            </Text>
            <TextInput
              placeholder="Ex: Campina Grande - PB"
              placeholderTextColor="#64748b"
              value={localizacao}
              onChangeText={setLocalizacao}
              className={`border rounded-xl px-4 py-3 mb-3.5 ${bgInput}`}
            />

            <Text className={`text-sm font-semibold mb-1 ${textoSub}`}>
              Segmento de Atuação
            </Text>
            <TextInput
              placeholder="Ex: Nutrição Animal, Beneficiamento..."
              placeholderTextColor="#64748b"
              value={segmento}
              onChangeText={setSegmento}
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
                onPress={handleSalvarCliente}
                className="flex-1 py-3.5 rounded-xl bg-blue-600 items-center"
              >
                <Text className="font-bold text-white">
                  {clienteEditandoId ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}