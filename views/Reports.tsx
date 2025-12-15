import React from 'react';
import { AppData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

interface ReportsProps {
  data: AppData;
}

const Reports: React.FC<ReportsProps> = ({ data }) => {
  // Prep Data: Salaries by Dept
  const salaryData = data.departments.map(dept => {
    const total = data.employees
      .filter(e => e.departmentId === dept.id)
      .reduce((acc, curr) => acc + curr.salary, 0);
    return { name: dept.name, salarios: total };
  });

  // Prep Data: Hiring Timeline (Mocked logic for demo)
  const hiringData = [
    { month: 'Jan', hires: 2 },
    { month: 'Fev', hires: 1 },
    { month: 'Mar', hires: 3 },
    { month: 'Abr', hires: 2 },
    { month: 'Mai', hires: 4 },
    { month: 'Jun', hires: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Relatórios Analíticos</h2>
        <p className="text-slate-500">Métricas de performance e recursos humanos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Salary Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-6">Folha Salarial por Departamento</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                />
                <Legend />
                <Bar dataKey="salarios" name="Total Salários" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hiring Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-6">Evolução de Contratações (Semestre)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hiringData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="hires" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      
      <div className="bg-indigo-900 rounded-xl p-8 text-white flex justify-between items-center shadow-lg">
          <div>
            <h3 className="text-xl font-bold mb-2">Precisa de análises mais profundas?</h3>
            <p className="text-indigo-200 max-w-lg">Use o nosso Assistente de IA para cruzar dados, identificar tendências de turnover ou prever necessidades de contratação.</p>
          </div>
          <button className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg">
            Ir para IA
          </button>
      </div>
    </div>
  );
};

export default Reports;