
import React from 'react';
import { AppData, RequestStatus, ViewState } from '../types';
import { Users, Briefcase, CalendarClock, TrendingUp, AlertCircle, CheckCircle2, TrendingUp as TrendingUpIcon, Award, ArrowUpCircle, Crown, Repeat } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface DashboardProps {
  data: AppData;
  changeView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, changeView }) => {
  const totalEmployees = data.employees.length;
  const totalDepartments = data.departments.length;
  const pendingRequests = data.leaveRequests.filter(r => r.status === RequestStatus.PENDING).length;
  
  // Salary Calc
  const totalPayroll = data.employees.reduce((acc, curr) => acc + curr.salary, 0);
  
  // Data for Charts
  const deptData = data.departments.map(dept => ({
    name: dept.name,
    value: data.employees.filter(e => e.departmentId === dept.id).length
  }));

  const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'];

  const StatCard = ({ title, value, subtext, icon: Icon, color, onClick }: any) => (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
          <p className="text-xs text-slate-400 mt-1">{subtext}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Painel de Controle</h2>
        <p className="text-slate-500">Bem-vindo de volta, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Funcionários" 
          value={totalEmployees} 
          subtext="+2 este mês"
          icon={Users} 
          color="bg-blue-500 text-blue-500"
          onClick={() => changeView(ViewState.EMPLOYEES)}
        />
        <StatCard 
          title="Departamentos" 
          value={totalDepartments} 
          subtext="Operacionais"
          icon={Briefcase} 
          color="bg-indigo-500 text-indigo-500"
          onClick={() => changeView(ViewState.DEPARTMENTS)}
        />
        <StatCard 
          title="Pedidos Pendentes" 
          value={pendingRequests} 
          subtext="Aguardando aprovação"
          icon={CalendarClock} 
          color="bg-amber-500 text-amber-500"
          onClick={() => changeView(ViewState.VACATIONS)}
        />
        <StatCard 
          title="Folha Mensal" 
          value={`R$ ${totalPayroll.toLocaleString('pt-BR')}`} 
          subtext="Estimado"
          icon={TrendingUp} 
          color="bg-emerald-500 text-emerald-500"
        />
      </div>

      {/* Evolution Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
         <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
           <TrendingUpIcon size={20} className="text-brand-600"/>
           Evolução na Carreira
         </h3>
         <p className="text-sm text-slate-500 mb-6">Acesse os relatórios detalhados sobre o desenvolvimento e movimentação dos funcionários.</p>
         
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
             <button 
                onClick={() => changeView(ViewState.EVOLUTION)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-brand-300 hover:bg-brand-50 transition-all group gap-2"
             >
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                   <Briefcase size={20} />
                </div>
                <span className="text-sm font-semibold text-slate-700">Carreira</span>
             </button>

             <button 
                onClick={() => changeView(ViewState.EVOLUTION)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50 transition-all group gap-2"
             >
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full group-hover:scale-110 transition-transform">
                   <Award size={20} />
                </div>
                <span className="text-sm font-semibold text-slate-700">Promoções</span>
             </button>

             <button 
                onClick={() => changeView(ViewState.EVOLUTION)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all group gap-2"
             >
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                   <ArrowUpCircle size={20} />
                </div>
                <span className="text-sm font-semibold text-slate-700">Progressões</span>
             </button>

             <button 
                onClick={() => changeView(ViewState.EVOLUTION)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50 transition-all group gap-2"
             >
                <div className="p-3 bg-amber-100 text-amber-600 rounded-full group-hover:scale-110 transition-transform">
                   <Crown size={20} />
                </div>
                <span className="text-sm font-semibold text-slate-700 text-center">Chefia e Direção</span>
             </button>

             <button 
                onClick={() => changeView(ViewState.EVOLUTION)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-rose-300 hover:bg-rose-50 transition-all group gap-2"
             >
                <div className="p-3 bg-rose-100 text-rose-600 rounded-full group-hover:scale-110 transition-transform">
                   <Repeat size={20} />
                </div>
                <span className="text-sm font-semibold text-slate-700 text-center">Mobilidade Interna</span>
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity / Requests */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">Solicitações Recentes</h3>
            <button 
              onClick={() => changeView(ViewState.VACATIONS)}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {data.leaveRequests.slice(0, 4).map(req => {
              const emp = data.employees.find(e => e.id === req.employeeId);
              return (
                <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                       <img src={emp?.avatarUrl} alt={emp?.firstName} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{emp?.firstName} {emp?.lastName}</p>
                      <p className="text-xs text-slate-500">{req.type} • {new Date(req.startDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium 
                    ${req.status === RequestStatus.APPROVED ? 'bg-green-100 text-green-700' : 
                      req.status === RequestStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {req.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Headcount Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-4">Distribuição por Setor</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
