console.log("Script analyzeExcel.ts started...");
import XLSX from 'xlsx';
import * as fs from 'fs';
const filePath = '/Users/fabriciocardosodelima/Desktop/talent-sphere-registry/Cadastro Colaboradores - FSW São Paulo(1-97) - Detalhada.xlsx';
function analyzeExcelFile(path) {
    console.log(`Tentando analisar o arquivo em: ${path}`);
    try {
        if (!fs.existsSync(path)) {
            console.error(`ERRO: Arquivo não encontrado em: ${path}`);
            return;
        }
        const workbook = XLSX.readFile(path);
        const sheetNames = workbook.SheetNames;
        console.log('\n--------------------------------------------------------------------------');
        console.log('Planilhas encontradas no arquivo:', sheetNames);
        console.log('--------------------------------------------------------------------------');
        if (sheetNames.length === 0) {
            console.log("Nenhuma planilha encontrada no arquivo.");
            return;
        }
        sheetNames.forEach(sheetName => {
            console.log(`\n--- Analisando Planilha: "${sheetName}" ---`);
            const worksheet = workbook.Sheets[sheetName];
            if (!worksheet) {
                console.log(`Não foi possível carregar a planilha "${sheetName}".`);
                return;
            }
            // Tenta pegar a primeira linha como cabeçalhos
            // A opção { header: 1 } retorna um array de arrays.
            // range: 0 especifica para processar apenas a primeira linha (índice 0).
            const jsonDataFirstRow = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0 });
            let headers = [];
            if (jsonDataFirstRow.length > 0 && Array.isArray(jsonDataFirstRow[0])) {
                headers = jsonDataFirstRow[0]
                    .map(header => String(header ?? '').trim()) // Converte para string e remove espaços
                    .filter(header => header !== ''); // Filtra cabeçalhos vazios
            }
            if (headers.length > 0) {
                console.log('Cabeçalhos (Colunas da primeira linha):', headers);
            }
            else {
                // Se a primeira linha não forneceu cabeçalhos, tenta ler algumas linhas para inspeção
                console.log('Não foram encontrados cabeçalhos na primeira linha ou a primeira linha está vazia.');
                const sampleData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 5 }); // Pega até 5 linhas
                if (sampleData.length > 0) {
                    console.log('Amostra de dados das primeiras linhas (para ajudar a identificar cabeçalhos):');
                    sampleData.forEach((row, index) => {
                        console.log(`Linha ${index + 1}:`, row);
                    });
                }
            }
            console.log('--------------------------------------------------------------------------');
        });
    }
    catch (error) {
        console.error('Ocorreu um erro ao analisar o arquivo Excel:', error);
    }
}
analyzeExcelFile(filePath);
//# sourceMappingURL=analyzeExcel.js.map