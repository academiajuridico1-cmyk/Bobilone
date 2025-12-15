import React, { useState, useEffect } from 'react';
import { AppData, Employee, EmployeeStatus, AccessLevel } from '../types';
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, X, Upload, Save, User, Calendar, FileText, Pencil, Trash2, KeyRound, Shield, Eye, Send, Lock, RefreshCw, Camera, Download } from 'lucide-react';
import { mockService } from '../services/mockDataService';

interface EmployeesProps {
  data: AppData;
  currentUser: Employee;
  onAddEmployee: (e: Employee) => void;
  onUpdateEmployee: (e: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

const Employees: React.FC<EmployeesProps> = ({ data, currentUser, onAddEmployee, onUpdateEmployee, onDeleteEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', body: '' });

  // Credentials Modal State
  const [isCredModalOpen, setIsCredModalOpen] = useState(false);
  const [credData, setCredData] = useState<{id: string, name: string, email: string, password: string}>({ id: '', name: '', email: '', password: '' });

  const isAdmin = currentUser.accessLevel === AccessLevel.ADMIN;
  const isManager = currentUser.accessLevel === AccessLevel.MANAGER;
  const isPrivileged = isAdmin || isManager;

  // Form State
  const initialFormState: Partial<Employee> = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    departmentId: '',
    sex: 'M',
    nuti: '',
    careerCategory: '',
    academicLevel: '',
    contractType: 'Efectivo',
    birthDate: '',
    isLeadership: false,
    leadershipRole: '',
    phone: '',
    status: EmployeeStatus.ACTIVE,
    accessLevel: AccessLevel.EMPLOYEE,
    salary: 0,
    documents: {},
    avatarUrl: ''
  };

  const [formData, setFormData] = useState<Partial<Employee>>(initialFormState);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  // Filter Employees based on role
  const filteredEmployees = data.employees.filter(emp => {
    // If standard employee, only show themselves
    if (!isPrivileged && emp.id !== currentUser.id) return false;

    const matchesSearch = (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'all' || emp.departmentId === filterDept;
    return matchesSearch && matchesDept;
  });

  const getDeptName = (id: string) => data.departments.find(d => d.id === id)?.name || 'N/A';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'birthDate') {
      const birth = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      setCalculatedAge(age);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatarUrl: imageUrl }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [category]: fileName
        }
      }));
    }
  };

  // Function to simulate document download
  const handleDownloadDocument = (fileName: string) => {
    const element = document.createElement("a");
    const file = new Blob([`Conteúdo simulado do arquivo: ${fileName}\n\nEste é um documento de demonstração do sistema Gestão de RH.\nData do download: ${new Date().toLocaleString()}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName; // Uses the filename provided
    document.body.appendChild(element); // Required for FireFox
    element.click();
    document.body.removeChild(element);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setCalculatedAge(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData({ ...employee });
    
    const birth = new Date(employee.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    setCalculatedAge(age);
    
    setIsModalOpen(true);
  };

  const openEmailModal = (email: string) => {
    setEmailForm({ to: email, subject: '', body: '' });
    setIsEmailModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja apagar o funcionário ${name}?`)) {
        onDeleteEmployee(id);
    }
  };

  const openCredentialsModal = (id: string, name: string, email: string) => {
      setCredData({ id, name, email, password: '' });
      setIsCredModalOpen(true);
  };

  const generateRandomPassword = () => {
      const randomPass = Math.random().toString(36).slice(-8);
      setCredData(prev => ({ ...prev, password: randomPass }));
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
      e.preventDefault();
      if (!credData.password || credData.password.length < 3) {
          alert("A senha deve ter pelo menos 3 caracteres.");
          return;
      }
      
      const sent = mockService.generateCredentials(credData.id, credData.password);
      if(sent) {
          alert(`Credenciais enviadas com sucesso para ${credData.email}.`);
          setIsCredModalOpen(false);
      } else {
          alert("Erro ao configurar credenciais.");
      }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if(!emailForm.to || !emailForm.subject || !emailForm.body) return;
    
    mockService.sendCustomEmail(emailForm.to, emailForm.subject, emailForm.body);
    alert(`Email enviado com sucesso para ${emailForm.to}`);
    setIsEmailModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPrivileged) return; // Prevent submission if not privileged

    if (!formData.firstName || !formData.lastName || !formData.email) return;

    if (editingId) {
        const updatedEmployee: Employee = {
            ...(formData as Employee),
            id: editingId
        };
        onUpdateEmployee(updatedEmployee);
    } else {
        const newEmployee: Employee = {
            id: `e${Date.now()}`,
            joinDate: new Date().toISOString(),
            // Use uploaded avatar if exists, otherwise generate default
            avatarUrl: formData.avatarUrl || `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`,
            ...(formData as Employee)
        };
        onAddEmployee(newEmployee);
    }

    setIsModalOpen(false);
    setFormData(initialFormState);
    setCalculatedAge(null);
  };

  // Determine Modal Title
  const getModalTitle = () => {
    if (!isPrivileged) return 'Ficha do Funcionário (Visualização)';
    return editingId ? 'Editar Funcionário' : 'Novo Cadastro de Funcionário';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{isPrivileged ? 'Funcionários' : 'Meu Perfil'}</h2>
          <p className="text-slate-500">{isPrivileged ? 'Gerencie a equipe e permissões.' : 'Visualize seus dados cadastrais.'}</p>
        </div>
        
        {isPrivileged && (
            <button 
            onClick={openAddModal}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
            <Plus size={18} />
            <span>Novo Funcionário</span>
            </button>
        )}
      </div>

      {/* Filters (Only for Admin/Manager) */}
      {isPrivileged && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome ou cargo..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <select 
                className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="all">Todos Departamentos</option>
                {data.departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow relative group">
            
            {/* Actions */}
            <div className={`absolute top-4 right-4 flex gap-2 transition-opacity ${isPrivileged ? 'opacity-0 group-hover:opacity-100' : ''}`}>
                {isPrivileged && (
                    <button 
                        onClick={() => openEmailModal(employee.email)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Enviar Email">
                        <Mail size={16} />
                    </button>
                )}
                {isAdmin && (
                    <button 
                        onClick={() => openCredentialsModal(employee.id, employee.firstName, employee.email)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Gerenciar Credenciais">
                        <KeyRound size={16} />
                    </button>
                )}
                <button 
                    onClick={() => openEditModal(employee)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title={isPrivileged ? "Editar" : "Visualizar"}>
                    {isPrivileged ? <Pencil size={16} /> : <Eye size={16} />}
                </button>
                {isPrivileged && (
                    <button 
                        onClick={() => handleDelete(employee.id, employee.firstName)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Apagar">
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <img 
                  src={employee.avatarUrl} 
                  alt={employee.firstName} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-slate-800">{employee.firstName} {employee.lastName}</h3>
                  <p className="text-sm text-brand-600 font-medium">{employee.role}</p>
                  <p className="text-xs text-slate-400 mt-1">{getDeptName(employee.departmentId)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{employee.email}</span>
              </div>
              {employee.phone && (
                 <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <span>{employee.phone}</span>
                 </div>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className={`px-2 py-1 rounded text-xs font-semibold
                  ${employee.status === EmployeeStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {employee.status}
                </span>
                {isPrivileged && (
                   <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase font-bold">{employee.accessLevel}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>Nenhum registro encontrado.</p>
        </div>
      )}

      {/* NEW/EDIT EMPLOYEE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Main Modal Container - Width Increased to 7xl, Fixed height 90vh */}
          <div className="bg-white rounded-xl w-full max-w-7xl h-[90vh] shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <div>
                 <h3 className="text-xl font-bold text-slate-800">{getModalTitle()}</h3>
                 <p className="text-sm text-slate-500">
                    {isPrivileged ? 'Preencha os dados e defina permissões.' : 'Confira seus dados cadastrais.'}
                 </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
              
              {/* Avatar Upload Section */}
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                    {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <User size={32} className="text-slate-400" />
                    )}
                     {isPrivileged && (
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <Camera className="text-white" size={24} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                     )}
                 </div>
                 {isPrivileged && (
                     <div>
                        <h4 className="font-medium text-slate-700">Fotografia do Funcionário</h4>
                        <p className="text-xs text-slate-500">Clique na imagem para enviar uma foto.</p>
                     </div>
                 )}
              </div>

              {/* Access Level (Only for Admin) */}
              {isPrivileged && (
                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                    <h4 className="flex items-center gap-2 font-semibold text-amber-800 mb-6 text-lg">
                      <Shield size={20} /> Permissões de Sistema
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">Nível de Acesso</label>
                           <select 
                            name="accessLevel" 
                            className="w-full border rounded-lg px-4 py-2.5 bg-white border-amber-200" 
                            onChange={handleInputChange} 
                            value={formData.accessLevel}
                           >
                             <option value={AccessLevel.EMPLOYEE}>Funcionário (Usuário)</option>
                             <option value={AccessLevel.MANAGER}>Gestor</option>
                             {isAdmin && <option value={AccessLevel.ADMIN}>Administrador</option>}
                           </select>
                           <p className="text-xs text-amber-700 mt-2">
                               {formData.accessLevel === AccessLevel.EMPLOYEE ? "Acesso limitado aos próprios dados e solicitações." : 
                                formData.accessLevel === AccessLevel.MANAGER ? "Autonomia para gerir equipe e aprovar solicitações." : "Controle total do sistema."}
                           </p>
                       </div>
                    </div>
                  </div>
              )}

              {/* Dados Pessoais */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <h4 className="flex items-center gap-2 font-semibold text-brand-700 mb-6 text-lg">
                  <User size={20} /> Dados Pessoais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primeiro Nome</label>
                    <input name="firstName" required className="w-full border rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.firstName} disabled={!isPrivileged} />
                  </div>
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Apelido (Último Nome)</label>
                    <input name="lastName" required className="w-full border rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.lastName} disabled={!isPrivileged} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sexo</label>
                    <select name="sex" className="w-full border rounded-lg px-4 py-2.5 bg-white disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.sex} disabled={!isPrivileged}>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                    <input type="date" name="birthDate" required className="w-full border rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.birthDate} disabled={!isPrivileged} />
                    {calculatedAge !== null && (
                      <span className="text-xs text-brand-600 mt-1 font-medium">Idade calculada: {calculatedAge} anos</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NUTI (NIF)</label>
                    <input name="nuti" required className="w-full border rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.nuti} placeholder="Número Único Tributário" disabled={!isPrivileged} />
                  </div>
                </div>
              </div>

              {/* Dados Profissionais */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <h4 className="flex items-center gap-2 font-semibold text-brand-700 mb-6 text-lg">
                  <FileText size={20} /> Dados Profissionais e Contratuais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
                    <select 
                        name="departmentId" 
                        required 
                        className="w-full border rounded-lg px-4 py-2.5 bg-white disabled:bg-slate-100 disabled:text-slate-500" 
                        onChange={handleInputChange} 
                        value={formData.departmentId}
                        disabled={!isPrivileged} // Users cannot change their own dept
                    >
                      <option value="">Selecione...</option>
                      {data.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Carreira / Categoria</label>
                    <input name="careerCategory" required className="w-full border rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.careerCategory} placeholder="Ex: Técnico Superior" disabled={!isPrivileged} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Função Atual</label>
                    <input name="role" required className="w-full border rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.role} placeholder="Ex: Engenheiro de Software" disabled={!isPrivileged} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nível Acadêmico</label>
                    <input name="academicLevel" required className="w-full border rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.academicLevel} placeholder="Ex: Licenciatura" disabled={!isPrivileged} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Regime Contratual</label>
                    <select name="contractType" className="w-full border rounded-lg px-4 py-2.5 bg-white disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.contractType} disabled={!isPrivileged}>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Contratado">Contratado</option>
                      <option value="Mobilidade">Transferência (Mobilidade)</option>
                      <option value="Destacado">Destacado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Salário Base</label>
                    <input type="number" name="salary" className="w-full border rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.salary} disabled={!isPrivileged} />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <input 
                      type="checkbox" 
                      id="isLeadership" 
                      name="isLeadership" 
                      checked={formData.isLeadership}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                      disabled={!isPrivileged}
                    />
                    <label htmlFor="isLeadership" className="text-base font-medium text-slate-700">Ocupa Cargo de Direção / Chefia?</label>
                  </div>
                  
                  {formData.isLeadership && (
                    <div className="mt-4 animate-fade-in max-w-md">
                       <label className="block text-sm font-medium text-slate-700 mb-1">Designação do Cargo</label>
                       <input name="leadershipRole" required className="w-full border border-brand-300 bg-brand-50 rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.leadershipRole} placeholder="Ex: Director de Recursos Humanos" disabled={!isPrivileged} />
                    </div>
                  )}
                </div>
              </div>

              {/* Contactos */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <h4 className="flex items-center gap-2 font-semibold text-brand-700 mb-6 text-lg">
                  <Phone size={20} /> Contactos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Profissional</label>
                    <input type="email" name="email" required className="w-full border rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.email} disabled={!isPrivileged} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / Móvel</label>
                    <input type="tel" name="phone" className="w-full border rounded-lg px-4 py-2.5 disabled:bg-slate-100 disabled:text-slate-500" onChange={handleInputChange} value={formData.phone} disabled={!isPrivileged} />
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <h4 className="flex items-center gap-2 font-semibold text-brand-700 mb-6 text-lg">
                  <Upload size={20} /> Documentação (Anexos)
                </h4>
                <p className="text-sm text-slate-500 mb-4">{isPrivileged ? 'Visualize os documentos enviados ou anexe novos arquivos.' : 'Visualize os documentos cadastrados.'}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {[
                    { id: 'personal', label: 'Arquivo Pessoal (BI, etc)' },
                    { id: 'academic', label: 'Arquivo Académico' },
                    { id: 'administrative', label: 'Actos Administrativos' },
                    { id: 'performance', label: 'Avaliação de Desempenho' },
                    { id: 'others', label: 'Outros Documentos' },
                  ].map((doc) => (
                    <div key={doc.id} className="relative">
                      <label className="block text-xs font-medium text-slate-700 mb-2">{doc.label}</label>
                      {/* If document exists, show view link (simulated) */}
                      {formData.documents && formData.documents[doc.id as keyof typeof formData.documents] && (
                          <div className="flex items-center gap-2 mb-1">
                               <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 flex-1 flex items-center gap-1">
                                    <span className="truncate max-w-[100px]">{formData.documents[doc.id as keyof typeof formData.documents]}</span>
                                    <span className="font-bold">✓</span>
                               </div>
                               <button 
                                type="button" 
                                onClick={() => handleDownloadDocument(formData.documents![doc.id as keyof typeof formData.documents]!)} 
                                className="p-1 text-slate-500 hover:text-brand-600 bg-white border rounded shadow-sm" 
                                title="Baixar Documento"
                               >
                                    <Download size={14} />
                               </button>
                          </div>
                      )}
                      {isPrivileged && (
                        <input 
                            type="file" 
                            className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                            onChange={(e) => handleFileChange(e, doc.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </form>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-xl shrink-0">
               <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
               >
                 {isPrivileged ? 'Cancelar' : 'Fechar'}
               </button>
               {isPrivileged && (
                   <button 
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 font-medium flex items-center gap-2"
                   >
                     <Save size={18} />
                     {editingId ? 'Salvar Alterações' : 'Submeter Cadastro'}
                   </button>
               )}
            </div>
          </div>
        </div>
      )}

      {/* CREDENTIALS MANAGEMENT MODAL */}
      {isCredModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl flex flex-col">
               <div className="flex justify-between items-center p-6 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <KeyRound size={20} className="text-amber-500" />
                    <h3 className="text-xl font-bold text-slate-800">Credenciais de Acesso</h3>
                  </div>
                  <button onClick={() => setIsCredModalOpen(false)} className="text-slate-400 hover:text-red-500">
                    <X size={24} />
                  </button>
               </div>
               
               <form onSubmit={handleSaveCredentials} className="p-6 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
                      <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Funcionário</p>
                      <p className="text-sm font-bold text-slate-800">{credData.name}</p>
                      <p className="text-xs text-slate-600">{credData.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Definir Senha de Acesso</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                              type="text" 
                              required
                              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                              placeholder="Digite a nova senha..."
                              value={credData.password}
                              onChange={e => setCredData({...credData, password: e.target.value})}
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={generateRandomPassword}
                            className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 border border-slate-200"
                            title="Gerar senha aleatória"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        O usuário será forçado a alterar esta senha no próximo login.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsCredModalOpen(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Send size={18} />
                      Salvar e Enviar
                    </button>
                  </div>
               </form>
            </div>
          </div>
      )}

      {/* EMAIL COMPOSITION MODAL */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
               <div className="flex items-center gap-2">
                 <Mail size={20} className="text-brand-600" />
                 <h3 className="text-xl font-bold text-slate-800">Enviar Email</h3>
               </div>
               <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-red-500">
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Para</label>
                 <input 
                   required
                   readOnly
                   className="w-full border rounded-lg px-3 py-2 bg-slate-50 text-slate-500" 
                   value={emailForm.to}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Assunto</label>
                 <input 
                   required
                   className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500"
                   placeholder="Assunto do email"
                   value={emailForm.subject}
                   onChange={e => setEmailForm({...emailForm, subject: e.target.value})}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem</label>
                 <textarea 
                   required
                   className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500"
                   rows={5}
                   placeholder="Escreva sua mensagem aqui..."
                   value={emailForm.body}
                   onChange={e => setEmailForm({...emailForm, body: e.target.value})}
                 ></textarea>
               </div>

               <div className="flex justify-end gap-3 pt-4">
                 <button 
                   type="button" 
                   onClick={() => setIsEmailModalOpen(false)}
                   className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                 >
                   Cancelar
                 </button>
                 <button 
                   type="submit" 
                   className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                 >
                   <Send size={18} />
                   Enviar
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;