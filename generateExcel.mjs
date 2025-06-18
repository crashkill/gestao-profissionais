import { faker } from '@faker-js/faker';
import * as XLSX from 'xlsx';
import { writeFile } from 'fs/promises';

const areas = ['Desenvolvedor Frontend', 'Desenvolvedor Backend', 'Desenvolvedor Fullstack', 'DevOps', 'QA/Tester', 'Product Owner', 'Scrum Master', 'UI/UX Designer', 'Data Scientist', 'Mobile Developer'];
const mainSkills = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin', 'React', 'Vue.js', 'Angular', 'Node.js', '.NET', 'Spring Boot'];
const otherSkills = ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'Git', 'Jenkins', 'Terraform', 'Figma'];
const levels = ['Júnior', 'Pleno', 'Sênior'];
const sharePercentages = [100, 75, 50, 25, 0];

const professionals = [];

console.log('Gerando 100 perfis de profissionais...');

for (let i = 0; i < 100; i++) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const email = faker.internet.email({ firstName, lastName, provider: 'globalhitss.com.br' }).toLowerCase();

  const availableOtherSkills = [...otherSkills];
  const numOtherSkills = faker.number.int({ min: 1, max: 4 });
  const selectedOtherSkills = [];
  for(let j = 0; j < numOtherSkills; j++) {
      const randomIndex = faker.number.int({ min: 0, max: availableOtherSkills.length - 1 });
      selectedOtherSkills.push(availableOtherSkills.splice(randomIndex, 1)[0]);
  }

  const isShared = faker.datatype.boolean();

  professionals.push({
    'Nome Completo': fullName,
    'Email': email,
    'Área de Atuação': faker.helpers.arrayElement(areas),
    'Skill Principal': faker.helpers.arrayElement(mainSkills),
    'Nível de Experiência': faker.helpers.arrayElement(levels),
    'Disponível para Compartilhamento': isShared ? 'Sim' : 'Não',
    'Percentual de Compartilhamento': isShared ? faker.helpers.arrayElement(sharePercentages) : '',
    'Outras Skills': selectedOtherSkills.join(','),
  });
}

const worksheet = XLSX.utils.json_to_sheet(professionals);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Profissionais');

const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
const filePath = './profissionais_teste_100.xlsx';

writeFile(filePath, excelBuffer)
  .then(() => {
    console.log(`Arquivo Excel "${filePath}" criado com sucesso.`);
  })
  .catch((err) => {
    console.error('Erro ao criar o arquivo Excel:', err);
  }); 