import XLSX from 'xlsx';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Configurações
const EXCEL_FILE_PATH = '/Users/fabriciocardosodelima/Desktop/talent-sphere-registry/public/Cadastro Colaboradores - FSW São Paulo(1-110).xlsx';
const EXCEL_SHEET_NAME = 'Sheet1';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TABLE_NAME = 'colaboradores';

// Colunas do Excel a serem ignoradas
const COLUMNS_TO_IGNORE = ["ID", "Hora de início", "Hora de conclusão", "Nome"];

// Mapeamento de colunas do Excel para a tabela Supabase
// Chave: Nome da coluna no Excel (exatamente como no arquivo)
// Valor: Nome da coluna na tabela Supabase
const COLUMN_MAPPING: { [key: string]: string } = {
  "Email": "email",
  "Hora da última modificação": "hora_ultima_modificacao",
  "Nome Completo": "nome_completo",
  "Regime": "regime",
  "Local de Alocação": "local_alocacao",
  "Proficiência": "proficiencia_cargo", // Esta é a coluna de cargo/proficiência geral
  "Java": "java",
  "JavaScript": "javascript",
  "Python": "python",
  "TypeScript": "typescript",
  "PHP": "php",
  ".NET": "dotnet",
  "React": "react",
  "Angular": "angular",
  "Ionic": "ionic",
  "Flutter": "flutter",
  "MySQL": "mysql",
  "Postgres": "postgres",
  "Oracle": "oracle_db",
  "SQL Server": "sql_server",
  "Mongo DB": "mongodb",
  "AWS": "aws",
  "Azure": "azure",
  "GCP": "gcp",
  "Conhece alguma outra tecnologia que não está na lista acima? Pode informar aqui:": "outras_tecnologias"
  // Removidas todas as tecnologias que não existem como colunas na tabela Supabase
};

// Função para converter data serial do Excel para objeto Date do JavaScript
// O XLSX.utils.sheet_to_json com raw:false ou cellDates:true geralmente lida com isso,
// mas esta é uma alternativa se necessário ou para maior controle.
function excelSerialDateToJSDate(serial: number | string | Date | null): Date | null {
  if (serial === null || serial === undefined) return null;
  if (serial instanceof Date) return serial; // Já é um objeto Date

  // Se for string, tenta converter para número. Se não for possível, retorna null.
  if (typeof serial === 'string') {
    const parsedSerial = parseFloat(serial);
    if (isNaN(parsedSerial)) return null;
    serial = parsedSerial;
  }
  
  if (typeof serial !== 'number') return null;

  // Lógica de conversão de data serial do Excel
  // (Excel para Windows considera 1/1/1900 como dia 1, mas há um bug que trata 1900 como ano bissexto)
  // Esta é uma conversão simplificada, pode precisar de ajustes para casos extremos ou Mac Excel 1904 date system.
  const utc_days  = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;                                        
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001; // Pequeno ajuste para precisão

  let total_seconds = Math.floor(86400 * fractional_day);

  const seconds = total_seconds % 60;
  total_seconds -= seconds;

  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}


async function uploadData() {
  console.log(`Iniciando upload para a tabela '${TABLE_NAME}' no Supabase...`);

  try {
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      console.error(`ERRO: Arquivo Excel não encontrado em: ${EXCEL_FILE_PATH}`);
      return;
    }

    const workbook = XLSX.readFile(EXCEL_FILE_PATH, { cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss' });
    const worksheet = workbook.Sheets[EXCEL_SHEET_NAME];

    if (!worksheet) {
      console.error(`ERRO: Planilha "${EXCEL_SHEET_NAME}" não encontrada no arquivo.`);
      return;
    }

    // Usar defval: null para que células vazias se tornem null
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    console.log(`Encontradas ${jsonData.length} linhas na planilha "${EXCEL_SHEET_NAME}".`);

    if (jsonData.length === 0) {
      console.log("Nenhum dado para importar.");
      return;
    }

    const dataToInsert = jsonData.map((row, index) => {
      const newRow: { [key: string]: any } = {};
      for (const excelColName in row) {
        if (row.hasOwnProperty(excelColName) && !COLUMNS_TO_IGNORE.includes(excelColName)) {
          const supabaseColName = COLUMN_MAPPING[excelColName];
          if (supabaseColName) {
            let value = row[excelColName];
            // Tratamento especial para a coluna de data
            if (supabaseColName === 'hora_ultima_modificacao') {
              const dateValue = excelSerialDateToJSDate(value);
              newRow[supabaseColName] = dateValue ? dateValue.toISOString() : null;
            } else {
              newRow[supabaseColName] = value;
            }
          }
        }
      }
      // Adiciona um log para a primeira linha processada para depuração
      if (index === 0) {
        console.log("Exemplo de linha mapeada para inserção:", newRow);
      }
      return newRow;
    }).filter(row => Object.keys(row).length > 0); // Filtra linhas que ficaram vazias após o mapeamento

    if (dataToInsert.length === 0) {
        console.log("Nenhum dado válido para inserir após o processamento.");
        return;
    }
    
    console.log(`Processadas ${dataToInsert.length} linhas para inserção.`);

    // Insere os dados em lotes para evitar sobrecarga (opcional, mas bom para muitos dados)
    const BATCH_SIZE = 100;
    for (let i = 0; i < dataToInsert.length; i += BATCH_SIZE) {
      const batch = dataToInsert.slice(i, i + BATCH_SIZE);
      console.log(`Inserindo/atualizando lote ${i/BATCH_SIZE + 1} com ${batch.length} linhas...`);
      const { data, error } = await supabase.from(TABLE_NAME).upsert(batch, { onConflict: 'email' });

      if (error) {
        console.error(`Erro ao inserir/atualizar lote de dados (linhas ${i + 1} a ${i + batch.length}):`, error);
        // Você pode decidir parar aqui ou continuar com os próximos lotes
      } else {
        console.log(`Lote de ${batch.length} linhas inserido/atualizado com sucesso.`);
      }
    }

    console.log("Upload de dados concluído.");

  } catch (error) {
    console.error("Ocorreu um erro geral durante o processo de upload:", error);
  }
}

// Executa a função de upload
uploadData();
