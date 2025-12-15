import React from 'react';
import { ViewState, AccessLevel, Employee } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CalendarDays, 
  BarChart3, 
  Bot,
  LogOut,
  UserCircle
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  currentUser: Employee;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentUser, onLogout }) => {
  const isAdminOrManager = currentUser.accessLevel === AccessLevel.ADMIN || currentUser.accessLevel === AccessLevel.MANAGER;

  const menuItems = [
    { 
      id: ViewState.DASHBOARD, 
      label: 'Painel de Controle', 
      icon: LayoutDashboard,
      visible: true 
    },
    { 
      id: ViewState.EMPLOYEES, 
      label: isAdminOrManager ? 'Funcionários' : 'Meu Perfil', 
      icon: Users,
      visible: true
    },
    { 
      id: ViewState.DEPARTMENTS, 
      label: 'Departamentos', 
      icon: Building2,
      visible: isAdminOrManager // Only admins/managers see departments
    },
    { 
      id: ViewState.VACATIONS, 
      label: 'Férias e Pedidos', 
      icon: CalendarDays,
      visible: true
    },
    { 
      id: ViewState.REPORTS, 
      label: 'Relatórios', 
      icon: BarChart3,
      visible: isAdminOrManager // Only admins/managers see reports
    },
    { 
      id: ViewState.AI_ASSISTANT, 
      label: 'Assistente IA', 
      icon: Bot, 
      isSpecial: true,
      visible: true
    },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-xl z-20">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
          <span className="font-bold text-lg">G</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">Gestão de RH</h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.filter(i => i.visible).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                ${item.isSpecial ? 'mt-4 border border-indigo-500/30 bg-indigo-900/20 text-indigo-300 hover:bg-indigo-900/40' : ''}
              `}
            >
              <Icon size={20} className={isActive ? 'text-white' : item.isSpecial ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info Snippet */}
      <div className="p-4 bg-slate-800 mx-3 mb-2 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
             {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover"/> : <UserCircle />}
          </div>
          <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{currentUser.firstName} {currentUser.lastName}</p>
              <p className="text-[10px] text-brand-400 uppercase tracking-wide">{currentUser.accessLevel}</p>
          </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sair do Sistema</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;