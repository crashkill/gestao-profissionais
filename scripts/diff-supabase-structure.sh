#!/bin/bash
# Script para comparar a estrutura dos bancos de dados Supabase (Produção vs Homologação)

# IDs dos projetos Supabase
PROD_PROJECT_ID="pwksgdjjkryqryqrvyja"
HOMOLOG_PROJECT_ID="zbiivgtdamejiwcabmcv"

echo "🔍 Iniciando comparação de estruturas dos bancos Supabase..."
echo "--------------------------------------------------------"
echo "Produção: $PROD_PROJECT_ID"
echo "Homologação: $HOMOLOG_PROJECT_ID"
echo "--------------------------------------------------------"

# Função para obter e processar tabelas de um projeto
get_tables() {
  PROJECT_ID=$1
  MCP_COMMAND="npx -y @supabase/mcp-server-supabase@latest --project-id $PROJECT_ID list-tables"
  
  # A saída do MCP é um JSON, então vamos processá-lo para extrair nomes de tabelas
  $MCP_COMMAND | grep '"name":' | awk -F'"' '{print $4}' | sort
}

# Obter listas de tabelas
PROD_TABLES=$(get_tables $PROD_PROJECT_ID)
HOMOLOG_TABLES=$(get_tables $HOMOLOG_PROJECT_ID)

# Comparar as listas de tabelas
echo "📊 Comparando listas de tabelas..."
DIFF_OUTPUT=$(diff <(echo "$PROD_TABLES") <(echo "$HOMOLOG_TABLES"))

if [ -z "$DIFF_OUTPUT" ]; then
  echo "✅ As estruturas das tabelas parecem estar sincronizadas!"
  echo "Ambos os ambientes possuem as seguintes tabelas:"
  echo "$PROD_TABLES"
else
  echo "⚠️ Foram encontradas diferenças na estrutura das tabelas!"
  echo "Abaixo está o resumo das diferenças (o que existe em um ambiente e não no outro):"
  echo ""
  echo "$DIFF_OUTPUT"
  echo ""
  echo "Legenda do Diff:"
  echo "  < [nome_da_tabela]  (Existe apenas em Produção)"
  echo "  > [nome_da_tabela]  (Existe apenas em Homologação)"
fi

echo "--------------------------------------------------------"
echo "Comparação finalizada."
echo "Para uma análise mais profunda das colunas, use o Supabase Studio." 