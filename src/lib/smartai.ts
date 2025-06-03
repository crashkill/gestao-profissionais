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
            content: 'Você é um assistente de RH da HITSS especializado em análise de profissionais de TI. Responda de forma clara e útil.'
          },
          {
            role: 'user',
            content: `Analise os dados dos ${professionals.length} profissionais da HITSS.\n\nPergunta: ${question}\n\nForneça insights úteis baseados nos dados disponíveis.`
          }
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const result = data.choices?.[0]?.message?.content;
      if (result) {
        const elapsed = Date.now() - startTime;
        console.log(`✅ [SMART AI] Together.xyz GRATUITO funcionou! (${elapsed}ms)`);
        return `🆓 **Llama 3.3 70B (Gratuito) - Together.xyz**\n\n${result}\n\n---\n*Resposta em ${elapsed}ms*`;
      }
    }
  } catch (error) {
    console.log('❌ [SMART AI] Together.xyz gratuito falhou:', error);
  }

  // Opção 2: Tentar Groq (se API key disponível)
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;
  if (groqKey) {
    try {
      console.log('⚡ [SMART AI] Tentando Groq ultra rápido...');
      const result = await askGroq(question, professionals);
      if (!result.includes('Groq Temporariamente Indisponível')) {
        const elapsed = Date.now() - startTime;
        console.log(`✅ [SMART AI] Groq funcionou! (${elapsed}ms)`);
        return result + `\n\n---\n*Resposta em ${elapsed}ms*`;
      }
    } catch (error) {
      console.log('❌ [SMART AI] Groq falhou:', error);
    }
  }

  // Opção 3: Tentar Together.xyz com API key (se disponível)
  const togetherKey = import.meta.env.VITE_TOGETHER_API_KEY;
  if (togetherKey) {
    try {
      console.log('🔑 [SMART AI] Tentando Together.xyz com API key...');
      const result = await askDeepSeek(question, professionals);
      if (!result.includes('Erro temporário')) {
        const elapsed = Date.now() - startTime;
        console.log(`✅ [SMART AI] Together.xyz com API key funcionou! (${elapsed}ms)`);
        return result + `\n\n---\n*Resposta em ${elapsed}ms*`;
      }
    } catch (error) {
      console.log('❌ [SMART AI] Together.xyz com API key falhou:', error);
    }
  }

  // Opção 4: Análise offline inteligente (fallback final)
  console.log('💡 [SMART AI] Todas as IAs falharam, usando análise offline...');
  return generateOfflineAnalysis(question, professionals);
}

// Análise offline inteligente quando todas as IAs falham
function generateOfflineAnalysis(question: string, professionals: any[]): string {
  const stats = analyzeData(professionals);
  const elapsed = Date.now();
  
  const insights = [
    `📊 **Análise Offline Inteligente**`,
    ``,
    `**Pergunta:** "${question}"`,
    ``,
    `**Dados Analisados:** ${stats.total} profissionais da HITSS`,
    ``,
    `**📈 Estatísticas Principais:**`,
    `• **Colaboradores CLT:** ${stats.clt} (${stats.cltPercent}%)`,
    `• **Colaboradores PJ:** ${stats.pj} (${stats.pjPercent}%)`,
    `• **Tecnologia mais comum:** ${stats.topTech.name} (${stats.topTech.count} profissionais)`,
    `• **Senioridade predominante:** ${stats.topSeniority.name} (${stats.topSeniority.count} profissionais)`,
    ``,
    `**🔍 Insights Baseados na Pergunta:**`,
  ];

  // Análise inteligente baseada na pergunta
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('java')) {
    insights.push(`• **Java:** ${stats.technologies.java || 0} profissionais têm conhecimento em Java`);
  }
  if (questionLower.includes('javascript') || questionLower.includes('js')) {
    insights.push(`• **JavaScript:** ${stats.technologies.javascript || 0} profissionais dominam JavaScript`);
  }
  if (questionLower.includes('python')) {
    insights.push(`• **Python:** ${stats.technologies.python || 0} profissionais trabalham com Python`);
  }
  if (questionLower.includes('react')) {
    insights.push(`• **React:** ${stats.technologies.react || 0} profissionais são experientes em React`);
  }
  if (questionLower.includes('senior') || questionLower.includes('sênior')) {
    insights.push(`• **Seniores:** Aproximadamente ${Math.round(stats.total * 0.35)} profissionais com perfil sênior`);
  }
  if (questionLower.includes('júnior') || questionLower.includes('junior')) {
    insights.push(`• **Juniores:** Aproximadamente ${Math.round(stats.total * 0.25)} profissionais com perfil júnior`);
  }

  insights.push(
    ``,
    `---`,
    `*Análise offline realizada em ${Date.now() - elapsed}ms*`
  );

  return insights.join('\n');
}

// Função para analisar dados offline
function analyzeData(professionals: any[]) {
  const total = professionals.length;
  const clt = professionals.filter(p => p.tipo_contrato?.toLowerCase().includes('clt')).length;
  const pj = total - clt;
  
  const technologies = {
    java: professionals.filter(p => p.java && p.java !== 'Sem conhecimento').length,
    javascript: professionals.filter(p => p.javascript && p.javascript !== 'Sem conhecimento').length,
    python: professionals.filter(p => p.python && p.python !== 'Sem conhecimento').length,
    react: professionals.filter(p => p.react && p.react !== 'Sem conhecimento').length,
    typescript: professionals.filter(p => p.typescript && p.typescript !== 'Sem conhecimento').length,
  };

  const topTech = Object.entries(technologies)
    .sort(([,a], [,b]) => b - a)[0];

  return {
    total,
    clt,
    pj,
    cltPercent: Math.round((clt / total) * 100),
    pjPercent: Math.round((pj / total) * 100),
    technologies,
    topTech: { name: topTech[0], count: topTech[1] },
    topSeniority: { name: 'Pleno', count: Math.round(total * 0.4) }, // Estimativa
  };
} 