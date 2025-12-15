import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Employees from './views/Employees';
import Departments from './views/Departments';
import Vacations from './views/Vacations';
import Reports from './views/Reports';
import AIAssistant from './views/AIAssistant';
import Login from './views/Login';
import { ViewState, AppData, Employee, RequestStatus, Department, LeaveRequest, VacationPlan } from './types';
import { mockService } from './services/mockDataService';
import { Menu, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [data, setData] = useState<AppData>(mockService.getData());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load data and check notifications on mount
  useEffect(() => {
    mockService.checkAutomatedNotifications();
    refreshData();
  }, []);

  const refreshData = () => {
    setData({ ...mockService.getData() });
  };

  const checkLogin = (email: string, pass: string): Employee | null => {
      return mockService.authenticate(email, pass);
  };

  const handlePasswordChange = (userId: string, newPass: string): boolean => {
      return mockService.changePassword(userId, newPass);
  };

  const handleLoginSuccess = (user: Employee) => {
      setCurrentUser(user);
      setCurrentView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
      setCurrentUser(null);
  };

  // --- Wrappers for Service Calls ---

  // Employee
  const handleAddEmployee = (emp: Employee) => {
    mockService.addEmployee(emp);
    refreshData();
  };
  const handleUpdateEmployee = (emp: Employee) => {
    mockService.updateEmployee(emp);
    refreshData();
  };
  const handleDeleteEmployee = (id: string) => {
    mockService.deleteEmployee(id);
    refreshData();
  };

  // Department
  const handleAddDepartment = (dept: Department) => {
    mockService.addDepartment(dept);
    refreshData();
  };
  const handleUpdateDepartment = (dept: Department) => {
    mockService.updateDepartment(dept);
    refreshData();
  };
  const handleDeleteDepartment = (id: string) => {
    mockService.deleteDepartment(id);
    refreshData();
  };

  // Request
  const handleAddRequest = (req: LeaveRequest) => {
    mockService.addRequest(req);
    refreshData();
  };
  const handleUpdateRequest = (req: LeaveRequest) => {
    mockService.updateRequest(req);
    refreshData();
  };
  const handleDeleteRequest = (id: string) => {
    mockService.deleteRequest(id);
    refreshData();
  };
  const handleUpdateStatus = (id: string, status: RequestStatus) => {
    mockService.updateRequestStatus(id, status);
    refreshData();
  };

  // Plan
  const handleAddPlan = (plan: VacationPlan) => {
    mockService.addVacationPlan(plan);
    refreshData();
  };
  const handleUpdatePlan = (plan: VacationPlan) => {
    mockService.updateVacationPlan(plan);
    refreshData();
  };
  const handleDeletePlan = (id: string) => {
    mockService.deleteVacationPlan(id);
    refreshData();
  };

  const renderView = () => {
    if (!currentUser) return null;

    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard data={data} changeView={setCurrentView} />;
      case ViewState.EMPLOYEES:
        return (
            <Employees 
                data={data} 
                currentUser={currentUser}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
            />
        );
      case ViewState.DEPARTMENTS:
        return (
            <Departments 
                data={data} 
                onAddDepartment={handleAddDepartment}
                onUpdateDepartment={handleUpdateDepartment}
                onDeleteDepartment={handleDeleteDepartment}
            />
        );
      case ViewState.VACATIONS:
        return (
            <Vacations 
                data={data} 
                currentUser={currentUser}
                onUpdateStatus={handleUpdateStatus} 
                onAddRequest={handleAddRequest} 
                onUpdateRequest={handleUpdateRequest}
                onDeleteRequest={handleDeleteRequest}
                onAddPlan={handleAddPlan}
                onUpdatePlan={handleUpdatePlan}
                onDeletePlan={handleDeletePlan}
            />
        );
      case ViewState.REPORTS:
        return <Reports data={data} />;
      case ViewState.AI_ASSISTANT:
        return <AIAssistant data={data} />;
      default:
        return <Dashboard data={data} changeView={setCurrentView} />;
    }
  };

  // If not logged in, show Login Screen
  if (!currentUser) {
      return <Login 
        onLogin={checkLogin} 
        onChangePassword={handlePasswordChange}
        onLoginSuccess={handleLoginSuccess}
      />;
  }

  const unreadCount = data.notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
            currentView={currentView} 
            setView={(v) => { setCurrentView(v); setSidebarOpen(false); }} 
            currentUser={currentUser}
            onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 lg:hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-slate-800">
               <Menu size={24} />
             </button>
             <span className="font-bold text-slate-800">Gestão de RH</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Bell size={20} className="text-slate-600" onClick={() => setShowNotifications(!showNotifications)} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
             </div>
             <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">
                 {currentUser.firstName.charAt(0)}
             </div>
          </div>
        </header>

        {/* Desktop Header / Top Bar */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 px-8 py-4 justify-between items-center relative z-20">
           <div className="text-sm breadcrumbs text-slate-400">
              Gestão de RH <span className="mx-2">/</span> <span className="text-slate-600 font-medium capitalize">{currentView.toLowerCase().replace('_', ' ')}</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={20} className="text-slate-500 hover:text-brand-600 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <h4 className="font-semibold text-slate-800">Notificações</h4>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {data.notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-400">Nenhuma notificação nova.</div>
                      ) : (
                        data.notifications.map(n => (
                          <div key={n.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                            <div className="flex justify-between items-start mb-1">
                               <span className={`text-xs font-bold ${n.type === 'ALERT' ? 'text-red-500' : 'text-blue-500'}`}>{n.type}</span>
                               <span className="text-[10px] text-slate-400">{new Date(n.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-700">{currentUser.firstName} {currentUser.lastName}</p>
                <p className="text-xs text-slate-400 capitalize">{currentUser.accessLevel.toLowerCase()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-200 overflow-hidden">
                 {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover" /> : currentUser.firstName.charAt(0)}
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
           <div className="max-w-7xl mx-auto">
             {renderView()}
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;