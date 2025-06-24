#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function debugApp() {
  console.log('🔍 Iniciando debug da aplicação...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true 
  });
  
  const page = await browser.newPage();
  
  // Capturar logs do console
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      console.log('❌ ERRO BROWSER:', text);
    } else if (text.includes('🔍') || text.includes('❌') || text.includes('✅')) {
      console.log(`📝 LOG: ${text}`);
    }
  });
  
  // Capturar erros de rede
  page.on('requestfailed', request => {
    console.log('🌐 ERRO REDE:', request.url(), request.failure().errorText);
  });
  
  try {
    console.log('🌐 Navegando para http://localhost:8080...');
    await page.goto('http://localhost:8080', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('✅ Página carregada com sucesso!');
    
    // Aguardar um pouco para capturar logs
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Erro ao carregar página:', error.message);
  }
  
  console.log('🔍 Debug concluído. Pressione Ctrl+C para sair.');
}

debugApp().catch(console.error); 