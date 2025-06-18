import { askDeepSeek } from './togetherai';
import { askGroq } from './groq';

// Sistema inteligente que testa múltiplas IAs e usa a melhor disponível
export async function askSmartAI(question: string, professionals: any[]): Promise<string> {
  console.log('🧠 [SMART AI] Iniciando sistema inteligente de IA...');
  
  const startTime = Date.now();
  
  // Opção 1: Tentar Llama 3.3 70B GRATUITO da Together.xyz (sem API key necessária)
  try {
    console.log('🆓 [SMART AI] Tentando modelo Together.xyz gratuito...');
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em análise de dados de RH da HITSS. Analise os dados fornecidos e responda de forma objetiva e útil. 

DADOS DOS PROFISSIONAIS:
${JSON.stringify(professionals, null, 2)}

Responda sempre em português brasileiro de forma clara e direta.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer) {
        const endTime = Date.now();
        console.log(`✅ [SMART AI] Together.xyz respondeu em ${endTime - startTime}ms`);
        return `${answer}\n\n---\nResposta via Together.xyz Llama 3.3 70B (${endTime - startTime}ms)`;
      }
    }
  } catch (error) {
    console.log('⚠️ [SMART AI] Together.xyz falhou:', error);
  }

  // Opção 2: Tentar Groq (se API key disponível)
  if (import.meta.env.VITE_GROQ_API_KEY) {
    try {
      console.log('⚡ [SMART AI] Tentando Groq...');
      const answer = await askGroq(question, professionals);
      const endTime = Date.now();
      console.log(`✅ [SMART AI] Groq respondeu em ${endTime - startTime}ms`);
      return `${answer}\n\n---\nResposta via Groq (${endTime - startTime}ms)`;
    } catch (error) {
      console.log('⚠️ [SMART AI] Groq falhou:', error);
    }
  }

  // Opção 3: Tentar Together.xyz com API Key (se disponível)
  if (import.meta.env.VITE_TOGETHER_API_KEY) {
    try {
      console.log('🔑 [SMART AI] Tentando Together.xyz com API key...');
      const answer = await askDeepSeek(question, professionals);
      const endTime = Date.now();
      console.log(`✅ [SMART AI] Together.xyz Premium respondeu em ${endTime - startTime}ms`);
      return `${answer}\n\n---\nResposta via Together.xyz Premium (${endTime - startTime}ms)`;
    } catch (error) {
      console.log('⚠️ [SMART AI] Together.xyz Premium falhou:', error);
    }
  }

  // Opção 4: Análise Offline Inteligente com dados reais
  console.log('💡 [SMART AI] Executando análise offline inteligente...');
  return generateSmartOfflineAnalysis(question, professionals);
}

// Análise offline inteligente com dados reais
function generateSmartOfflineAnalysis(question: string, professionals: any[]): string {
  console.log('🔍 [ANÁLISE OFFLINE] Processando dados reais dos profissionais...');
  console.log('🔍 [DEBUG] Estrutura do primeiro profissional:', JSON.stringify(professionals[0], null, 2));
  
  // Debug: verificar valores únicos dos campos importantes
  const regimeValues = [...new Set(professionals.map(p => p.regime).filter(Boolean))];
  const proficienciaValues = [...new Set(professionals.map(p => p.proficiencia_cargo).filter(Boolean))];
  console.log('🔍 [DEBUG] Valores únicos de regime:', regimeValues);
  console.log('🔍 [DEBUG] Valores únicos de proficiencia_cargo:', proficienciaValues);
  
  // Estatísticas reais baseadas nos dados
  const totalProfessionals = professionals.length;
  
  // Análise de contratos (CLT vs PJ) - campo 'regime'
  const cltCount = professionals.filter(p => 
    p.regime?.toLowerCase().includes('clt')
  ).length;
  const pjCount = professionals.filter(p => 
    p.regime?.toLowerCase().includes('pj')
  ).length;
  
  // Análise de senioridade - campo 'proficiencia_cargo'
  const seniorityCount = {
    junior: professionals.filter(p => 
      p.proficiencia_cargo?.toLowerCase().includes('junior') ||
      p.proficiencia_cargo?.toLowerCase().includes('júnior')
    ).length,
    pleno: professionals.filter(p => 
      p.proficiencia_cargo?.toLowerCase().includes('pleno')
    ).length,
    senior: professionals.filter(p => 
      p.proficiencia_cargo?.toLowerCase().includes('senior') ||
      p.proficiencia_cargo?.toLowerCase().includes('sênior')
    ).length
  };
  
  // Análise de tecnologias - campos de string
  const techCount = {
    javascript: professionals.filter(p => 
      p.javascript && 
      p.javascript.toLowerCase() !== 'sem conhecimento' && 
      p.javascript.toLowerCase() !== 'null'
    ).length,
    java: professionals.filter(p => 
      p.java && 
      p.java.toLowerCase() !== 'sem conhecimento' && 
      p.java.toLowerCase() !== 'null'
    ).length,
    python: professionals.filter(p => 
      p.python && 
      p.python.toLowerCase() !== 'sem conhecimento' && 
      p.python.toLowerCase() !== 'null'
    ).length,
    react: professionals.filter(p => 
      p.react && 
      p.react.toLowerCase() !== 'sem conhecimento' && 
      p.react.toLowerCase() !== 'null'
    ).length,
    typescript: professionals.filter(p => 
      p.typescript && 
      p.typescript.toLowerCase() !== 'sem conhecimento' && 
      p.typescript.toLowerCase() !== 'null'
    ).length,
    mysql: professionals.filter(p => 
      p.mysql && 
      p.mysql.toLowerCase() !== 'sem conhecimento' && 
      p.mysql.toLowerCase() !== 'null'
    ).length
  };
  
  console.log('🔍 [DEBUG] Contagens de tecnologia:', techCount);
  console.log('🔍 [DEBUG] Contagens de contrato: CLT:', cltCount, 'PJ:', pjCount);
  console.log('🔍 [DEBUG] Contagens de senioridade:', seniorityCount);
  
  // Encontrar tecnologia mais comum
  const mostCommonTech = Object.entries(techCount)
    .filter(([, count]) => count > 0) // Apenas tecnologias com pelo menos 1 profissional
    .sort(([,a], [,b]) => b - a)[0];
  
  // Encontrar senioridade predominante
  const mostCommonSeniority = Object.entries(seniorityCount)
    .filter(([, count]) => count > 0) // Apenas senioridades com pelo menos 1 profissional
    .sort(([,a], [,b]) => b - a)[0];

  // Análise específica da pergunta
  let specificInsights = '';
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('mysql')) {
    specificInsights += `\nMySQL: ${techCount.mysql} profissionais têm experiência com MySQL`;
  }
  
  if (questionLower.includes('react')) {
    specificInsights += `\nReact: ${techCount.react} profissionais são experientes em React`;
  }
  
  if (questionLower.includes('python')) {
    specificInsights += `\nPython: ${techCount.python} profissionais trabalham com Python`;
  }
  
  if (questionLower.includes('java')) {
    specificInsights += `\nJava: ${techCount.java} profissionais têm conhecimento em Java`;
  }
  
  if (questionLower.includes('javascript')) {
    specificInsights += `\nJavaScript: ${techCount.javascript} profissionais dominam JavaScript`;
  }
  
  // Resposta específica para senioridade
  if (questionLower.includes('senior') || questionLower.includes('sênior')) {
    const seniorProfessionals = professionals.filter(p => 
      p.proficiencia_cargo?.toLowerCase().includes('senior') ||
      p.proficiencia_cargo?.toLowerCase().includes('sênior')
    );
    
    return `🔍 Análise Offline Inteligente

Pergunta: "${question}"

📊 Dados da HITSS (${totalProfessionals} profissionais):

👨‍💼 Profissionais Sêniores: ${seniorProfessionals.length}

📋 Lista de Sêniores:
${seniorProfessionals.length > 0 ? 
  seniorProfessionals.slice(0, 10).map(p => `• ${p.nome_completo || 'Nome não informado'} - ${p.proficiencia_cargo}`).join('\n') + 
  (seniorProfessionals.length > 10 ? `\n... e mais ${seniorProfessionals.length - 10} profissionais` : '')
  : '• Nenhum profissional com nível sênior encontrado'}

📈 Estatísticas Gerais:
• Colaboradores CLT: ${cltCount} (${Math.round(cltCount/totalProfessionals*100)}%)
• Colaboradores PJ: ${pjCount} (${Math.round(pjCount/totalProfessionals*100)}%)
• Tecnologia mais comum: ${mostCommonTech ? `${mostCommonTech[0]} (${mostCommonTech[1]} profissionais)` : 'Nenhuma tecnologia identificada'}
• Senioridade predominante: ${mostCommonSeniority ? `${mostCommonSeniority[0]} (${mostCommonSeniority[1]} profissionais)` : 'Dados de senioridade não disponíveis'}`;
  }

  // Respostas específicas baseadas na pergunta
  if (questionLower.includes('quantos') && (questionLower.includes('mysql') || questionLower.includes('react') || questionLower.includes('python'))) {
    let counts = [];
    if (questionLower.includes('mysql')) counts.push(`MySQL: ${techCount.mysql} profissionais`);
    if (questionLower.includes('react')) counts.push(`React: ${techCount.react} profissionais`);
    if (questionLower.includes('python')) counts.push(`Python: ${techCount.python} profissionais`);
    
    return `🔍 Análise Offline Inteligente

Pergunta: "${question}"

📊 Dados da HITSS (${totalProfessionals} profissionais):

${counts.join('\n')}

📈 Estatísticas Gerais:
• Colaboradores CLT: ${cltCount} (${Math.round(cltCount/totalProfessionals*100)}%)
• Colaboradores PJ: ${pjCount} (${Math.round(pjCount/totalProfessionals*100)}%)
• Tecnologia mais comum: ${mostCommonTech ? `${mostCommonTech[0]} (${mostCommonTech[1]} profissionais)` : 'Nenhuma tecnologia identificada'}
• Senioridade predominante: ${mostCommonSeniority ? `${mostCommonSeniority[0]} (${mostCommonSeniority[1]} profissionais)` : 'Dados de senioridade não disponíveis'}`;
  }

  // Resposta padrão com dados reais
  return `🔍 Análise Offline Inteligente

Pergunta: "${question}"

📊 Dados Analisados: ${totalProfessionals} profissionais da HITSS

📈 Estatísticas Principais:
• Colaboradores CLT: ${cltCount} (${Math.round(cltCount/totalProfessionals*100)}%)
• Colaboradores PJ: ${pjCount} (${Math.round(pjCount/totalProfessionals*100)}%)
• Tecnologia mais comum: ${mostCommonTech ? `${mostCommonTech[0]} (${mostCommonTech[1]} profissionais)` : 'Nenhuma tecnologia identificada'}
• Senioridade predominante: ${mostCommonSeniority ? `${mostCommonSeniority[0]} (${mostCommonSeniority[1]} profissionais)` : 'Dados de senioridade não disponíveis'}

🔍 Insights Baseados na Pergunta:${specificInsights || '\n• Análise geral dos dados disponíveis'}

🛠️ Stack Tecnológico:
• JavaScript: ${techCount.javascript} profissionais
• Java: ${techCount.java} profissionais  
• Python: ${techCount.python} profissionais
• React: ${techCount.react} profissionais
• TypeScript: ${techCount.typescript} profissionais
• MySQL: ${techCount.mysql} profissionais`;
} 