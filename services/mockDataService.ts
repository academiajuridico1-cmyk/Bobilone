

import { AppData, Department, Employee, EmployeeStatus, LeaveRequest, LeaveType, RequestStatus, VacationPlan, Notification, AccessLevel, EvolutionRecord, EvolutionType } from '../types';

// Initial Mock Data
const initialData: AppData = {
  departments: [
    { id: 'd1', name: 'Engenharia', description: 'Desenvolvimento e QA' },
    { id: 'd2', name: 'Recursos Humanos', description: 'Gestão de pessoas e cultura' },
    { id: 'd3', name: 'Vendas', description: 'Comercial e Parcerias' },
    { id: 'd4', name: 'Marketing', description: 'Growth e Branding' },
  ],
  employees: [
    { 
      id: 'e1', firstName: 'Ana', lastName: 'Silva', email: 'admin@nexushr.com', role: 'Engenheira Senior', departmentId: 'd1', joinDate: '2022-03-15', salary: 12000, status: EmployeeStatus.ACTIVE, avatarUrl: 'https://picsum.photos/100/100?random=1',
      sex: 'F', nuti: '123456789', careerCategory: 'Técnico Superior', careerLevel: 'C', careerStep: 2, academicLevel: 'Licenciatura', contractType: 'Efectivo', birthDate: '1990-05-20', isLeadership: false, phone: '841234567', documents: {},
      accessLevel: AccessLevel.ADMIN, password: 'admin', mustChangePassword: false, fatherName: 'João Silva', motherName: 'Maria Silva', address: 'Av. 25 de Setembro, Maputo', previousRole: 'Engenheira Junior'
    },
    { 
      id: 'e2', firstName: 'Carlos', lastName: 'Mendes', email: 'gestor@nexushr.com', role: 'Gerente de Vendas', departmentId: 'd3', joinDate: '2021-06-01', salary: 15000, status: EmployeeStatus.ACTIVE, avatarUrl: 'https://picsum.photos/100/100?random=2',
      sex: 'M', nuti: '987654321', careerCategory: 'Gestão', careerLevel: 'B', careerStep: 3, academicLevel: 'Mestrado', contractType: 'Efectivo', birthDate: '1985-08-10', isLeadership: true, leadershipRole: 'Director Comercial', phone: '829876543', documents: {},
      accessLevel: AccessLevel.MANAGER, password: '123', mustChangePassword: false, fatherName: 'Pedro Mendes', motherName: 'Ana Mendes', address: 'Rua da Polana, Maputo'
    },
    { 
      id: 'e3', firstName: 'Beatriz', lastName: 'Costa', email: 'bia.costa@nexushr.com', role: 'Analista de RH', departmentId: 'd2', joinDate: '2023-01-10', salary: 5000, status: EmployeeStatus.ON_LEAVE, avatarUrl: 'https://picsum.photos/100/100?random=3',
      sex: 'F', nuti: '456123789', careerCategory: 'Técnico', careerLevel: 'E', careerStep: 1, academicLevel: 'Licenciatura', contractType: 'Contratado', birthDate: '1995-12-05', isLeadership: false, phone: '845556667', documents: {},
      accessLevel: AccessLevel.EMPLOYEE, password: '123', mustChangePassword: false, fatherName: 'José Costa', motherName: 'Sofia Costa', address: 'Bairro Central, Maputo'
    },
    { 
      id: 'e4', firstName: 'João', lastName: 'Pereira', email: 'joao.p@nexushr.com', role: 'Designer', departmentId: 'd4', joinDate: '2022-11-20', salary: 7000, status: EmployeeStatus.ACTIVE, avatarUrl: 'https://picsum.photos/100/100?random=4',
      sex: 'M', nuti: '789123456', careerCategory: 'Técnico Especialista', careerLevel: 'D', careerStep: 1, academicLevel: 'Médio', contractType: 'Contratado', birthDate: '1992-03-15', isLeadership: false, phone: '861112223', documents: {},
      accessLevel: AccessLevel.EMPLOYEE, password: '123', mustChangePassword: false, fatherName: 'Manuel Pereira', motherName: 'Clara Pereira', address: 'Matola Rio'
    },
    { 
      id: 'e5', firstName: 'Mariana', lastName: 'Lopes', email: 'mari.lopes@nexushr.com', role: 'DevOps', departmentId: 'd1', joinDate: '2023-05-15', salary: 11000, status: EmployeeStatus.ACTIVE, avatarUrl: 'https://picsum.photos/100/100?random=5',
      sex: 'F', nuti: '321654987', careerCategory: 'Técnico Superior', careerLevel: 'D', careerStep: 2, academicLevel: 'Licenciatura', contractType: 'Mobilidade', birthDate: '1993-07-22', isLeadership: false, phone: '859998887', documents: {},
      accessLevel: AccessLevel.EMPLOYEE, password: '123', mustChangePassword: false, fatherName: 'Rui Lopes', motherName: 'Inês Lopes', address: 'Zimpeto, Maputo', previousRole: 'SysAdmin'
    },
  ],
  leaveRequests: [
    { id: 'r1', employeeId: 'e3', type: LeaveType.VACATION, startDate: '2023-11-01', endDate: '2023-11-15', reason: 'Viagem anual', status: RequestStatus.APPROVED, requestDate: '2023-10-01' },
    { id: 'r2', employeeId: 'e1', type: LeaveType.SICK, startDate: '2023-10-25', endDate: '2023-10-26', reason: 'Gripe', status: RequestStatus.APPROVED, requestDate: '2023-10-25' },
    { id: 'r3', employeeId: 'e4', type: LeaveType.VACATION, startDate: '2023-12-20', endDate: '2024-01-05', reason: 'Festas de fim de ano', status: RequestStatus.PENDING, requestDate: '2023-10-28' },
    { id: 'r4', employeeId: 'e5', type: LeaveType.OTHER, startDate: '2023-11-10', endDate: '2023-11-10', reason: 'Mudança de casa', status: RequestStatus.PENDING, requestDate: '2023-10-29' },
  ],
  vacationPlans: [],
  notifications: [],
  evolutionHistory: [
    {
      id: 'ev1',
      employeeId: 'e1',
      type: EvolutionType.ADMISSAO,
      date: '2022-03-15',
      origin: 'Externo',
      destination: 'Engenheira Junior',
      description: 'Admissão por concurso público.',
      isActive: false
    },
    {
      id: 'ev2',
      employeeId: 'e1',
      type: EvolutionType.MUDANCA_CARREIRA, // Alterado de PROMOCAO genérica
      date: '2023-03-15',
      origin: 'Engenheira Junior',
      destination: 'Engenheira Senior',
      description: 'Mudança de carreira por mérito.',
      isActive: true
    },
    {
      id: 'ev3',
      employeeId: 'e2',
      type: EvolutionType.CHEFIA,
      date: '2021-06-01',
      origin: 'Técnico Vendas',
      destination: 'Director Comercial',
      description: 'Nomeação para cargo de direção.',
      isActive: true
    }
  ]
};

// Simulate a database
class MockDataService {
  private data: AppData;

  constructor() {
    this.data = initialData;
    this.initializeNotifications();
  }

  getData(): AppData {
    return this.data;
  }

  // --- EVOLUTION CRUD ---
  addEvolutionRecord(record: EvolutionRecord) {
    this.data.evolutionHistory.push(record);
    
    // ATUALIZAÇÃO AUTOMÁTICA DO FUNCIONÁRIO
    // O sistema reconhece a mudança e atualiza os dados do funcionário
    const empIndex = this.data.employees.findIndex(e => e.id === record.employeeId);
    if (empIndex !== -1) {
       const emp = this.data.employees[empIndex];
       
       if (record.type === EvolutionType.MUDANCA_CARREIRA) {
          emp.previousRole = emp.role; // Guarda a função antiga
          emp.role = record.destination; // Atualiza a nova função
       } else if (record.type === EvolutionType.PROMOCAO) {
          // Extrai o nível do destino (Ex: "Nível B" -> "B") ou assume que o destination É a letra
          const newLevel = record.destination.replace('Nível ', '').trim() as 'A'|'B'|'C'|'D'|'E';
          if (['A','B','C','D','E'].includes(newLevel)) {
             emp.careerLevel = newLevel;
          }
       } else if (record.type === EvolutionType.PROGRESSAO) {
          // Extrai o escalão do destino (Ex: "Escalão 2" -> 2)
          const newStep = parseInt(record.destination.replace('Escalão ', '').trim());
          if (!isNaN(newStep) && [1,2,3].includes(newStep)) {
             emp.careerStep = newStep as 1|2|3;
          }
       } else if (record.type === EvolutionType.CHEFIA) {
          emp.isLeadership = true;
          emp.leadershipRole = record.destination;
       } else if (record.type === EvolutionType.CESSACAO) {
          if (emp.isLeadership && emp.leadershipRole === record.origin) {
             emp.isLeadership = false;
             emp.leadershipRole = undefined;
          }
          if (emp.role === record.origin) {
             emp.status = EmployeeStatus.TERMINATED;
          }

          this.data.notifications.push({
            id: `notif-cess-${Date.now()}`,
            type: 'ALERT',
            title: 'Cessação de Funções',
            message: `O funcionário ${emp.firstName} ${emp.lastName} cessou funções de ${record.origin}.`,
            date: new Date().toISOString(),
            read: false
          });
       }
    }
  }

  ceaseFunctions(recordId: string, endDate: string) {
    const rec = this.data.evolutionHistory.find(r => r.id === recordId);
    if (rec) {
      rec.isActive = false;
      rec.endDate = endDate;
      
      const cessationRecord: EvolutionRecord = {
          id: `ev-cess-${Date.now()}`,
          employeeId: rec.employeeId,
          type: EvolutionType.CESSACAO,
          date: endDate,
          origin: rec.destination,
          destination: 'Função Cessada',
          description: `Cessação de funções de: ${rec.destination}`,
          isActive: false
      };
      this.addEvolutionRecord(cessationRecord);
    }
  }

  // --- AUTHENTICATION ---
  authenticate(email: string, password: string): Employee | null {
    const user = this.data.employees.find(e => e.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  registerAdmin(firstName: string, lastName: string, email: string, password: string): Employee | null {
    if (this.data.employees.find(e => e.email.toLowerCase() === email.toLowerCase())) {
        return null;
    }

    const newAdmin: Employee = {
        id: `admin-${Date.now()}`,
        firstName,
        lastName,
        email,
        password,
        accessLevel: AccessLevel.ADMIN,
        role: 'Administrador do Sistema',
        departmentId: '', 
        joinDate: new Date().toISOString().split('T')[0],
        salary: 0,
        status: EmployeeStatus.ACTIVE,
        avatarUrl: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=0ea5e9&color=fff`,
        mustChangePassword: false, 
        sex: 'M', nuti: '', careerCategory: 'Administração', 
        careerLevel: 'A', careerStep: 3, // Defaults
        academicLevel: 'Licenciatura', contractType: 'Efectivo', birthDate: '', isLeadership: true, leadershipRole: 'Admin', phone: '', documents: {},
        fatherName: '', motherName: ''
    };

    this.data.employees.push(newAdmin);
    return newAdmin;
  }

  generateCredentials(employeeId: string, customPassword?: string): boolean {
    const emp = this.data.employees.find(e => e.id === employeeId);
    if (!emp) return false;

    const passwordToSet = customPassword || Math.random().toString(36).slice(-8);
    
    emp.password = passwordToSet;
    emp.mustChangePassword = true; 
    
    this.sendEmail(
      emp.email, 
      'Credenciais de Acesso - NexusHR', 
      `Olá ${emp.firstName}, suas credenciais foram configuradas.\n\nLogin: ${emp.email}\nSenha Provisória: ${passwordToSet}\n\nPara sua segurança, você será solicitado a alterar esta senha no primeiro acesso.`
    );
    return true;
  }

  changePassword(employeeId: string, newPassword: string): boolean {
    const emp = this.data.employees.find(e => e.id === employeeId);
    if (!emp) return false;

    emp.password = newPassword;
    emp.mustChangePassword = false;
    return true;
  }

  // --- EMPLOYEE CRUD ---
  addEmployee(employee: Employee) {
    const generatedPassword = Math.random().toString(36).slice(-8);
    
    employee.password = generatedPassword;
    employee.mustChangePassword = true; 

    // Defaults para novos funcionários
    if(!employee.careerLevel) employee.careerLevel = 'E';
    if(!employee.careerStep) employee.careerStep = 1;

    this.data.employees.push(employee);
    
    this.data.evolutionHistory.push({
        id: `ev-init-${Date.now()}`,
        employeeId: employee.id,
        type: EvolutionType.ADMISSAO,
        date: employee.joinDate,
        origin: 'Recrutamento',
        destination: employee.role,
        description: 'Admissão inicial no sistema.',
        isActive: true
    });

    this.sendEmail(
      employee.email, 
      'Bem-vindo ao NexusHR - Suas Credenciais', 
      `Prezado(a) ${employee.firstName},\n\nSeu cadastro foi realizado com sucesso.\n\nSuas credenciais de acesso são:\nLogin: ${employee.email}\nSenha Provisória: ${generatedPassword}\n\nPor favor, acesse o sistema e altere sua senha imediatamente.`
    );
  }

  updateEmployee(updatedEmployee: Employee) {
    const index = this.data.employees.findIndex(e => e.id === updatedEmployee.id);
    if (index !== -1) {
      const existing = this.data.employees[index];
      this.data.employees[index] = {
        ...updatedEmployee,
        password: updatedEmployee.password || existing.password,
        mustChangePassword: existing.mustChangePassword
      };
    }
  }

  deleteEmployee(id: string) {
    this.data.employees = this.data.employees.filter(e => e.id !== id);
  }

  // --- DEPARTMENT CRUD ---
  addDepartment(department: Department) {
    this.data.departments.push(department);
  }

  updateDepartment(updatedDept: Department) {
    const index = this.data.departments.findIndex(d => d.id === updatedDept.id);
    if (index !== -1) {
      this.data.departments[index] = updatedDept;
    }
  }

  deleteDepartment(id: string) {
    this.data.departments = this.data.departments.filter(d => d.id !== id);
  }

  // --- REQUEST CRUD ---
  addRequest(request: LeaveRequest) {
    this.data.leaveRequests.push(request);
  }

  updateRequest(updatedRequest: LeaveRequest) {
    const index = this.data.leaveRequests.findIndex(r => r.id === updatedRequest.id);
    if (index !== -1) {
      this.data.leaveRequests[index] = updatedRequest;
    }
  }

  deleteRequest(id: string) {
    this.data.leaveRequests = this.data.leaveRequests.filter(r => r.id !== id);
  }

  updateRequestStatus(id: string, status: RequestStatus) {
    const req = this.data.leaveRequests.find(r => r.id === id);
    if (req) req.status = status;
  }

  // --- PLAN CRUD ---
  addVacationPlan(plan: VacationPlan) {
    this.data.vacationPlans.push(plan);
  }

  updateVacationPlan(updatedPlan: VacationPlan) {
    const index = this.data.vacationPlans.findIndex(p => p.id === updatedPlan.id);
    if (index !== -1) {
      this.data.vacationPlans[index] = updatedPlan;
    }
  }

  deleteVacationPlan(id: string) {
    this.data.vacationPlans = this.data.vacationPlans.filter(p => p.id !== id);
  }

  // --- LOGIC FOR NOTIFICATIONS ---
  public checkAutomatedNotifications() {
    const today = new Date();
    const currentMonth = today.getMonth(); 
    
    this.data.employees.forEach(emp => {
      if (!emp.birthDate) return;
      const birthDate = new Date(emp.birthDate);
      const birthMonth = birthDate.getMonth();
      const monthBeforeBirth = birthMonth === 0 ? 11 : birthMonth - 1;

      if (currentMonth === monthBeforeBirth) {
        const notifId = `pol-${emp.id}-${today.getFullYear()}`;
        if (!this.data.notifications.find(n => n.id === notifId)) {
          const msg = `Lembrete: O funcionário ${emp.firstName} ${emp.lastName} faz anos no próximo mês. Necessário efetuar a Prova de Vida.`;
          this.data.notifications.push({
            id: notifId,
            type: 'ALERT',
            title: 'Prova de Vida Pendente',
            message: msg,
            date: today.toISOString(),
            read: false,
            recipientEmail: emp.email
          });
          this.sendEmail(emp.email, 'Aviso de Prova de Vida', `Olá ${emp.firstName}, seu aniversário está próximo. Por favor, efetue a sua Prova de Vida no próximo mês.`);
        }
      }
    });

    this.data.vacationPlans.forEach(plan => {
      if (plan.status === 'Planeado') {
        const startDate = new Date(plan.plannedStartDate);
        const timeDiff = startDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff >= 25 && daysDiff <= 35) {
          const emp = this.data.employees.find(e => e.id === plan.employeeId);
          if (emp) {
            const notifId = `vac-${plan.id}`;
            if (!this.data.notifications.find(n => n.id === notifId)) {
              const msg = `Lembrete: Plano de férias de ${emp.firstName} inicia em 30 dias. Favor submeter o pedido formal.`;
              this.data.notifications.push({
                id: notifId,
                type: 'REMINDER',
                title: 'Formalização de Férias',
                message: msg,
                date: today.toISOString(),
                read: false,
                recipientEmail: emp.email
              });
              this.sendEmail(emp.email, 'Lembrete de Férias', `Olá ${emp.firstName}, suas férias planeadas estão próximas. Por favor, submeta o pedido oficial no sistema.`);
            }
          }
        }
      }
    });
  }

  public sendCustomEmail(to: string, subject: string, body: string): boolean {
    this.sendEmail(to, subject, body);
    return true;
  }

  private initializeNotifications() {
    this.checkAutomatedNotifications();
  }

  private sendEmail(to: string, subject: string, body: string) {
    console.log(`\n--- [MOCK EMAIL SERVICE] ---\nTo: ${to}\nSubject: ${subject}\nBody:\n${body}\n----------------------------\n`);
  }
}

export const mockService = new MockDataService();