import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { View, Text } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Este componente lida com a lógica de redirecionamento
function InitialLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Verifica se estamos na página de login
    const inAuthGroup = segments[0] === 'login';

    if (!user && !inAuthGroup) {
      // Se não há utilizador e não está no login, expulsa para o login
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Se há utilizador e está no login, envia para a página inicial
      router.replace('/');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Text className="text-zinc-500">A carregar sistema...</Text>
      </View>
    );
  }

  // O <Slot /> funciona como o <Outlet /> da web, renderizando a página atual
  return <Slot />;
}

// O Layout principal apenas fornece o Contexto
export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}