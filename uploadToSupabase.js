const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configurações
const EXCEL_FILE_PATH = './Cadastro Colaboradores - FSW São Paulo(1-97) - Detalhada.xlsx';
const EXCEL_SHEET_NAME = 'Planilha1';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TABLE_NAME = 'colaboradores';

// Colunas do Excel a serem ignoradas
const COLUMNS_TO_IGNORE = ["ID", "Hora de início", "Hora de conclusão", "Timestamp", "Nome"];

// Mapeamento de colunas do Excel para a tabela Supabase
const COLUMN_MAPPING = {
  "Email": "email",
  "Nome Completo": "nome_completo",
  "Regime": "regime",
  "Local de Alocação": "local_alocacao",
  "Cargo": "cargo",
  "Java": "java",
  "Python": "python",
  "C#": "csharp",
  "Ruby": "ruby",
  "Kotlin": "kotlin",
  "Scala": "scala",
  "COBOL": "cobol",
  "Wordpress": "wordpress",
  "JavaScript": "javascript",
  "TypeScript": "typescript",
  "PHP": "php",
  ".NET": "dotnet",
  "React": "react",
  "Angular": "angular",
  "Vue": "vue",
  "Svelte": "svelte",
  "Next": "next",
  "Nuxt": "nuxt",
  "Flutter": "flutter",
  "Ionic": "ionic",
  "SQL Server": "sql_server",
  "MySQL": "mysql",
  "Postgres": "postgres",
  "Oracle": "oracle_db",
  "Mongo DB": "mongodb",
  "Redis": "redis",
  "AWS": "aws",
  "Azure": "azure",
  "GCP": "gcp",
  "Docker": "docker",
  "Kubernetes": "kubernetes",
  "Terraform": "terraform",
  "Ansible": "ansible",
  "Jenkins": "jenkins",
  "Git": "git",
  "Jira": "jira",
  "Confluence": "confluence",
  "Tableau": "tableau",
  "Pentaho": "pentaho",
  "Mule": "mule",
  "Tibco": "tibco",
  "Hbase": "hbase",
  "Siebel": "siebel",
  "Outras Tecnologias": "outras_tecnologias"
};

// Função para converter data serial do Excel para objeto Date do JavaScript
function excelSerialDateToJSDate(serial) {
  if (serial === null || serial === undefined) return null;
  if (serial instanceof Date) return serial;

  if (typeof serial === 'string') {
    const parsedSerial = parseFloat(serial);
    if (isNaN(parsedSerial)) return null;
    serial = parsedSerial;
  }
  
  if (typeof serial !== 'number') return null;

  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;                                        
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001;
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

    // Converte a planilha para JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) {
      console.error('ERRO: Planilha está vazia');
      return;
    }

    // Primeira linha são os cabeçalhos
    const headers = jsonData[0];
    
    // Processa cada linha de dados (começa do índice 1, pois 0 são os cabeçalhos)
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      const record = {};

      // Mapeia os dados do Excel para o formato do Supabase
      headers.forEach((header, index) => {
        if (COLUMNS_TO_IGNORE.includes(header)) return;

        const supabaseColumn = COLUMN_MAPPING[header];
        if (supabaseColumn) {
          const value = row[index];
          
          // Trata datas
          if (typeof value === 'number' && header.includes('Hora')) {
            record[supabaseColumn] = excelSerialDateToJSDate(value);
          } else {
            record[supabaseColumn] = value;
          }
        }
      });

      // Insere no Supabase
      const { error } = await supabase
        .from(TABLE_NAME)
        .insert([record]);

      if (error) {
        console.error(`Erro ao inserir registro ${i}:`, error);
      } else {
        console.log(`Registro ${i} inserido com sucesso`);
      }
    }

    console.log('Upload concluído!');

  } catch (error) {
    console.error('Erro durante o upload:', error);
  }
}

// Executa a função de upload
uploadData();
