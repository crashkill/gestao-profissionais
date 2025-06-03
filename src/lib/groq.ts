const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function askGroq(question: string, professionals: any[]): Promise<string> {
  console.log('⚡ [DEBUG] Groq IA - Iniciando consulta...');
  console.log('⚡ [DEBUG] Groq API Key presente:', !!GROQ_API_KEY);
  
  if (!GROQ_API_KEY) {
    console.log('❌ [DEBUG] Groq API Key não encontrada');
    throw new Error('Groq API Key não configurada');
  }

  try {
    // Contexto otimizado para velocidade do Groq
    const context = professionals.slice(0, 8).map(p => {
      const skills = [];
      if (p.java === 'true') skills.push('Java');
      if (p.javascript === 'true') skills.push('JavaScript');
      if (p.python === 'true') skills.push('Python');
      if (p.react === 'true') skills.push('React');
      if (p.typescript === 'true') skills.push('TypeScript');
      
      return `${p.nome_completo || 'N/A'} | ${p.proficiencia_cargo || 'N/A'} | ${skills.join(', ')}`;
    }).join('\n');

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Modelo rápido do Groq
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em análise de dados de RH da HITSS. Responda em português brasileiro de forma clara e objetiva.'
          },
          {
            role: 'user',
            content: `Analise os dados dos ${professionals.length} profissionais da HITSS:

${context}

Pergunta: ${question}

Forneça insights úteis e específicos baseados nos dados.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    console.log('⚡ [DEBUG] Groq response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [DEBUG] Groq error:', errorText);
      throw new Error(`Groq API falhou: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    
    if (!result) {
      throw new Error('Groq não retornou resposta válida');
    }
    
    console.log('✅ [DEBUG] Groq resposta obtida com sucesso!');
    return result;

  } catch (error) {
    console.error('❌ [DEBUG] Erro no Groq:', error);
    // Re-throw o erro para que o Smart AI passe para a próxima opção
    throw error;
  }
}

export async function testGroq(): Promise<boolean> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 10,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
} 