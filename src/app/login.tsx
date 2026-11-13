import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Factory,
  Mail,
  Lock,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react-native';
import * as AuthModule from '../context/AuthContext';

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

export default function LoginScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useGlobalTheme();

  const authHook = (AuthModule as any).useAuth;
  const authContextObj = (AuthModule as any).AuthContext || (AuthModule as any).default;
  const auth = authHook ? authHook() : authContextObj ? useContext(authContextObj) : null;

  // Campos iniciam vazios para exigir digitação (mesmo que mockada)
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      setErro('Por favor, informe um e-mail e uma palavra-passe para entrar.');
      return;
    }

    setErro('');

    // Ativa a sessão no AuthContext (caso exista)
    if (auth) {
      if (typeof auth.signIn === 'function') auth.signIn(email, senha);
      else if (typeof auth.login === 'function') auth.login(email, senha);
      else if (typeof auth.devLogin === 'function') auth.devLogin();
      else if (typeof auth.setSigned === 'function') auth.setSigned(true);
    }

    // Redireciona para a pasta correta do projeto: /(expo)
    router.replace('/(expo)');
  };

  const bgTela = isDark ? 'bg-slate-950' : 'bg-slate-100';
  const bgCard = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
  const textoTitulo = isDark ? 'text-white' : 'text-slate-800';
  const textoSub = isDark ? 'text-slate-400' : 'text-slate-500';
  const bgInput = isDark
    ? 'bg-slate-800 border-slate-700 text-white'
    : 'bg-slate-50 border-slate-200 text-slate-800';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={`flex-1 justify-center px-6 ${bgTela}`}
    >
      <View className={`rounded-3xl p-6 shadow-xl border ${bgCard}`}>
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-2xl bg-blue-600 items-center justify-center mr-3">
              <Factory size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-blue-500 text-xs font-bold uppercase tracking-wider">
                Grupo Hmaz
              </Text>
              <Text className={`text-2xl font-extrabold ${textoTitulo}`}>
                ERP Mobile
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={toggleTheme}
            className={`p-2.5 rounded-xl border ${
              isDark
                ? 'bg-amber-500/20 border-amber-500/40'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            {isDark ? (
              <Sun size={20} color="#fbbf24" />
            ) : (
              <Moon size={20} color="#475569" />
            )}
          </TouchableOpacity>
        </View>

        <Text className={`text-sm mb-5 ${textoSub}`}>
          Introduza as suas credenciais para aceder ao painel da fábrica.
        </Text>

        {erro ? (
          <View className="bg-rose-500/15 border border-rose-500/30 rounded-xl p-3 mb-4">
            <Text className="text-rose-500 text-xs font-bold">{erro}</Text>
          </View>
        ) : null}

        <Text className={`text-xs font-bold uppercase mb-1.5 ${textoSub}`}>
          E-mail Corporativo
        </Text>
        <View className={`flex-row items-center border rounded-xl px-3.5 py-3 mb-4 ${bgInput}`}>
          <Mail size={18} color="#64748b" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Ex: admin@hmaz.com.br"
            placeholderTextColor="#64748b"
            autoCapitalize="none"
            keyboardType="email-address"
            className={`flex-1 ml-2.5 text-sm ${textoTitulo}`}
          />
        </View>

        <Text className={`text-xs font-bold uppercase mb-1.5 ${textoSub}`}>
          Palavra-passe
        </Text>
        <View className={`flex-row items-center border rounded-xl px-3.5 py-3 mb-6 ${bgInput}`}>
          <Lock size={18} color="#64748b" />
          <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite a sua senha"
            placeholderTextColor="#64748b"
            secureTextEntry
            className={`flex-1 ml-2.5 text-sm ${textoTitulo}`}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleLogin}
          className="bg-blue-600 py-3.5 rounded-xl flex-row items-center justify-center shadow-md"
        >
          <Text className="text-white font-bold text-base mr-2">
            Entrar no Sistema
          </Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}