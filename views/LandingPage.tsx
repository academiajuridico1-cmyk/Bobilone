
import React from 'react';
import { Users, FileText, Calendar, BarChart3, Fingerprint, Shield, Menu } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick }) => {
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-[Poppins] bg-[#f4f6f8] text-[#333] min-h-screen flex flex-col">
      
      {/* Cabeçalho */}
      <header className="bg-[#0a7cff] text-white py-5 px-6 md:px-10 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-semibold cursor-pointer" onClick={scrollToTop}>Gestão RH</h1>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center">
          <button onClick={scrollToTop} className="text-white ml-5 bg-transparent border-none font-medium hover:opacity-80 transition-opacity cursor-pointer">Início</button>
          <button onClick={() => scrollToSection('funcionalidades')} className="text-white ml-5 bg-transparent border-none font-medium hover:opacity-80 transition-opacity cursor-pointer">Funcionalidades</button>
          <button 
            onClick={onLoginClick}
            className="text-white ml-5 bg-transparent border-none font-medium hover:opacity-80 transition-opacity cursor-pointer"
          >
            Entrar
          </button>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
           <button onClick={() => scrollToSection('funcionalidades')} className="text-white text-sm font-medium hover:opacity-80 bg-transparent border-none cursor-pointer">Funcionalidades</button>
           <button 
            onClick={onLoginClick} 
            className="text-[#0a7cff] bg-white px-3 py-1.5 rounded-full text-sm font-bold shadow-sm border-none cursor-pointer"
           >
             Entrar
           </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-10 text-center bg-gradient-to-br from-[#0a7cff] to-[#00c48c] text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-semibold mb-5 leading-tight">Gestão Inteligente de Pessoas</h2>
          <p className="text-lg md:text-[18px] mb-8 opacity-90">Controle funcionários, férias, relatórios e provas de vida em um só sistema.</p>
          <button 
            onClick={onRegisterClick}
            className="px-8 py-3.5 border-none rounded-full bg-white text-[#0a7cff] text-base font-semibold cursor-pointer transition-all hover:opacity-90 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Começar Agora
          </button>
        </div>
      </section>

      {/* Seção Funcionalidades */}
      <section id="funcionalidades" className="py-16 px-6 md:px-10 max-w-[1200px] mx-auto w-full flex-grow scroll-mt-20">
        <h3 className="text-center mb-10 text-[28px] font-semibold text-[#333]">Funcionalidades Principais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#0a7cff] mb-4">
               <Users size={24} />
            </div>
            <h4 className="mb-4 text-[#0a7cff] text-lg font-semibold">Cadastro de Funcionários</h4>
            <p className="text-[15px] leading-relaxed text-gray-600">
              Gerencie dados pessoais, cargos, departamentos e histórico profissional.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex flex-col items-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#00c48c] mb-4">
               <Calendar size={24} />
            </div>
            <h4 className="mb-4 text-[#0a7cff] text-lg font-semibold">Gestão de Férias</h4>
            <p className="text-[15px] leading-relaxed text-gray-600">
              O funcionário planeja as férias no plano anual e recebe uma notificação automática 1 mês antes da data planejada para realizar o pedido formal de férias pelo sistema.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4">
               <BarChart3 size={24} />
            </div>
            <h4 className="mb-4 text-[#0a7cff] text-lg font-semibold">Relatórios</h4>
            <p className="text-[15px] leading-relaxed text-gray-600">
              Análises detalhadas de pessoal, férias e indicadores de RH para apoio à tomada de decisão.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4">
               <Shield size={24} />
            </div>
            <h4 className="mb-4 text-[#0a7cff] text-lg font-semibold">Gestão de Usuários</h4>
            <p className="text-[15px] leading-relaxed text-gray-600">
              Criação de perfis com permissões específicas para administradores, RH e funcionários.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex flex-col items-center md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
               <Fingerprint size={24} />
            </div>
            <h4 className="mb-4 text-[#0a7cff] text-lg font-semibold">Prova de Vida</h4>
            <p className="text-[15px] leading-relaxed text-gray-600">
              O funcionário realiza a prova de vida no mês do seu aniversário através do aplicativo BioPv. O sistema envia notificações automáticas de lembrete no mês anterior para o funcionário e para o Gestor de Gestão RH.
            </p>
          </div>

        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-[#222] text-[#ccc] text-center p-5 mt-16">
        <p className="text-sm">© {new Date().getFullYear()} Gestão RH – Sistema de Gestão de Recursos Humanos</p>
      </footer>

    </div>
  );
};

export default LandingPage;
