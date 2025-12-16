

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  EMPLOYEES = 'EMPLOYEES',
  DEPARTMENTS = 'DEPARTMENTS',
  VACATIONS = 'VACATIONS',
  REPORTS = 'REPORTS',
  AI_ASSISTANT = 'AI_ASSISTANT',
  EVOLUTION = 'EVOLUTION'
}

export enum AccessLevel {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
  description: string;
}

export enum EmployeeStatus {
  ACTIVE = 'Ativo',
  ON_LEAVE = 'Licença',
  TERMINATED = 'Desligado'
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Used as current job title
  previousRole?: string; // Função Anterior
  departmentId: string;
  joinDate: string; // Data de Admissão
  salary: number;
  status: EmployeeStatus;
  avatarUrl: string;
  
  // Auth Fields
  accessLevel: AccessLevel;
  password?: string; // In a real app, this would be hashed.
  mustChangePassword?: boolean; // Flag to force password change on first login

  // New Fields
  sex: 'M' | 'F';
  nuti: string;
  careerCategory: string; // Carreira/Categoria (Ex: Técnico, Assistente)
  
  // --- NOVOS CAMPOS PARA PROMOÇÃO E PROGRESSÃO ---
  careerLevel: 'A' | 'B' | 'C' | 'D' | 'E'; // Níveis para Promoção
  careerStep: 1 | 2 | 3; // Escalões para Progressão
  // -----------------------------------------------

  academicLevel: 'Elementar' | 'Básico' | 'Médio' | 'Licenciatura' | 'Mestrado' | 'Doutorado' | string;
  contractType: 'Efectivo' | 'Contratado' | 'Mobilidade' | 'Destacado';
  birthDate: string;
  
  // --- FILIAÇÃO SEPARADA ---
  fatherName?: string; 
  motherName?: string;
  // -------------------------

  address?: string; // Endereço
  isLeadership: boolean;
  leadershipRole?: string;
  phone: string;
  documents: {
    personal?: string;
    academic?: string;
    administrative?: string;
    performance?: string;
    others?: string;
  };
}

export enum RequestStatus {
  PENDING = 'Pendente',
  APPROVED = 'Aprovado',
  REJECTED = 'Rejeitado'
}

export enum LeaveType {
  VACATION = 'Férias',
  SICK = 'Saúde',
  SHORT_LEAVE = 'Dispensa',
  OTHER = 'Outros'
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  requestDate: string;
}

// New Interface for Vacation Planning
export interface VacationPlan {
  id: string;
  employeeId: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: 'Planeado' | 'Convertido';
  createdAt: string;
}

// New Interface for System Notifications
export interface Notification {
  id: string;
  type: 'ALERT' | 'INFO' | 'REMINDER';
  title: string;
  message: string;
  date: string;
  read: boolean;
  recipientEmail?: string;
}

// --- EVOLUTION / CAREER HISTORY TYPES ---
export enum EvolutionType {
  ADMISSAO = 'Admissão',
  PROMOCAO = 'Promoção', // Muda Nível (A-E)
  PROGRESSAO = 'Progressão', // Muda Escalão (1-3)
  MUDANCA_CARREIRA = 'Mudança de Carreira', // Muda Função/Categoria
  CHEFIA = 'Nomeação Chefia',
  MOBILIDADE = 'Mobilidade', // Muda departamento/local
  CESSACAO = 'Cessação de Funções'
}

export interface EvolutionRecord {
  id: string;
  employeeId: string;
  type: EvolutionType;
  date: string;
  endDate?: string; // Usado para saber se a função cessou
  origin: string; // De onde sai (Ex: Nível E)
  destination: string; // Para onde vai (Ex: Nível D)
  description: string; // Observações adicionais
  isActive: boolean; // Se é o estado atual
}

export interface AppData {
  departments: Department[];
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  vacationPlans: VacationPlan[];
  notifications: Notification[];
  evolutionHistory: EvolutionRecord[];
}