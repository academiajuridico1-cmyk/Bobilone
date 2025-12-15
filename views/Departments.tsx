import React, { useState } from 'react';
import { AppData, Department } from '../types';
import { Building2, Users, Wallet, Plus, X, Save, Search, Pencil, Trash2 } from 'lucide-react';

interface DepartmentsProps {
  data: AppData;
  onAddDepartment: (d: Department) => void;
  onUpdateDepartment: (d: Department) => void;
  onDeleteDepartment: (id: string) => void;
}

const Departments: React.FC<DepartmentsProps> = ({ data, onAddDepartment, onUpdateDepartment, onDeleteDepartment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const filteredDepartments = data.departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingId(dept.id);
    setFormData({
        name: dept.name,
        description: dept.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja apagar o departamento ${name}?`)) {
        onDeleteDepartment(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
        // Update
        const updatedDept: Department = {
            id: editingId,
            name: formData.name,
            description: formData.description
        };
        onUpdateDepartment(updatedDept);
    } else {
        // Create
        const newDept: Department = {
            id: `d${Date.now()}`,
            name: formData.name,
            description: formData.description
        };
        onAddDepartment(newDept);
    }

    setIsModalOpen(false);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Departamentos</h2>
          <p className="text-slate-500">Estrutura organizacional.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          <span>Novo Departamento</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar departamento por nome ou descrição..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDepartments.map(dept => {
          const deptEmployees = data.employees.filter(e => e.departmentId === dept.id);
          const headCount = deptEmployees.length;
          const totalSalaries = deptEmployees.reduce((acc, curr) => acc + curr.salary, 0);

          return (
            <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center relative">
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-brand-600 shadow-sm">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{dept.name}</h3>
                    <p className="text-xs text-slate-500">{dept.description}</p>
                  </div>
                </div>

                {/* Edit/Delete Actions */}
                <div className="flex gap-2">
                    <button 
                        onClick={() => openEditModal(dept)}
                        className="text-slate-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded" title="Editar">
                        <Pencil size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(dept.id, dept.name)}
                        className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded" title="Apagar">
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-slate-600">
                      <Wallet size={18} />
                      <span className="text-sm font-medium">Folha Salarial Mensal</span>
                   </div>
                   <span className="font-bold text-slate-800">R$ {totalSalaries.toLocaleString('pt-BR')}</span>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase">Equipe</h4>
                    <span className="text-xs font-bold text-slate-700">{headCount} Membros</span>
                  </div>
                  <div className="flex -space-x-2">
                    {deptEmployees.slice(0, 5).map(emp => (
                      <img 
                        key={emp.id}
                        className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-100" 
                        src={emp.avatarUrl} 
                        alt={emp.firstName}
                        title={`${emp.firstName} ${emp.lastName}`}
                      />
                    ))}
                    {headCount > 5 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-medium">
                        +{headCount - 5}
                      </div>
                    )}
                    {headCount === 0 && <span className="text-sm text-slate-400 italic">Nenhum funcionário</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW/EDIT DEPARTMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                 <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Editar Departamento' : 'Adicionar Departamento'}</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500">
                   <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Departamento</label>
                   <input 
                     required
                     className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500" 
                     placeholder="Ex: Tecnologia da Informação"
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                   <textarea 
                     className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500" 
                     rows={3}
                     placeholder="Breve descrição das responsabilidades..."
                     value={formData.description}
                     onChange={e => setFormData({...formData, description: e.target.value})}
                   ></textarea>
                 </div>

                 <div className="flex justify-end gap-3 pt-4">
                   <button 
                     type="button" 
                     onClick={() => setIsModalOpen(false)}
                     className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                   >
                     Cancelar
                   </button>
                   <button 
                     type="submit" 
                     className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                   >
                     <Save size={18} />
                     {editingId ? 'Salvar Alterações' : 'Salvar'}
                   </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Departments;