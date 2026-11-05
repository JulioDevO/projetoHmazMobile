import { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false); // Mantemos false para não bloquear na Web

  // --- Função Falsa para Desenvolvimento ---
  const devLogin = () => {
    setUser({
      id: '999',
      email: 'admin@grupohmaz.com',
      nome: 'Júlio César',
      role: 'Administrador'
    });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, devLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);