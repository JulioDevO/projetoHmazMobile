import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Substitua estas duas linhas com os seus dados reais:
const supabaseUrl = 'https://ravpfavtrjelafxubgrg.supabase.co';
const supabaseAnonKey = 'sb_publishable_OUb8TF5P29lz5md1lWqfjA_8f_DGm_1';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
// ... resto do código continua igual
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Atualiza o estado da sessão quando a aplicação vai para segundo plano ou volta
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});