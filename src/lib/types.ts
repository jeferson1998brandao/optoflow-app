export interface Paciente {
  id: string;
  nome: string;
  cpf?: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  ultimaConsulta?: string;
  proximaConsulta?: string;
  status: 'ativo' | 'inativo' | 'retorno';
  sexo?: 'M' | 'F';
}

export interface Prontuario {
  id: string;
  pacienteId: string;
  data: string;
  // Olho Direito
  odEsferico?: number;
  odCilindrico?: number;
  odEixo?: number;
  odAdicao?: number;
  // Olho Esquerdo
  oeEsferico?: number;
  oeCilindrico?: number;
  oeEixo?: number;
  oeAdicao?: number;
  // Outros
  dnp?: number;
  dnpOD?: number;
  dnpOE?: number;
  acuidadeOD?: string;
  acuidadeOE?: string;
  pressaoOD?: number;
  pressaoOE?: number;
  observacoes?: string;
  anamnese?: Anamnese;
}

export interface Anamnese {
  usaOculos: boolean;
  tempoUso?: string;
  historicoFamiliar: boolean;
  diabetes: boolean;
  hipertensao: boolean;
  medicamentos?: string;
  queixaPrincipal?: string;
}

export interface Agendamento {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  data: string;
  hora: string;
  tipo: 'consulta' | 'retorno' | 'adaptacao';
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado';
  observacoes?: string;
}

export interface Profissional {
  nome: string;
  cro: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  especialidade?: string;
  logo?: string;
}
