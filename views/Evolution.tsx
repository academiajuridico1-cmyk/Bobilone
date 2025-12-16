

import React, { useState } from 'react';
import { AppData, Employee } from '../types';
import { Briefcase, Award, ArrowUpCircle, Crown, Repeat, Search, MapPin, Calendar, Clock, BarChart } from 'lucide-react';

interface EvolutionProps {
  data: AppData;
  currentUser: Employee;
}

const Evolution: React.FC<EvolutionProps> = ({ data, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'CAREER' | 'PROMOTION' | 'PROGRESSION' | 'LEADERSHIP' | 'MOBILITY'>('CAREER');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to filter employees based on search and visibility
  const getFilteredEmployees = () => {
    return data.employees.filter(emp => {
      // If regular employee, only see self (unless implemented otherwise for transparency)
      const isPrivileged = currentUser.accessLevel === 'ADMIN' || currentUser.accessLevel === 'MANAGER';
      if (!isPrivileged && emp.id !== currentUser.id) return false;

      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const role = emp.role.toLowerCase();
      const search = searchTerm.toLowerCase();
      return fullName.includes(search) || role.includes(search);
    });
  };

  const employees = getFilteredEmployees();

  const getDepartmentName = (id: string) => data.departments.find(d => d.id === id)?.name || 'N/A';

  const renderContent = () => {
    switch(activeTab) {
      case 'CAREER':
        return (
          <div className="space-y-4">
             <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-800 mb-4">
               <h4 className="font-bold flex items-center gap-2"><Briefcase size={18}/> Gestão de Carreira</h4>
               <p className="text-sm">Visualize o histórico profissional, tempo de serviço e categoria atual dos funcionários.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employees.map(emp => {
                    const admission = new Date(emp.joinDate);
                    const now = new Date();
                    const years = now.getFullYear() - admission.getFullYear();
                    
                    return (
                      <div key={emp.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4">
                          <img src={emp.avatarUrl} className="w-12 h-12 rounded-full object-cover" alt="" />
                          <div className="flex-1">
                              <h5 className="font-bold text-slate-800">{emp.firstName} {emp.lastName}</h5>
                              <p className="text-xs text-slate-500 mb-2">{emp.role}</p>
                              
                              <div className="flex gap-2 mb-3">
                                  <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded">Nível {emp.careerLevel}</span>
                                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Escalão {emp.careerStep}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                                  <div className="bg-slate-50 p-2 rounded">
                                      <span className="block text-xs text-slate-400">Tempo Serviço</span>
                                      <span className="font-medium text-slate-700">{years} Anos</span>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded">
                                      <span className="block text-xs text-slate-400">Contrato</span>
                                      <span className="font-medium text-slate-700">{emp.contractType}</span>
                                  </div>
                              </div>
                              {emp.previousRole && (
                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                                   <Clock size={14} />
                                   <span>Anteriormente: <strong>{emp.previousRole}</strong></span>
                                </div>
                              )}
                          </div>
                      </div>
                    )
                })}
             </div>
          </div>
        );
      
      case 'PROMOTION':
        return (
          <div className="space-y-4">
             <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg text-purple-800 mb-4">
               <h4 className="font-bold flex items-center gap-2"><Award size={18}/> Promoções (Níveis A-E)</h4>
               <p className="text-sm">Funcionários e seus níveis salariais atuais.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map(emp => (
                    <div key={emp.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Award size={64} />
                        </div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <img src={emp.avatarUrl} className="w-10 h-10 rounded-full" alt=""/>
                            <div>
                                <h5 className="font-bold text-slate-800">{emp.firstName} {emp.lastName}</h5>
                                <p className="text-xs text-slate-500">{emp.role}</p>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-xs uppercase text-slate-400 font-bold">Nível Atual</span>
                            <div className="text-3xl font-black text-purple-600 mt-1 flex items-center justify-center gap-2">
                                <span>{emp.careerLevel}</span>
                                <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 rounded-full">Salário Base</span>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        );

      case 'PROGRESSION':
         return (
            <div className="space-y-4">
                 <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg text-emerald-800 mb-4">
                    <h4 className="font-bold flex items-center gap-2"><ArrowUpCircle size={18}/> Progressões (Escalões 1-3)</h4>
                    <p className="text-sm">Evolução horizontal na carreira.</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map(emp => (
                        <div key={emp.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-4">
                                <img src={emp.avatarUrl} className="w-10 h-10 rounded-full" alt=""/>
                                <div>
                                    <h5 className="font-bold text-slate-800">{emp.firstName} {emp.lastName}</h5>
                                    <p className="text-xs text-slate-500">{emp.role}</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-lg p-3">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Escalão Atual</span>
                                    <span className="text-xl font-bold text-emerald-600">{emp.careerStep} / 3</span>
                                </div>
                                {/* Progress Bar Visualization */}
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(emp.careerStep / 3) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
         );

      case 'LEADERSHIP':
        return (
            <div className="space-y-4">
               <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg text-amber-800 mb-4">
                 <h4 className="font-bold flex items-center gap-2"><Crown size={18}/> Cargos de Direção e Chefia</h4>
                 <p className="text-sm">Funcionários que ocupam posições de liderança e gestão.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employees.filter(e => e.isLeadership).map(emp => (
                      <div key={emp.id} className="bg-white p-5 rounded-xl border-l-4 border-amber-400 shadow-sm flex items-center gap-4">
                          <div className="relative">
                            <img src={emp.avatarUrl} className="w-14 h-14 rounded-full border-2 border-amber-100" alt="" />
                            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white">
                                <Crown size={12} fill="currentColor" />
                            </div>
                          </div>
                          <div>
                              <h5 className="font-bold text-slate-800">{emp.firstName} {emp.lastName}</h5>
                              <p className="text-sm font-medium text-amber-600">{emp.leadershipRole}</p>
                              <p className="text-xs text-slate-500 mt-1">{emp.role} - {getDepartmentName(emp.departmentId)}</p>
                          </div>
                      </div>
                  ))}
               </div>
            </div>
        );

      case 'MOBILITY':
        return (
            <div className="space-y-4">
               <div className="bg-rose-50 border border-rose-100 p-4 rounded-lg text-rose-800 mb-4">
                 <h4 className="font-bold flex items-center gap-2"><Repeat size={18}/> Mobilidade Interna</h4>
                 <p className="text-sm">Funcionários em regime de mobilidade, transferência ou destacamento.</p>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {employees.filter(e => e.contractType === 'Mobilidade' || e.contractType === 'Destacado').length === 0 ? (
                      <p className="text-center text-slate-400 py-10">Nenhum funcionário em regime de mobilidade no momento.</p>
                  ) : (
                      employees.filter(e => e.contractType === 'Mobilidade' || e.contractType === 'Destacado').map(emp => (
                        <div key={emp.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                           <div className="flex items-center gap-4">
                                <img src={emp.avatarUrl} className="w-12 h-12 rounded-full" alt="" />
                                <div>
                                    <h5 className="font-bold text-slate-800">{emp.firstName} {emp.lastName}</h5>
                                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs font-bold">{emp.contractType}</span>
                                </div>
                           </div>
                           <div className="text-right text-sm">
                                <p className="text-slate-500">Departamento Atual</p>
                                <p className="font-medium text-slate-800">{getDepartmentName(emp.departmentId)}</p>
                           </div>
                        </div>
                      ))
                  )}
               </div>
            </div>
        );

      default:
         return null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Evolução na Carreira</h2>
          <p className="text-slate-500">Acompanhamento do desenvolvimento profissional.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-2">
         <button 
           onClick={() => setActiveTab('CAREER')} 
           className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'CAREER' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
         >
            <Briefcase size={16} /> Carreira
         </button>
         <button 
           onClick={() => setActiveTab('PROMOTION')} 
           className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'PROMOTION' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:bg-slate-50'}`}
         >
            <Award size={16} /> Promoções
         </button>
         <button 
           onClick={() => setActiveTab('PROGRESSION')} 
           className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'PROGRESSION' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}
         >
            <ArrowUpCircle size={16} /> Progressões
         </button>
         <button 
           onClick={() => setActiveTab('LEADERSHIP')} 
           className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'LEADERSHIP' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:bg-slate-50'}`}
         >
            <Crown size={16} /> Chefia
         </button>
         <button 
           onClick={() => setActiveTab('MOBILITY')} 
           className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'MOBILITY' ? 'bg-rose-50 text-rose-700' : 'text-slate-500 hover:bg-slate-50'}`}
         >
            <Repeat size={16} /> Mobilidade
         </button>
      </div>

      {/* Search Bar for Employee Filtering */}
      <div className="relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
         <input 
            type="text" 
            placeholder="Buscar funcionário..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {renderContent()}

    </div>
  );
};

export default Evolution;