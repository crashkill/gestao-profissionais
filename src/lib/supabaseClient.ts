import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const environment = import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || 'development';

// Debug: Log das variáveis (apenas em desenvolvimento)
if (import.meta.env.DEV || environment === 'desenvolvimento') {
  console.log('🔍 Supabase Debug:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
    key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
    environment: environment,
    mode: import.meta.env.MODE,
    title: import.meta.env.VITE_APP_TITLE || 'Talent Sphere'
  });
  
  // Identifica qual ambiente está sendo usado
  if (supabaseUrl?.includes('zbiivgtdamejiwcabmcv')) {
    console.log('🧪 Usando banco de HOMOLOGAÇÃO');
  } else if (supabaseUrl?.includes('pwksgdjjkryqryqrvyja')) {
    console.log('🚀 Usando banco de PRODUÇÃO');
  }
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

// Cliente principal do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
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