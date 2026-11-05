import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Lock, Mail } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { devLogin } = useAuth(); // Puxa a função de login falso

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    
    // Simula 1 segundo de carregamento e faz o login
    setTimeout(() => {
      devLogin();
      setLoading(false);
    }, 1000);
  };

  return (
    <View className="flex-1 justify-center px-6 bg-zinc-50 dark:bg-[#0a0a0a]">
      <View className="mb-10">
        <Text className="text-4xl font-bold text-blue-600 mb-2">Grupo Hmaz</Text>
        <Text className="text-base text-zinc-500 dark:text-zinc-400">
          Faça login para aceder ao ERP mobile
        </Text>
      </View>

      <View className="space-y-4">
        {/* Input Email */}
        <View className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 flex-row items-center mb-4">
          <Mail size={20} color="#71717a" />
          <TextInput 
            className="flex-1 ml-3 text-zinc-900 dark:text-zinc-100"
            placeholder="E-mail"
            placeholderTextColor="#a1a1aa"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input Palavra-passe */}
        <View className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 flex-row items-center mb-8">
          <Lock size={20} color="#71717a" />
          <TextInput 
            className="flex-1 ml-3 text-zinc-900 dark:text-zinc-100"
            placeholder="Palavra-passe"
            placeholderTextColor="#a1a1aa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Botão Entrar */}
        <TouchableOpacity 
          onPress={handleLogin}
          disabled={loading}
          className="bg-blue-600 rounded-lg py-4 items-center justify-center opacity-100"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <Text className="text-white font-semibold text-base">
            {loading ? 'A entrar...' : 'Entrar no Sistema'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}