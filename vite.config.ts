import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  // Configura a base URL para GitHub Pages
  // Usa o nome do repositório como base no GitHub Pages
  const isProduction = process.env.NODE_ENV === 'production' || process.env.GITHUB_ACTIONS === 'true';
  const base = isProduction ? '/gestao-profissionais/' : '/';

  // Configurações de build otimizadas para produção
  const buildConfig: any = {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    ...(isProduction ? {
      minify: 'terser' as const,  // Usando 'as const' para garantir o tipo literal
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
          },
        },
      }
    } : {})
  };

  return {
    base,
    build: buildConfig,
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/supabase-api': {
          target: 'https://pwksgdjjkryqryqrvyja.supabase.co',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/supabase-api/, ''),
          secure: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('🔄 Proxy error, tentando conectar via Supabase:', err.message);
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
  };
});
