export interface Professional {
  id: string; // UUID do Supabase
  email: string | null;
  area_atuacao: string | null;
  skill_principal: string | null;
  nivel_experiencia: string | null;
  hora_ultima_modificacao: string | null; // ISO date string
  nome_completo: string | null;
  regime: string | null;
  local_alocacao: string | null;
  proficiencia_cargo: string | null;
  java: string | null;
  javascript: string | null;
  python: string | null;
  typescript: string | null;
  php: string | null;
  dotnet: string | null;
  react: string | null;
  angular: string | null;
  ionic: string | null;
  flutter: string | null;
  mysql: string | null;
  postgres: string | null;
  oracle_db: string | null;
  sql_server: string | null;
  mongodb: string | null;
  aws: string | null;
  azure: string | null;
  gcp: string | null;
  outras_tecnologias: string | null;
  android: string | null;
  cobol: string | null;
  linguagem_r: string | null;
  linguagem_c: string | null;
  linguagem_cpp: string | null;
  windows: string | null;
  raspberry_pi: string | null;
  arduino: string | null;
  gerencia_projetos: string | null;
  administracao_projetos: string | null;
  analise_requisitos: string | null;
  created_at: string | null; // ISO date string
  disponivel_compartilhamento: boolean | null;
  percentual_compartilhamento: '100' | '75' | '50' | '25' | null;
}

export const AREAS = [
  'Desenvolvedor Frontend',
  'Desenvolvedor Backend', 
  'Desenvolvedor Fullstack',
  'DevOps',
  'QA/Tester',
  'Product Owner',
  'Scrum Master',
  'UI/UX Designer',
  'Data Scientist',
  'Mobile Developer',
  'Gestão de Projetos',
  'Recrutamento & Seleção',
  'Análise de Requisitos'
];

export const MAIN_SKILLS = [
  'JavaScript',
  'TypeScript', 
  'Python',
  'Java',
  'C#',
  'PHP',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  '.NET',
  'Spring Boot',
  'Gerencia de Projetos',
  'Administração de Projetos',
  'Linguagem R',
  'Linguagem C',
  'Linguagem C++',
  'Cobol',
  'Android',
  'Windows',
  'Raspberry PI',
  'Arduino',
  'Skalla',
  'Analise de Requisitos'
];

export const OTHER_SKILLS = [
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Express',
  'Django',
  'Flask',
  'Spring Boot',
  'Laravel',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'REST API',
  'Git',
  'Jenkins',
  'Terraform',
  'Figma',
  'Adobe XD',
  'Gerencia de Projetos',
  'Administração de Projetos',
  'Linguagem R',
  'Linguagem C',
  'Linguagem C++',
  'Cobol',
  'Android',
  'Windows',
  'Raspberry PI',
  'Arduino',
  'Skalla',
  'Analise de Requisitos'
];

export const SKILL_COLUMN_MAP: Record<string, string> = {
  'Java': 'java',
  'JavaScript': 'javascript',
  'Python': 'python',
  'TypeScript': 'typescript',
  'PHP': 'php',
  '.NET': 'dotnet',
  'React': 'react',
  'Angular': 'angular',
  'Ionic': 'ionic',
  'Flutter': 'flutter',
  'MySQL': 'mysql',
  'PostgreSQL': 'postgres',
  'Postgres': 'postgres',
  'Oracle': 'oracle_db',
  'SQL Server': 'sql_server',
  'MongoDB': 'mongodb',
  'Mongo DB': 'mongodb',
  'AWS': 'aws',
  'Azure': 'azure',
  'GCP': 'gcp',
  'Android': 'android',
  'Cobol': 'cobol',
  'Linguagem R': 'linguagem_r',
  'Linguagen R': 'linguagem_r',
  'Linguagem C': 'linguagem_c',
  'Linguagem C++': 'linguagem_cpp',
  'Windows': 'windows',
  'Raspberry PI': 'raspberry_pi',
  'Raspiberry PI': 'raspberry_pi',
  'Arduino': 'arduino',
  'Gerencia de Projetos': 'gerencia_projetos',
  'Administração de Projetos': 'administracao_projetos',
  'Analise de Requisitos': 'analise_requisitos'
};
