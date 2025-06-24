#!/usr/bin/env node

console.log('🔍 Testando variáveis de ambiente...')
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'UNDEFINED')
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'UNDEFINED')

// Testar conectividade
if (process.env.VITE_SUPABASE_URL) {
  const url = process.env.VITE_SUPABASE_URL + '/rest/v1/colaboradores?limit=1'
  const headers = {
    'apikey': process.env.VITE_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
  }
  
  console.log('🌐 Testando conexão com:', url.substring(0, 50) + '...')
  
  fetch(url, { headers })
    .then(res => res.json())
    .then(data => {
      console.log('✅ Conexão OK! Dados:', data.length ? `${data.length} registros` : 'Vazio')
    })
    .catch(err => {
      console.error('❌ Erro na conexão:', err.message)
    })
} 