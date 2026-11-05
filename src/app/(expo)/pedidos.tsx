import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Calendar, ChevronDown, ChevronUp, Plus } from 'lucide-react-native';

// 1. Dados Iniciais
const pedidosIniciais = [
  { id: '1', cliente: 'Fazenda Boa Esperança', maquina: 'Moinho de Grãos Industrial', etapa: 'Novos Pedidos', data: '02 Nov', prioridade: 'Alta', descricao: 'Moinho de alta capacidade (5 ton/h) com pintura anticorrosiva extra.' },
  { id: '2', cliente: 'AgroSul Ltda', maquina: 'Triturador X200', etapa: 'Novos Pedidos', data: '02 Nov', prioridade: 'Média', descricao: 'Triturador padrão. Cliente solicitou entrega até final do mês.' },
  { id: '3', cliente: 'Cooperativa Alfa', maquina: 'Silo Secador 500L', etapa: 'Em Produção', data: '28 Out', prioridade: 'Alta', descricao: 'Aguardando chegada das peças do motor.' },
  { id: '4', cliente: 'Sítio do Sol', maquina: 'Moinho de Grãos Padrão', etapa: 'Revisão', data: '25 Out', prioridade: 'Baixa', descricao: 'Revisão final da montagem elétrica antes do envio.' },
];

// Definimos a ordem lógica da fábrica
const ORDEM_FLUXO = ['Novos Pedidos', 'Em Produção', 'Revisão', 'Finalizados'];

// 2. Componente do Cartão (agora recebe a função aoAvancar)
const CartaoPedido = ({ pedido, aoAvancar }: { pedido: any, aoAvancar: (id: string, etapaAtual: string) => void }) => {
  const [expandido, setExpandido] = useState(false);
  
  // Se já estiver no fim, não mostramos o botão de avançar
  const podeAvancar = ORDEM_FLUXO.includes(pedido.etapa) && pedido.etapa !== 'Finalizados';

  return (
    <TouchableOpacity 
      onPress={() => setExpandido(!expandido)}
      activeOpacity={0.7}
      className="bg-white dark:bg-zinc-800 p-4 rounded-lg mb-3 shadow-sm border border-zinc-200 dark:border-zinc-700"
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="font-bold text-zinc-900 dark:text-zinc-100 flex-1 pr-2 text-base">
          {pedido.maquina}
        </Text>
        {expandido ? <ChevronUp size={20} color="#71717a" /> : <ChevronDown size={20} color="#71717a" />}
      </View>
      
      <Text className="text-zinc-500 dark:text-zinc-400 text-sm mb-3 font-medium">
        {pedido.cliente}
      </Text>
      
      <View className="flex-row items-center mt-1">
        <Calendar size={14} color="#71717a" />
        <Text className="text-zinc-500 dark:text-zinc-500 text-xs ml-1">
          {pedido.data}
        </Text>
      </View>

      {expandido && (
        <View className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700">
          <View className="flex-row items-center mb-2">
            <Text className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mr-2">
              Prioridade:
            </Text>
            <View className={`px-2 py-0.5 rounded-md ${
              pedido.prioridade === 'Alta' ? 'bg-red-100 dark:bg-red-900/30' : 
              pedido.prioridade === 'Média' ? 'bg-amber-100 dark:bg-amber-900/30' : 
              'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              <Text className={`text-xs font-bold ${
                pedido.prioridade === 'Alta' ? 'text-red-700 dark:text-red-400' : 
                pedido.prioridade === 'Média' ? 'text-amber-700 dark:text-amber-400' : 
                'text-blue-700 dark:text-blue-400'
              }`}>
                {pedido.prioridade}
              </Text>
            </View>
          </View>

          <Text className="text-zinc-600 dark:text-zinc-300 text-sm mb-4 leading-relaxed">
            {pedido.descricao}
          </Text>

          <View className="flex-row gap-2 mt-2">
            {podeAvancar && (
              <TouchableOpacity 
                onPress={() => aoAvancar(pedido.id, pedido.etapa)}
                className="flex-1 bg-blue-600 py-2.5 rounded-lg items-center"
              >
                <Text className="text-white font-semibold text-sm">Avançar Etapa</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity className="bg-zinc-100 dark:bg-zinc-700 py-2.5 px-4 rounded-lg items-center">
              <Text className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

// 3. Componente da Coluna (agora repassa a função aoAvancar)
const ColunaKanban = ({ titulo, cor, pedidos, aoAvancar }: { titulo: string, cor: string, pedidos: any[], aoAvancar: any }) => (
  <View className="w-[85vw] max-w-[320px] bg-zinc-200/50 dark:bg-zinc-900 rounded-xl p-4 mr-4">
    <View className="flex-row justify-between items-center mb-4">
      <View className="flex-row items-center">
        <View className={`w-3 h-3 rounded-full ${cor} mr-2`} />
        <Text className="font-bold text-zinc-700 dark:text-zinc-300 text-lg">{titulo}</Text>
      </View>
      <View className="bg-zinc-300 dark:bg-zinc-800 px-2 py-1 rounded-md">
        <Text className="text-zinc-600 dark:text-zinc-400 font-bold">{pedidos.length}</Text>
      </View>
    </View>
    
    <ScrollView className="flex-1 mt-2" showsVerticalScrollIndicator={false}>
      {pedidos.length > 0 ? (
        pedidos.map(pedido => (
          <CartaoPedido key={pedido.id} pedido={pedido} aoAvancar={aoAvancar} />
        ))
      ) : (
        <View className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg items-center justify-center py-10 mt-2">
          <Text className="text-zinc-400 dark:text-zinc-600 font-medium">Sem pedidos</Text>
        </View>
      )}
    </ScrollView>
  </View>
);

export default function Pedidos() {
  // O NOSSO ESTADO: Agora o React controla a lista e atualiza a tela automaticamente
  const [pedidos, setPedidos] = useState(pedidosIniciais);

  // A função mágica que move o cartão
  const avancarEtapa = (id: string, etapaAtual: string) => {
    const indexAtual = ORDEM_FLUXO.indexOf(etapaAtual);
    
    if (indexAtual >= 0 && indexAtual < ORDEM_FLUXO.length - 1) {
      const proximaEtapa = ORDEM_FLUXO[indexAtual + 1];
      
      // Atualiza a lista mudando apenas a etapa do pedido clicado
      setPedidos(pedidosAtuais => 
        pedidosAtuais.map(p => p.id === id ? { ...p, etapa: proximaEtapa } : p)
      );
    }
  };

  // Filtros dinâmicos baseados no estado atual
  const novos = pedidos.filter(p => p.etapa === 'Novos Pedidos');
  const emProducao = pedidos.filter(p => p.etapa === 'Em Produção');
  const revisao = pedidos.filter(p => p.etapa === 'Revisão');
  const finalizados = pedidos.filter(p => p.etapa === 'Finalizados');
  const descartados = pedidos.filter(p => p.etapa === 'Descartados');

  return (
    <View className="flex-1 bg-zinc-50 dark:bg-[#0a0a0a] pt-12">
      <View className="px-6 mb-6">
        <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Fluxo de Produção
        </Text>
        <Text className="text-zinc-500 mt-1">
          Arraste lateralmente para ver todas as etapas
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="pl-6"
        contentContainerStyle={{ paddingRight: 48 }}
        snapToInterval={336} 
        decelerationRate="fast"
      >
        <ColunaKanban titulo="Novos Pedidos" cor="bg-blue-500" pedidos={novos} aoAvancar={avancarEtapa} />
        <ColunaKanban titulo="Em Produção" cor="bg-amber-500" pedidos={emProducao} aoAvancar={avancarEtapa} />
        <ColunaKanban titulo="Revisão" cor="bg-purple-500" pedidos={revisao} aoAvancar={avancarEtapa} />
        <ColunaKanban titulo="Finalizados" cor="bg-emerald-500" pedidos={finalizados} aoAvancar={avancarEtapa} />
        <ColunaKanban titulo="Descartados" cor="bg-red-500" pedidos={descartados} aoAvancar={avancarEtapa} />
      </ScrollView>

      {/* Botão Flutuante para Adicionar Novo Pedido */}
      <TouchableOpacity 
        onPress={() => Alert.alert('Novo Pedido', 'Aqui vamos abrir o formulário para cadastrar uma nova máquina!')}
        className="absolute bottom-6 right-6 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg border border-blue-500"
        style={{ elevation: 5 }}
      >
        <Plus size={32} color="#ffffff" />
      </TouchableOpacity>
      
    </View>
  );
}