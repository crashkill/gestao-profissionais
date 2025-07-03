import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from '../components/Dashboard';
import ManualForm from '../components/ManualForm';
import ExcelImport from '../components/ExcelImport';
import WebGLBackground from '../components/WebGLBackground';
import { Professional } from '../types/Professional';
import { supabase, executeSupabaseQuery } from '../lib/supabaseClient'; // Importar instância Supabase
import { AIChat } from '../components/AIChat';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'manual' | 'excel'>('dashboard');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado para o carregamento
  const [error, setError] = useState<string | null>(null); // Estado para erros

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      setError(null);
      
      // Debug: Log do ambiente
      console.log('🔍 Debug - Iniciando busca de profissionais...');
      console.log('🔍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🔍 Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
      
      try {
        const result = await executeSupabaseQuery(async (client) => {
          const { data, error: supabaseError } = await client
            .from('colaboradores')
            .select('*');

          console.log('🔍 Resposta do Supabase:', { data: data?.length, error: supabaseError });

          if (supabaseError) {
            console.error('❌ Erro do Supabase:', supabaseError);
            throw supabaseError;
          }

          return data;
        });

        if (result) {
          console.log('✅ Dados carregados:', result.length, 'profissionais');
          setProfessionals(result as Professional[]);
        }
      } catch (err: any) {
        console.error("❌ Erro ao buscar profissionais do Supabase:", err);
        console.error("❌ Detalhes do erro:", {
          message: err.message,
          name: err.name,
          code: err.code,
          details: err.details,
          hint: err.hint
        });
        
        // FALLBACK: Usar dados mock em caso de erro
        console.log('🔄 Usando dados mock como fallback...');
        const mockData: Professional[] = [
          {
            id: '1',
            nome_completo: 'João Silva',
            email: 'joao.silva@globalhitss.com.br',
            area_atuacao: 'Desenvolvedor Frontend',
            skill_principal: 'React',
            nivel_experiencia: 'Sênior',
            disponivel_compartilhamento: true,
            percentual_compartilhamento: "75",
            outras_tecnologias: 'TypeScript,JavaScript,CSS',
            created_at: new Date().toISOString(),
            hora_ultima_modificacao: null,
            regime: 'CLT',
            local_alocacao: 'Remoto',
            proficiencia_cargo: 'Desenvolvedor Frontend Sênior',
            java: null,
            javascript: 'Sênior',
            python: null,
            typescript: 'Sênior',
            php: null,
            dotnet: null,
            react: 'Sênior',
            angular: null,
            ionic: null,
            flutter: null,
            mysql: null,
            postgres: 'Pleno',
            oracle_db: null,
            sql_server: null,
            mongodb: null,
            aws: 'Pleno',
            azure: null,
            gcp: null,
            android: null,
            cobol: null,
            linguagem_r: null,
            linguagem_c: null,
            linguagem_cpp: null,
            windows: null,
            raspberry_pi: null,
            arduino: null,
            gerencia_projetos: null,
            administracao_projetos: null,
            analise_requisitos: null,
            gestor_area: 'Marcelo Costa',
            gestor_direto: 'Ana Paula'
          },
          {
            id: '2',
            nome_completo: 'Maria Santos',
            email: 'maria.santos@globalhitss.com.br',
            area_atuacao: 'Desenvolvedor Backend',
            skill_principal: 'Node.js',
            nivel_experiencia: 'Pleno',
            disponivel_compartilhamento: true,
            percentual_compartilhamento: "50",
            outras_tecnologias: 'JavaScript,PostgreSQL,Docker',
            created_at: new Date().toISOString(),
            hora_ultima_modificacao: null,
            regime: 'PJ',
            local_alocacao: 'Cliente',
            proficiencia_cargo: 'Desenvolvedor Backend Pleno',
            java: null,
            javascript: 'Pleno',
            python: 'Junior',
            typescript: 'Pleno',
            php: null,
            dotnet: null,
            react: null,
            angular: null,
            ionic: null,
            flutter: null,
            mysql: null,
            postgres: 'Sênior',
            oracle_db: null,
            sql_server: null,
            mongodb: 'Pleno',
            aws: 'Pleno',
            azure: null,
            gcp: null,
            android: null,
            cobol: null,
            linguagem_r: null,
            linguagem_c: null,
            linguagem_cpp: null,
            windows: null,
            raspberry_pi: null,
            arduino: null,
            gerencia_projetos: null,
            administracao_projetos: null,
            analise_requisitos: null,
            gestor_area: 'Roberto Almeida',
            gestor_direto: 'Fernanda Lima'
          },
          {
            id: '3',
            nome_completo: 'Carlos Oliveira',
            email: 'carlos.oliveira@globalhitss.com.br',
            area_atuacao: 'DevOps',
            skill_principal: 'AWS',
            nivel_experiencia: 'Sênior',
            disponivel_compartilhamento: false,
            percentual_compartilhamento: null,
            outras_tecnologias: 'Docker,Kubernetes,Terraform',
            created_at: new Date().toISOString(),
            hora_ultima_modificacao: null,
            regime: 'CLT',
            local_alocacao: 'Híbrido',
            proficiencia_cargo: 'Engenheiro DevOps Sênior',
            java: null,
            javascript: null,
            python: 'Pleno',
            typescript: null,
            php: null,
            dotnet: null,
            react: null,
            angular: null,
            ionic: null,
            flutter: null,
            mysql: null,
            postgres: 'Pleno',
            oracle_db: null,
            sql_server: null,
            mongodb: null,
            aws: 'Sênior',
            azure: 'Pleno',
            gcp: 'Junior',
            android: null,
            cobol: null,
            linguagem_r: null,
            linguagem_c: null,
            linguagem_cpp: null,
                        windows: null,
            raspberry_pi: null,
            arduino: null,
            gerencia_projetos: null,
            administracao_projetos: null,
            analise_requisitos: null,
            gestor_area: 'Carlos Moreira',
            gestor_direto: 'Patricia Santos'
          }
        ];

        setProfessionals(mockData);
        console.log('✅ Dados mock carregados:', mockData.length, 'profissionais');
        // Não definir erro quando usar dados mock - apenas avisar no console
        // setError(`Usando dados de demonstração. Erro original: ${err.message || 'Falha ao buscar dados.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []); // Executa apenas uma vez na montagem do componente

  const addProfessional = async (professional: Omit<Professional, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .insert([professional])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setProfessionals(prev => [...prev, ...data as Professional[]]);
      }
    } catch (err: any) {
      console.error("Erro ao adicionar profissional:", err);
      setError(err.message || 'Falha ao salvar profissional.');
    }
  };

  const addMultipleProfessionals = async (newProfessionals: Omit<Professional, 'id' | 'created_at'>[]) => {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .insert(newProfessionals)
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setProfessionals(prev => [...prev, ...data as Professional[]]);
      }
    } catch (err: any) {
      console.error("Erro ao adicionar múltiplos profissionais:", err);
      setError(err.message || 'Falha ao salvar profissionais.');
    }
  };

  // Renderização condicional baseada no estado de carregamento e erro
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <p className="text-white text-2xl">Carregando profissionais...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <p className="text-red-500 text-2xl">Erro ao carregar dados: {error}</p>
      </div>
    );
  }

  return (
    // O restante do JSX do componente permanece o mesmo
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      <WebGLBackground />
      
      {/* Glassmorphism overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 backdrop-blur-[0.5px] z-5"></div>
      
      <div className="relative z-10">
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-6"
        >
          <div className="max-w-7xl mx-auto">
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight"
            >
              Gestão Profissional HITSS
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-300 text-xl font-light tracking-wide"
            >
              Gerencie profissionais de TI com facilidade e elegância
            </motion.p>
            
            {/* Decorative line */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 mt-6"
            ></motion.div>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto px-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {currentView === 'dashboard' && (
              <Dashboard 
                professionals={professionals}
                onNavigate={setCurrentView}
              />
            )}
            
            {currentView === 'manual' && (
              <ManualForm 
                onSubmit={addProfessional}
                onBack={() => setCurrentView('dashboard')}
              />
            )}
            
            {currentView === 'excel' && (
              <ExcelImport 
                onImport={addMultipleProfessionals}
                onBack={() => setCurrentView('dashboard')}
              />
            )}
          </motion.div>
        </main>
      </div>
      {/* Chat lateral de IA */}
      <AIChat professionals={professionals} />
    </div>
  );
};

export default Index;
