import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { User, Phone, MapPin, Plus, ChevronDown, ChevronUp, Edit2 } from 'lucide-react-native';

// 1. Dados Fictícios de Clientes (Mock)
const clientesIniciais = [
  { id: '1', nome: 'Carlos Souza', empresa: 'Fazenda Boa Esperança', telefone: '(83) 99999-1111', cidade: 'Campina Grande, PB', status: 'Ativo' },
  { id: '2', nome: 'Ana Lima', empresa: 'AgroSul Ltda', telefone: '(83) 98888-2222', cidade: 'João Pessoa, PB', status: 'Ativo' },
  { id: '3', nome: 'Roberto Alves', empresa: 'Sítio do Sol', telefone: '(81) 97777-3333', cidade: 'Caruaru, PE', status: 'Inativo' },
  { id: '4', nome: 'Mário Fernandes', empresa: 'Cooperativa Alfa', telefone: '(84) 91111-0000', cidade: 'Natal, RN', status: 'Ativo' },
];

// 2. Componente do Cartão de Cliente (com o efeito de expandir)
const CartaoCliente = ({ cliente }: { cliente: any }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <TouchableOpacity 
      onPress={() => setExpandido(!expandido)}
      activeOpacity={0.7}
      className="bg-white dark:bg-zinc-800 p-4 rounded-xl mb-4 shadow-sm border border-zinc-200 dark:border-zinc-700"
    >
      {/* Cabeçalho do Cartão (Sempre Visível) */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          {/* Avatar / Ícone */}
          <View className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-3">
            <User size={24} color="#2563eb" />
          </View>
          
          {/* Nomes */}
          <View className="flex-1">
            <Text className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">
              {cliente.empresa}
            </Text>
            <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              Representante: {cliente.nome}
            </Text>
          </View>
        </View>
        
        {/* Ícone de Expansão */}
        {expandido ? <ChevronUp size={20} color="#71717a" /> : <ChevronDown size={20} color="#71717a" />}
      </View>

      {/* --- ÁREA EXPANDIDA --- */}
      {expandido && (
        <View className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700">
          
          <View className="flex-row items-center mb-3">
            <Phone size={16} color="#71717a" />
            <Text className="text-zinc-600 dark:text-zinc-300 text-sm ml-2">{cliente.telefone}</Text>
          </View>
          
          <View className="flex-row items-center mb-4">
            <MapPin size={16} color="#71717a" />
            <Text className="text-zinc-600 dark:text-zinc-300 text-sm ml-2">{cliente.cidade}</Text>
          </View>

          {/* Botões de Ação do Cliente */}
          <View className="flex-row gap-2">
            <TouchableOpacity className="flex-1 bg-zinc-100 dark:bg-zinc-700 py-3 rounded-lg items-center flex-row justify-center">
              <Edit2 size={16} color="#71717a" />
              <Text className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm ml-2">Editar Cadastro</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 py-3 rounded-lg items-center justify-center">
              <Text className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Ver Pedidos</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

// 3. Ecrã Principal de Clientes
export default function Clientes() {
  return (
    <View className="flex-1 bg-zinc-50 dark:bg-[#0a0a0a] pt-12">
      
      {/* Título da Página */}
      <View className="px-6 mb-6">
        <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Clientes
        </Text>
        <Text className="text-zinc-500 mt-1">
          Diretório de parceiros e compradores
        </Text>
      </View>

      {/* Lista de Clientes (Vertical) */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="px-6"
        contentContainerStyle={{ paddingBottom: 100 }} // Espaço extra em baixo para o botão flutuante não tapar o último cliente
      >
        {clientesIniciais.map(cliente => (
          <CartaoCliente key={cliente.id} cliente={cliente} />
        ))}
      </ScrollView>

      {/* Botão Flutuante para Novo Cadastro */}
      <TouchableOpacity 
        onPress={() => Alert.alert('Novo Cadastro', 'Aqui será aberto o formulário para registar um novo cliente no Supabase.')}
        className="absolute bottom-6 right-6 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg border border-blue-500"
        style={{ elevation: 5 }}
      >
        <Plus size={32} color="#ffffff" />
      </TouchableOpacity>
      
    </View>
  );
}