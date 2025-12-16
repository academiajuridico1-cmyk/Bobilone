
import { AppData, Department, Employee, EmployeeStatus, LeaveRequest, LeaveType, RequestStatus, VacationPlan, Notification, AccessLevel } from '../types';

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
      sex: 'F', nuti: '123456789', careerCategory: 'Técnico Superior', academicLevel: 'Licenciatura', contractType: 'Efectivo', birthDate: '1990-05-20', isLeadership: false, phone: '841234567', documents: {},
      accessLevel: AccessLevel.ADMIN, password: 'admin', mustChangePassword: false 
    },
    { 
      id: 'e2', firstName: 'Carlos', lastName: 'Mendes', email: 'gestor@nexushr.com', role: 'Gerente de Vendas', departmentId: 'd3', joinDate: '2021-06-01', salary: 15000, status: EmployeeStatus.ACTIVE, avatarUrl: 'https://picsum.photos/100/100?random=2',
      sex: 'M', nuti: '987654321', careerCategory: 'Gestão', academicLevel: 'Mestrado', contractType: 'Efectivo', birthDate: '1985-08-10', isLeadership: true, leadershipRole: 'Director Comercial', phone: '829876543', documents: {},
      accessLevel: AccessLevel.MANAGER, password: '123', mustChangePassword: false
    },
    { 
      id: 'e3', firstName: 'Beatriz', lastName: 'Costa', email: 'bia.costa@nexushr.com', role: 'Analista de RH', departmentId: 'd2', joinDate: '2023-01-10', salary: 5000, status: EmployeeStatus.ON_LEAVE, avatarUrl: 'https://picsum.photos/100/100?random=3',
      sex: 'F', nuti: '456123789', careerCategory: 'Técnico', academicLevel: 'Licenciatura', contractType: 'Contratado', birthDate: '1995-12-05', isLeadership: false, phone: '845556667', documents: {},
      accessLevel: AccessLevel.EMPLOYEE, password: '123', mustChangePassword: false
    },
    { 
      id: 'e4', firstName: 'João', lastName: 'Pereira', email: 'joao.p@nexushr.com', role: 'Designer', departmentId: 'd4', joinDate: '2022-11-20', salary: 7000, status: EmployeeStatus.ACTIVE, avatarUrl: 'https://picsum.photos/100/100?random=4',
      sex: 'M', nuti: '789123456', careerCategory: 'Técnico Especialista', academicLevel: 'Bacharelato', contractType: 'Contratado', birthDate: '1992-03-15', isLeadership: false, phone: '861112223', documents: {},
      accessLevel: AccessLevel.EMPLOYEE, password: '123', mustChangePassword: false
    },
    { 
      id: 'e5', firstName: 'Mariana', lastName: 'Lopes', email: 'mari.lopes@nexushr.com', role: 'DevOps', departmentId: 'd1', joinDate: '2023-05-15', salary: 11000, status: EmployeeStatus.ACTIVE, avatarUrl: 'https://picsum.photos/100/100?random=5',
      sex: 'F', nuti: '321654987', careerCategory: 'Técnico Superior', academicLevel: 'Licenciatura', contractType: 'Mobilidade', birthDate: '1993-07-22', isLeadership: false, phone: '859998887', documents: {},
      accessLevel: AccessLevel.EMPLOYEE, password: '123', mustChangePassword: false
    },
  ],
  leaveRequests: [
    { id: 'r1', employeeId: 'e3', type: LeaveType.VACATION, startDate: '2023-11-01', endDate: '2023-11-15', reason: 'Viagem anual', status: RequestStatus.APPROVED, requestDate: '2023-10-01' },
    { id: 'r2', employeeId: 'e1', type: LeaveType.SICK, startDate: '2023-10-25', endDate: '2023-10-26', reason: 'Gripe', status: RequestStatus.APPROVED, requestDate: '2023-10-25' },
    { id: 'r3', employeeId: 'e4', type: LeaveType.VACATION, startDate: '2023-12-20', endDate: '2024-01-05', reason: 'Festas de fim de ano', status: RequestStatus.PENDING, requestDate: '2023-10-28' },
    { id: 'r4', employeeId: 'e5', type: LeaveType.OTHER, startDate: '2023-11-10', endDate: '2023-11-10', reason: 'Mudança de casa', status: RequestStatus.PENDING, requestDate: '2023-10-29' },
  ],
  vacationPlans: [],
  notifications: []
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

  // --- AUTHENTICATION ---
  authenticate(email: string, password: string): Employee | null {
    const user = this.data.employees.find(e => e.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  registerAdmin(firstName: string, lastName: string, email: string, password: string): Employee | null {
    // Check if email already exists
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
        departmentId: '', // Can be assigned later
        joinDate: new Date().toISOString(),
        salary: 0,
        status: EmployeeStatus.ACTIVE,
        avatarUrl: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=0ea5e9&color=fff`,
        mustChangePassword: false, // Password set during registration is considered secure enough for demo, or set true to force change
        // Defaults
        sex: 'M', nuti: '', careerCategory: 'Administração', academicLevel: '', contractType: 'Efectivo', birthDate: '', isLeadership: true, leadershipRole: 'Admin', phone: '', documents: {}
    };

    this.data.employees.push(newAdmin);
    return newAdmin;
  }

  generateCredentials(employeeId: string, customPassword?: string): boolean {
    const emp = this.data.employees.find(e => e.id === employeeId);
    if (!emp) return false;

    // Use custom password if provided, otherwise generate random
    const passwordToSet = customPassword || Math.random().toString(36).slice(-8);
    
    emp.password = passwordToSet;
    emp.mustChangePassword = true; // Force change on next login
    
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
    // Generate 8-digit random password for new employees
    const generatedPassword = Math.random().toString(36).slice(-8);
    
    // Set Auth fields
    employee.password = generatedPassword;
    employee.mustChangePassword = true; // Force change on first login

    this.data.employees.push(employee);
    
    // Automatically send credentials email
    this.sendEmail(
      employee.email, 
      'Bem-vindo ao NexusHR - Suas Credenciais', 
      `Prezado(a) ${employee.firstName},\n\nSeu cadastro foi realizado com sucesso.\n\nSuas credenciais de acesso são:\nLogin: ${employee.email}\nSenha Provisória: ${generatedPassword}\n\nPor favor, acesse o sistema e altere sua senha imediatamente.`
    );
  }

  updateEmployee(updatedEmployee: Employee) {
    const index = this.data.employees.findIndex(e => e.id === updatedEmployee.id);
    if (index !== -1) {
      // Preserve password/auth fields if not provided in update
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
    const currentMonth = today.getMonth(); // 0-11
    
    // 1. Proof of Life (Prova de Vida)
    this.data.employees.forEach(emp => {
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

    // 2. Vacation Plan Reminder
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
              const msg = `Lembrete: Plano de férias de ${emp.firstName} inicia em 30 dias (${new Date(plan.plannedStartDate).toLocaleDateString()}). Favor submeter o pedido formal.`;
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
    // In a real app, this would use an email service
    console.log(`\n--- [MOCK EMAIL SERVICE] ---\nTo: ${to}\nSubject: ${subject}\nBody:\n${body}\n----------------------------\n`);
  }
}

export const mockService = new MockDataService();
