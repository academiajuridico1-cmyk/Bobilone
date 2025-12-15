import React, { useState } from 'react';
import { AppData, RequestStatus, LeaveType, LeaveRequest, VacationPlan, Employee, AccessLevel } from '../types';
import { CheckCircle, XCircle, Clock, Plus, X, FileText, Calendar, AlertCircle, Search, Plane, Pencil, Trash2, Lock } from 'lucide-react';

interface VacationsProps {
  data: AppData;
  currentUser: Employee;
  onUpdateStatus: (id: string, status: RequestStatus) => void;
  onAddRequest: (req: LeaveRequest) => void;
  onUpdateRequest: (req: LeaveRequest) => void;
  onDeleteRequest: (id: string) => void;
  onAddPlan: (plan: VacationPlan) => void;
  onUpdatePlan: (plan: VacationPlan) => void;
  onDeletePlan: (id: string) => void;
}

const Vacations: React.FC<VacationsProps> = ({ 
    data, currentUser, onUpdateStatus, onAddRequest, onUpdateRequest, onDeleteRequest, 
    onAddPlan, onUpdatePlan, onDeletePlan 
}) => {
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'PLANS'>('REQUESTS');
  const [searchTerm, setSearchTerm] = useState('');
  
  const isPrivileged = currentUser.accessLevel === AccessLevel.ADMIN || currentUser.accessLevel === AccessLevel.MANAGER;

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  
  // State for Editing
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  
  // Request Form
  const [requestType, setRequestType] = useState<LeaveType>(LeaveType.VACATION);
  const [requestForm, setRequestForm] = useState({ employeeId: '', startDate: '', endDate: '', reason: '' });
  
  // Plan Form
  const [planForm, setPlanForm] = useState({ employeeId: '', startDate: '', endDate: '' });

  const getEmployee = (id: string) => data.employees.find(e => e.id === id);

  // Filter Logic: If standard user, only show their own requests
  const filteredRequests = data.leaveRequests.filter(r => {
    if (!isPrivileged && r.employeeId !== currentUser.id) return false;

    const emp = getEmployee(r.employeeId);
    const text = `${emp?.firstName} ${emp?.lastName} ${r.type}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const pendingRequests = filteredRequests.filter(r => r.status === RequestStatus.PENDING);
  const historyRequests = filteredRequests.filter(r => r.status !== RequestStatus.PENDING);
  
  const filteredPlans = data.vacationPlans.filter(p => {
    if (!isPrivileged && p.employeeId !== currentUser.id) return false;

    const emp = getEmployee(p.employeeId);
    return `${emp?.firstName} ${emp?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- Handlers for Requests ---

  const openAddRequestModal = () => {
    setEditingRequestId(null);
    // If regular user, force their ID
    const initialEmpId = isPrivileged ? '' : currentUser.id;
    setRequestForm({ employeeId: initialEmpId, startDate: '', endDate: '', reason: '' });
    setIsRequestModalOpen(true);
  };

  const openEditRequestModal = (req: LeaveRequest) => {
    setEditingRequestId(req.id);
    setRequestType(req.type);
    setRequestForm({
        employeeId: req.employeeId,
        startDate: req.startDate,
        endDate: req.endDate,
        reason: req.reason
    });
    setIsRequestModalOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    if(window.confirm('Tem certeza que deseja remover esta solicitação?')) {
        onDeleteRequest(id);
    }
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.employeeId || !requestForm.startDate || !requestForm.endDate) return;

    if (editingRequestId) {
        // Update
        const updatedRequest: LeaveRequest = {
            id: editingRequestId,
            requestDate: new Date().toISOString(),
            status: RequestStatus.PENDING,
            type: requestType,
            employeeId: requestForm.employeeId,
            startDate: requestForm.startDate,
            endDate: requestForm.endDate,
            reason: requestForm.reason
        };
        onUpdateRequest(updatedRequest);
    } else {
        // Create
        const newRequest: LeaveRequest = {
            id: `r${Date.now()}`,
            requestDate: new Date().toISOString(),
            status: RequestStatus.PENDING,
            type: requestType,
            employeeId: requestForm.employeeId,
            startDate: requestForm.startDate,
            endDate: requestForm.endDate,
            reason: requestForm.reason
        };
        onAddRequest(newRequest);
    }

    setIsRequestModalOpen(false);
  };

  // --- Handlers for Plans ---

  const openAddPlanModal = () => {
    setEditingPlanId(null);
    const initialEmpId = isPrivileged ? '' : currentUser.id;
    setPlanForm({ employeeId: initialEmpId, startDate: '', endDate: '' });
    setIsPlanModalOpen(true);
  };

  const openEditPlanModal = (plan: VacationPlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
        employeeId: plan.employeeId,
        startDate: plan.plannedStartDate,
        endDate: plan.plannedEndDate
    });
    setIsPlanModalOpen(true);
  };

  const handleDeletePlan = (id: string) => {
    if(window.confirm('Tem certeza que deseja remover este plano?')) {
        onDeletePlan(id);
    }
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.employeeId || !planForm.startDate || !planForm.endDate) return;

    if (editingPlanId) {
        // Update
        const updatedPlan: VacationPlan = {
            id: editingPlanId,
            employeeId: planForm.employeeId,
            plannedStartDate: planForm.startDate,
            plannedEndDate: planForm.endDate,
            status: 'Planeado',
            createdAt: new Date().toISOString()
        };
        onUpdatePlan(updatedPlan);
    } else {
        // Create
        const newPlan: VacationPlan = {
            id: `p${Date.now()}`,
            employeeId: planForm.employeeId,
            plannedStartDate: planForm.startDate,
            plannedEndDate: planForm.endDate,
            status: 'Planeado',
            createdAt: new Date().toISOString()
        };
        onAddPlan(newPlan);
        alert("Plano de férias adicionado! O sistema enviará notificações 1 mês antes da data.");
    }

    setIsPlanModalOpen(false);
  };

  const getDaysDiff = (startStr: string, endStr: string) => {
    if(!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const formTitles = {
    [LeaveType.VACATION]: 'Novo Pedido de Férias',
    [LeaveType.SHORT_LEAVE]: 'Solicitação de Dispensa',
    [LeaveType.OTHER]: 'Outros Pedidos',
    [LeaveType.SICK]: 'Licença Médica'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Férias e Solicitações</h2>
          <p className="text-slate-500">Gestão de ausências e planeamento anual.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={openAddPlanModal}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
                <Plane size={18} />
                <span>Planear Férias</span>
            </button>
            <button 
                onClick={openAddRequestModal}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
                <Plus size={18} />
                <span>Nova Solicitação</span>
            </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
         <div className="flex p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('REQUESTS')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'REQUESTS' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Solicitações
            </button>
            <button 
              onClick={() => setActiveTab('PLANS')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'PLANS' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Plano de Férias
            </button>
         </div>
         <div className="relative w-full sm:w-64 mb-1 sm:mb-0 sm:mr-2">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="Pesquisar..." 
               className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
         </div>
      </div>

      {/* CONTENT: REQUESTS TAB */}
      {activeTab === 'REQUESTS' && (
        <>
            {/* Pending Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-amber-50/50 flex items-center gap-2">
                <Clock className="text-amber-500" size={20} />
                <h3 className="font-semibold text-slate-800">Pendentes de Aprovação ({pendingRequests.length})</h3>
                </div>
                
                {pendingRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    Nenhuma solicitação pendente no momento.
                </div>
                ) : (
                <div className="divide-y divide-slate-100">
                    {pendingRequests.map(req => {
                    const emp = getEmployee(req.employeeId);
                    const days = getDaysDiff(req.startDate, req.endDate);

                    return (
                        <div key={req.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start gap-4">
                            <img src={emp?.avatarUrl} alt="" className="w-12 h-12 rounded-full bg-slate-200 object-cover" />
                            <div>
                            <h4 className="font-bold text-slate-800">{emp?.firstName} {emp?.lastName}</h4>
                            <p className="text-sm text-slate-500">{emp?.role}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium border
                                ${req.type === LeaveType.VACATION ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                    req.type === LeaveType.SHORT_LEAVE ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                    'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                {req.type}
                                </span>
                                <span className="text-xs text-slate-400">
                                {new Date(req.startDate).toLocaleDateString('pt-BR')} até {new Date(req.endDate).toLocaleDateString('pt-BR')} ({days} dias)
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded italic">
                                "{req.reason}"
                            </p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                            {/* CRUD Buttons */}
                            <div className="flex gap-1 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditRequestModal(req)} className="p-1 text-slate-400 hover:text-blue-600 bg-white rounded shadow-sm border border-slate-200"><Pencil size={14}/></button>
                                <button onClick={() => handleDeleteRequest(req.id)} className="p-1 text-slate-400 hover:text-red-600 bg-white rounded shadow-sm border border-slate-200"><Trash2 size={14}/></button>
                            </div>

                            {/* Only Admins/Managers can approve */}
                            {isPrivileged && (
                                <div className="flex gap-2">
                                    <button 
                                    onClick={() => onUpdateStatus(req.id, RequestStatus.REJECTED)}
                                    className="px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    >
                                    <XCircle size={18} /> Rejeitar
                                    </button>
                                    <button 
                                    onClick={() => onUpdateStatus(req.id, RequestStatus.APPROVED)}
                                    className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 transition-colors shadow-sm"
                                    >
                                    <CheckCircle size={18} /> Aprovar
                                    </button>
                                </div>
                            )}
                            {!isPrivileged && (
                                <div className="text-sm text-slate-400 flex items-center gap-1">
                                    <Clock size={14}/> Aguardando Aprovação
                                </div>
                            )}
                        </div>
                        </div>
                    );
                    })}
                </div>
                )}
            </div>

            {/* History Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Histórico Recente</h3>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3 font-medium">Funcionário</th>
                        <th className="px-6 py-3 font-medium">Tipo</th>
                        <th className="px-6 py-3 font-medium">Período</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Ações</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {historyRequests.map(req => {
                        const emp = getEmployee(req.employeeId);
                        return (
                        <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <img src={emp?.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                                <span className="font-medium text-slate-700">{emp?.firstName} {emp?.lastName}</span>
                            </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{req.type}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(req.startDate).toLocaleDateString('pt-BR')} - {new Date(req.endDate).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                ${req.status === RequestStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {req.status}
                            </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    {/* Only show edit/delete if pending or user is admin */}
                                    <button onClick={() => openEditRequestModal(req)} className="text-slate-400 hover:text-blue-600"><Pencil size={16}/></button>
                                    <button onClick={() => handleDeleteRequest(req.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
                </div>
            </div>
        </>
      )}

      {/* CONTENT: PLANS TAB */}
      {activeTab === 'PLANS' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                   <h3 className="font-semibold text-slate-800">Planos de Férias Futuros</h3>
                   <p className="text-xs text-slate-500 mt-1">{isPrivileged ? 'Visão Geral (Administrador)' : 'Meus Planos'}</p>
               </div>
               <span className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100 font-medium">
                   {isPrivileged ? 'Controle Total' : 'Pessoal'}
               </span>
            </div>
            {filteredPlans.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                    <Plane size={48} className="mx-auto mb-4 text-slate-200" />
                    <p>Nenhum plano de férias registado.</p>
                    <button onClick={openAddPlanModal} className="text-brand-600 font-medium hover:underline mt-2">Adicionar Plano</button>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {filteredPlans.map(plan => {
                        const emp = getEmployee(plan.employeeId);
                        const days = getDaysDiff(plan.plannedStartDate, plan.plannedEndDate);
                        return (
                            <div key={plan.id} className="p-4 flex items-center justify-between hover:bg-slate-50 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-800">{emp?.firstName} {emp?.lastName}</h4>
                                        <p className="text-xs text-slate-500">
                                            Planeado: {new Date(plan.plannedStartDate).toLocaleDateString('pt-BR')} a {new Date(plan.plannedEndDate).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="block font-bold text-slate-700">{days} Dias</span>
                                        <span className="text-xs text-brand-600 font-medium">{plan.status}</span>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditPlanModal(plan)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded shadow-sm"><Pencil size={16}/></button>
                                        <button onClick={() => handleDeletePlan(plan.id)} className="p-1.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded shadow-sm"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
      )}

      {/* REQUEST MODAL */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
             <div className="flex justify-between items-center p-6 border-b border-slate-100">
                 <h3 className="text-xl font-bold text-slate-800">{editingRequestId ? 'Editar Solicitação' : formTitles[requestType]}</h3>
                 <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-red-500">
                   <X size={24} />
                 </button>
             </div>

             <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => setRequestType(LeaveType.VACATION)}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${requestType === LeaveType.VACATION ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <div className="flex items-center justify-center gap-2"><Calendar size={16} /> Férias</div>
                </button>
                <button 
                  onClick={() => setRequestType(LeaveType.SHORT_LEAVE)}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${requestType === LeaveType.SHORT_LEAVE ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                   <div className="flex items-center justify-center gap-2"><Clock size={16} /> Dispensa</div>
                </button>
                <button 
                  onClick={() => setRequestType(LeaveType.OTHER)}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${requestType === LeaveType.OTHER ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                   <div className="flex items-center justify-center gap-2"><FileText size={16} /> Outros</div>
                </button>
             </div>

             <form onSubmit={handleRequestSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
                {/* Employee Selection (Disabled for standard users) */}
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Funcionário</label>
                   <select 
                     required
                     className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-500"
                     value={requestForm.employeeId}
                     onChange={(e) => setRequestForm({...requestForm, employeeId: e.target.value})}
                     disabled={!!editingRequestId || !isPrivileged} 
                   >
                     {isPrivileged ? (
                         <>
                             <option value="">Selecione um funcionário...</option>
                             {data.employees.map(emp => (
                               <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.role})</option>
                             ))}
                         </>
                     ) : (
                         <option value={currentUser.id}>{currentUser.firstName} {currentUser.lastName}</option>
                     )}
                   </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início</label>
                    <input 
                      type="date" 
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500"
                      value={requestForm.startDate}
                      onChange={(e) => setRequestForm({...requestForm, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Término</label>
                    <input 
                      type="date" 
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500"
                      value={requestForm.endDate}
                      onChange={(e) => setRequestForm({...requestForm, endDate: e.target.value})}
                    />
                  </div>
                </div>

                {/* Calculated Duration Info */}
                {requestForm.startDate && requestForm.endDate && (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                    <AlertCircle size={18} className="text-blue-500 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <span className="font-semibold">Duração:</span> {getDaysDiff(requestForm.startDate, requestForm.endDate)} dias
                      {requestType === LeaveType.SHORT_LEAVE && getDaysDiff(requestForm.startDate, requestForm.endDate) > 3 && (
                        <p className="text-xs text-red-500 mt-1 font-semibold">Atenção: Dispensas geralmente são curtas (1-3 dias).</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">
                     {requestType === LeaveType.VACATION ? 'Observações' : 'Motivo da Solicitação'}
                   </label>
                   <textarea 
                     required
                     className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500"
                     rows={4}
                     placeholder={requestType === LeaveType.VACATION ? "Ex: Férias anuais programadas." : "Descreva o motivo..."}
                     value={requestForm.reason}
                     onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})}
                   ></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                   <button 
                     type="button" 
                     onClick={() => setIsRequestModalOpen(false)}
                     className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                   >
                     Cancelar
                   </button>
                   <button 
                     type="submit" 
                     className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg"
                   >
                     {editingRequestId ? 'Salvar Alterações' : 'Submeter Pedido'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* PLAN MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
             <div className="flex justify-between items-center p-6 border-b border-slate-100">
                 <div>
                    <h3 className="text-xl font-bold text-slate-800">{editingPlanId ? 'Editar Plano de Férias' : 'Definir Plano de Férias'}</h3>
                    <p className="text-sm text-slate-500">Notificações automáticas serão enviadas 1 mês antes.</p>
                 </div>
                 <button onClick={() => setIsPlanModalOpen(false)} className="text-slate-400 hover:text-red-500">
                   <X size={24} />
                 </button>
             </div>
             
             <form onSubmit={handlePlanSubmit} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Funcionário</label>
                   <select 
                     required
                     className="w-full border rounded-lg px-3 py-2 bg-white disabled:bg-slate-50 disabled:text-slate-500"
                     value={planForm.employeeId}
                     onChange={(e) => setPlanForm({...planForm, employeeId: e.target.value})}
                     disabled={!!editingPlanId || !isPrivileged}
                   >
                     {isPrivileged ? (
                        <>
                            <option value="">Selecione...</option>
                            {data.employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                            ))}
                        </>
                     ) : (
                        <option value={currentUser.id}>{currentUser.firstName} {currentUser.lastName}</option>
                     )}
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Início Planeado</label>
                    <input 
                      type="date" 
                      required
                      className="w-full border rounded-lg px-3 py-2"
                      value={planForm.startDate}
                      onChange={(e) => setPlanForm({...planForm, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fim Planeado</label>
                    <input 
                      type="date" 
                      required
                      className="w-full border rounded-lg px-3 py-2"
                      value={planForm.endDate}
                      onChange={(e) => setPlanForm({...planForm, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                   <button type="button" onClick={() => setIsPlanModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                   <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg">{editingPlanId ? 'Salvar Plano' : 'Criar Plano'}</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vacations;