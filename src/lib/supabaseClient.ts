import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log das variáveis (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔍 Supabase Debug:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
    key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
    env: import.meta.env.MODE
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  const error = "❌ Supabase URL and Anon Key must be defined in the environment variables.";
  console.error(error);
  console.error('🔍 Current env vars:', {
    VITE_SUPABASE_URL: supabaseUrl || 'UNDEFINED',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'UNDEFINED'
  });
  throw new Error(error);
}

// Validar se a URL é válida
try {
  new URL(supabaseUrl);
} catch {
  const error = `❌ Invalid Supabase URL format: ${supabaseUrl}`;
  console.error(error);
  throw new Error(error);
}

// Função para detectar se devemos usar proxy
const shouldUseProxy = () => {
  return import.meta.env.DEV && window.location.hostname === 'localhost';
};

// URL do Supabase com proxy para desenvolvimento local
const getSupabaseUrl = () => {
  if (shouldUseProxy()) {
    return `${window.location.origin}/supabase-api`;
  }
  return supabaseUrl;
};

// Cliente principal do Supabase
export const supabase = createClient(getSupabaseUrl(), supabaseAnonKey, {
  auth: {
    persistSession: false // Para aplicação sem autenticação de usuário
  }
});

// Cliente alternativo direto (sem proxy) para fallback
export const supabaseDirect = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

// Função helper para tentar ambas as conexões
export const executeSupabaseQuery = async <T>(queryFn: (client: any) => Promise<T>): Promise<T> => {
  try {
    console.log('🔍 Tentando conexão via proxy...');
    const result = await queryFn(supabase);
    console.log('✅ Conexão via proxy bem-sucedida');
    return result;
  } catch (proxyError) {
    console.log('⚠️ Proxy falhou, tentando conexão direta...', proxyError);
    try {
      const result = await queryFn(supabaseDirect);
      console.log('✅ Conexão direta bem-sucedida');
      return result;
    } catch (directError) {
      console.error('❌ Ambas as conexões falharam:', { proxyError, directError });
      throw directError;
    }
  }
}; 