import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  // Configuração de ambientes
  const environmentConfig = {
    development: {
      base: '/',
      proxyTarget: 'https://zbiivgtdamejiwcabmcv.supabase.co', // Homologação
    },
    homologacao: {
      base: '/gestao-profissional-homologacao/',
      proxyTarget: 'https://zbiivgtdamejiwcabmcv.supabase.co',
    },
    production: {
      base: 'Gestao-Profissional/', // CORREÇÃO: Removida a barra inicial para o base path do GitHub Pages
      proxyTarget: 'https://pwksgdjjkryqryqrvyja.supabase.co', // Produção
    }
  };

  // Detecta o ambiente atual
  const currentEnv = mode === 'production' ? 'production' 
                   : mode === 'homologacao' ? 'homologacao' 
                   : 'development';
  
  const config = environmentConfig[currentEnv];
  const isProduction = mode === 'production' || process.env.GITHUB_ACTIONS === 'true';
  
  console.log(`🔧 Configurando Vite para ambiente: ${currentEnv}`);
  console.log(`📁 Base URL: ${config.base}`);
  console.log(`🔗 Proxy Target: ${config.proxyTarget}`);

  // Configurações de build otimizadas
  const buildConfig: any = {
    outDir: mode === 'homologacao' ? 'dist-homologacao' : 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    ...(isProduction ? {
      minify: 'terser' as const,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          },
        },
      }
    } : {})
  };

  return {
    base: config.base,
    build: buildConfig,
    server: {
      host: "::",
      port: mode === 'homologacao' ? 8080 : 5173,
      proxy: {
        '/rest': {
          target: config.proxyTarget,
          changeOrigin: true,
          secure: true,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log(`🌐 Proxy request (${mode}): ${req.method} ${req.url}`);
            });
          },
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Injeta variáveis de ambiente em tempo de compilação
      __ENVIRONMENT__: JSON.stringify(currentEnv),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  };
});
