import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileSpreadsheet, Check, AlertCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Professional } from '../types/Professional';

interface ExcelImportProps {
  onImport: (professionals: Omit<Professional, 'id' | 'created_at'>[]) => void;
  onBack: () => void;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ onImport, onBack }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    console.log('[ExcelImport] Iniciando processamento do arquivo:', file.name);
    setError('');
    
    if (!file.name.endsWith('.xlsx')) {
      setError('Por favor, selecione um arquivo .xlsx válido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        console.log('[ExcelImport] Arquivo lido com sucesso. Processando...');
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log(`[ExcelImport] ${jsonData.length} linhas encontradas no arquivo.`);

        if (jsonData.length === 0) {
          setError('O arquivo Excel está vazio');
          return;
        }

        // Validate required columns
        const requiredColumns = ['Nome Completo', 'Email', 'Área de Atuação', 'Skill Principal', 'Nível de Experiência'];
        const firstRow = jsonData[0] as any;
        const actualColumns = Object.keys(firstRow);
        console.log('[ExcelImport] Colunas encontradas no arquivo:', actualColumns);

        const missingColumns = requiredColumns.filter(col => !actualColumns.includes(col));
        
        if (missingColumns.length > 0) {
          const errorMessage = `Colunas obrigatórias faltando: ${missingColumns.join(', ')}`;
          console.error('[ExcelImport] Erro de validação:', errorMessage);
          setError(errorMessage);
          return;
        }

        console.log('[ExcelImport] Validação de colunas passou. Mostrando prévia.');
        setPreviewData(jsonData);
        setShowPreview(true);
      } catch (err) {
        console.error('[ExcelImport] Erro no processamento do Excel:', err);
        setError('Erro ao processar o arquivo Excel');
      }
    };
    reader.onerror = (err) => {
        console.error('[ExcelImport] Erro na leitura do arquivo:', err);
        setError('Não foi possível ler o arquivo.');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const generateTemplate = () => {
    const headers = [
      'Nome Completo',
      'Email',
      'Área de Atuação',
      'Skill Principal',
      'Nível de Experiência',
      'Disponível para Compartilhamento',
      'Percentual de Compartilhamento',
      'Outras Skills'
    ];

    const exampleData = [
      {
        'Nome Completo': 'João Silva',
        'Email': 'joao.silva@exemplo.com',
        'Área de Atuação': 'Desenvolvedor Frontend',
        'Skill Principal': 'React',
        'Nível de Experiência': 'Pleno',
        'Disponível para Compartilhamento': 'Sim',
        'Percentual de Compartilhamento': '75',
        'Outras Skills': 'JavaScript, TypeScript, HTML, CSS'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(exampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profissionais');

    // Adicionar validações
    const validations = {
      'D2:D1000': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin', 'React', 'Vue.js', 'Angular', 'Node.js', '.NET', 'Spring Boot'],
      'E2:E1000': ['Sim', 'Não'],
      'F2:F1000': ['100', '75', '50', '25'],
      'H2:H1000': ['Júnior', 'Pleno', 'Sênior']
    };

    // Salvar o arquivo
    XLSX.writeFile(wb, 'modelo_importacao_profissionais.xlsx');
  };

  const processImport = () => {
    console.log(`[ExcelImport] Iniciando importação de ${previewData.length} profissionais.`);
    const professionalsToImport: Omit<Professional, 'id' | 'created_at'>[] = previewData.map((row: any) => ({
      nome_completo: row['Nome Completo'] || '',
      email: row.Email || '',
      area_atuacao: row['Área de Atuação'] || null,
      skill_principal: row['Skill Principal'] || null,
      nivel_experiencia: row['Nível de Experiência'] || null,
      regime: null,
      local_alocacao: null,
      proficiencia_cargo: null,
      java: null,
      javascript: null,
      python: null,
      typescript: null,
      php: null,
      dotnet: null,
      react: null,
      angular: null,
      ionic: null,
      flutter: null,
      mysql: null,
      postgres: null,
      oracle_db: null,
      sql_server: null,
      mongodb: null,
      aws: null,
      azure: null,
      gcp: null,
      outras_tecnologias: row['Outras Skills'] || null,
      hora_ultima_modificacao: new Date().toISOString(),
      disponivel_compartilhamento: row['Disponível para Compartilhamento']?.toLowerCase() === 'sim',
      percentual_compartilhamento: row['Percentual de Compartilhamento'] as '100' | '75' | '50' | '25' | null
    }));

    onImport(professionalsToImport);
    console.log('[ExcelImport] Importação concluída. Mostrando sucesso e redirecionando.');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onBack();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="h-8 w-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {previewData.length} Profissionais Importados!
          </h3>
          <p className="text-slate-300">Redirecionando para o dashboard...</p>
        </div>
      </motion.div>
    );
  }

  if (showPreview) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors mr-4"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              <h2 className="text-2xl font-bold text-white">
                Prévia dos Dados ({previewData.length} profissionais)
              </h2>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={processImport}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Confirmar Importação
            </motion.button>
          </div>

          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-3 text-slate-300">Nome</th>
                  <th className="text-left p-3 text-slate-300">Email</th>
                  <th className="text-left p-3 text-slate-300">Área</th>
                  <th className="text-left p-3 text-slate-300">Skill Principal</th>
                  <th className="text-left p-3 text-slate-300">Compartilhamento</th>
                  <th className="text-left p-3 text-slate-300">Percentual</th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 10).map((row: any, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="p-3 text-white">{row.Nome}</td>
                    <td className="p-3 text-slate-300">{row.Email}</td>
                    <td className="p-3 text-slate-300">{row.Area}</td>
                    <td className="p-3 text-slate-300">{row['Skill Principal']}</td>
                    <td className="p-3 text-slate-300">{row['Disponivel para Compartilhamento']}</td>
                    <td className="p-3 text-slate-300">{row['Percentual de Compartilhamento']}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <p className="text-slate-400 text-center mt-4">
                ...e mais {previewData.length - 10} profissionais
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors mr-4"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            <h2 className="text-3xl font-bold text-white">Importar do Excel</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateTemplate}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
          >
            <Download className="h-4 w-4" />
            Baixar Modelo
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </motion.div>
        )}

        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-blue-400 bg-blue-400/10'
              : 'border-white/30 hover:border-white/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-blue-500/20 rounded-full">
              <FileSpreadsheet className="h-12 w-12 text-blue-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                Arraste e solte seu arquivo Excel
              </h3>
              <p className="text-slate-400 mb-4">
                ou clique para selecionar
              </p>
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={generateTemplate}
                  className="text-sm text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  Baixar modelo de planilha
                </button>
                <div className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer">
                  <Upload className="h-5 w-5" />
                  Selecionar Arquivo
                </div>
              </div>
            </div>
          </div>

          </div>
          <div className="mt-8 bg-white/5 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Formato do Excel:</h4>
            <div className="text-sm text-slate-300 space-y-2">
              <p><strong>Colunas obrigatórias:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Nome</li>
                <li>Email</li>
                <li>Area</li>
                <li>Skill Principal</li>
                <li>Disponivel para Compartilhamento (Sim/Não)</li>
                <li>Percentual de Compartilhamento (100/75/50/25)</li>
              </ul>
              <p className="mt-4"><strong>Colunas opcionais:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Outras Skills (separadas por vírgula)</li>
                <li>Nivel (Júnior, Pleno, Sênior)</li>
              </ul>
              <p className="mt-4 text-blue-300">
                Dica: Clique em "Baixar modelo de planilha" para obter um arquivo Excel pré-formatado com todas as colunas e validações.
              </p>
            </div>
          </div>
        </div>
    </motion.div>
  );
};

export default ExcelImport;
