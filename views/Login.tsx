
import React, { useState, useMemo } from 'react';
import { Lock, Mail, ArrowRight, CheckCircle, KeyRound, Check, ArrowLeft, Send, User, Building } from 'lucide-react';
import { Employee } from '../types';
import { mockService } from '../services/mockDataService';

interface LoginProps {
  onLogin: (email: string, pass: string) => Employee | null;
  onChangePassword: (userId: string, newPass: string) => boolean;
  onLoginSuccess: (user: Employee) => void;
  initialMode?: 'LOGIN' | 'REGISTER';
  onBackToLanding: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onChangePassword, onLoginSuccess, initialMode = 'LOGIN', onBackToLanding }) => {
  const [step, setStep] = useState<'LOGIN' | 'CHANGE_PW' | 'FORGOT_PW' | 'REGISTER'>(initialMode);
  const [tempUser, setTempUser] = useState<Employee | null>(null);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register Form State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  // Change Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password Validation Rules
  const passwordRules = useMemo(() => [
    { id: 'min-len', label: 'Mínimo de 8 caracteres', test: (p: string) => p.length >= 8 },
    { id: 'upper', label: 'Pelo menos uma letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
    { id: 'lower', label: 'Pelo menos uma letra minúscula', test: (p: string) => /[a-z]/.test(p) },
    { id: 'number', label: 'Pelo menos um número', test: (p: string) => /[0-9]/.test(p) },
  ], []);

  const isPasswordValid = useMemo(() => {
    const pwToCheck = step === 'REGISTER' ? regPassword : newPassword;
    return passwordRules.every(rule => rule.test(pwToCheck));
  }, [newPassword, regPassword, step, passwordRules]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      const user = onLogin(email, password);
      
      if (user) {
        if (user.mustChangePassword) {
            setTempUser(user);
            setStep('CHANGE_PW');
            setSuccessMsg('Primeiro acesso detectado. Por favor, redefina sua senha.');
            setIsLoading(false);
        } else {
            onLoginSuccess(user);
        }
      } else {
        setError('Credenciais inválidas. Tente novamente.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
        setError('A senha não atende aos requisitos de segurança.');
        return;
    }

    setIsLoading(true);

    setTimeout(() => {
        const newUser = mockService.registerAdmin(regFirstName, regLastName, regEmail, regPassword);
        
        if (newUser) {
            // Auto login after register
            onLoginSuccess(newUser);
        } else {
            setError('Este e-mail já está cadastrado no sistema.');
            setIsLoading(false);
        }
    }, 1000);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser) return;
    
    setError('');
    
    if (!isPasswordValid) {
        setError('A senha não atende aos requisitos de segurança.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
        const success = onChangePassword(tempUser.id, newPassword);
        if (success) {
            const updatedUser = { ...tempUser, mustChangePassword: false };
            onLoginSuccess(updatedUser);
        } else {
            setError('Erro ao atualizar senha. Tente novamente.');
            setIsLoading(false);
        }
    }, 800);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        // We don't reveal if email exists or not for security, but show success
        setSuccessMsg(`Se o e-mail ${forgotEmail} estiver cadastrado, você receberá instruções de recuperação em instantes.`);
        setForgotEmail('');
    }, 1500);
  };

  const renderForm = () => {
    switch (step) {
        case 'REGISTER':
            return (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome</label>
                            <input 
                                type="text" required className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" placeholder="Seu nome"
                                value={regFirstName} onChange={e => setRegFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Sobrenome</label>
                            <input 
                                type="text" required className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" placeholder="Sobrenome"
                                value={regLastName} onChange={e => setRegLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email" required className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" placeholder="nome@empresa.com"
                                value={regEmail} onChange={e => setRegEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="password" required className={`w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border focus:outline-none focus:ring-2 transition-all ${isPasswordValid ? 'border-green-300 focus:ring-green-500' : 'border-slate-200 focus:ring-brand-500'}`} placeholder="Crie sua senha"
                                value={regPassword} onChange={e => setRegPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {passwordRules.map(rule => {
                                const isMet = rule.test(regPassword);
                                return (
                                    <div key={rule.id} className={`flex items-center gap-1.5 text-[10px] transition-colors ${isMet ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
                                        {isMet ? <Check size={12} className="stroke-[3]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                                        {rule.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading || !isPasswordValid} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 transform active:scale-95">
                        {isLoading ? 'Processando...' : 'Cadastro'}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                    <div className="text-center mt-4">
                        <button type="button" onClick={() => setStep('LOGIN')} className="text-sm text-slate-500 hover:text-brand-600 font-medium transition-colors">
                            Já possui conta? <span className="underline">Fazer Login</span>
                        </button>
                    </div>
                </form>
            );

        case 'FORGOT_PW':
            return (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                     <button 
                        type="button" 
                        onClick={() => { setStep('LOGIN'); setSuccessMsg(''); setError(''); }}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar
                    </button>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Cadastrado</label>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            placeholder="nome@empresa.com"
                            value={forgotEmail}
                            onChange={e => setForgotEmail(e.target.value)}
                        />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? 'Enviando...' : 'Recuperar Senha'}
                        {!isLoading && <Send size={18} />}
                    </button>
                </form>
            );

        case 'CHANGE_PW':
            return (
                <form onSubmit={handleChangePasswordSubmit} className="space-y-5">
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800 mb-4 flex gap-2">
                        <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-amber-500" />
                        Por segurança, defina uma nova senha pessoal para continuar.
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nova Senha</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="password" 
                                required
                                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border focus:outline-none focus:ring-2 transition-all ${isPasswordValid ? 'border-green-300 focus:ring-green-500' : 'border-slate-200 focus:ring-brand-500'}`}
                                placeholder="Nova senha segura"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>
                        {/* Password Rules Visualization */}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {passwordRules.map(rule => {
                                const isMet = rule.test(newPassword);
                                return (
                                    <div key={rule.id} className={`flex items-center gap-1.5 text-[10px] transition-colors ${isMet ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
                                        {isMet ? <Check size={12} className="stroke-[3]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                                        {rule.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Confirmar Nova Senha</label>
                        <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="password" 
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            placeholder="Repita a senha"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || !isPasswordValid}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? 'Atualizando...' : 'Definir e Entrar'}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>
            );

        case 'LOGIN':
        default:
            return (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email</label>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            placeholder="nome@empresa.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Senha</label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="password" 
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <button 
                            type="button"
                            onClick={() => setStep('REGISTER')}
                            className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
                        >
                            Criar nova conta
                        </button>
                        <button 
                            type="button"
                            onClick={() => { setStep('FORGOT_PW'); setSuccessMsg(''); setError(''); }}
                            className="text-sm font-medium text-brand-500 hover:text-brand-600 hover:underline transition-colors"
                        >
                            Esqueceu a senha?
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 transform active:scale-95"
                    >
                        {isLoading ? 'Verificando...' : 'Entrar'}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>
            );
    }
  };

  const getTitle = () => {
    switch(step) {
        case 'LOGIN': return 'Acesso ao Sistema';
        case 'REGISTER': return 'Cadastro';
        case 'CHANGE_PW': return 'Redefinição de Senha';
        case 'FORGOT_PW': return 'Recuperação de Acesso';
    }
  };

  const getSubtitle = () => {
    switch(step) {
        case 'LOGIN': return 'Bem-vindo de volta. Insira suas credenciais.';
        case 'REGISTER': return 'Preencha os dados para iniciar sua jornada.';
        case 'CHANGE_PW': return 'Defina sua senha definitiva.';
        case 'FORGOT_PW': return 'Informe seu email para receber instruções.';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-100 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <button onClick={onBackToLanding} className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors z-20">
         <ArrowLeft size={20} /> <span className="text-sm font-medium">Voltar ao site</span>
      </button>

      <div className="mb-8 text-center animate-fade-in-up">
         <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-200 transform rotate-3">
           <span className="text-3xl font-bold text-white">G</span>
         </div>
         <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestão de RH</h1>
         <p className="text-slate-500 mt-2 font-medium">Plataforma Integrada</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 animate-fade-in transition-all duration-300">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {getTitle()}
        </h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            {getSubtitle()}
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-3 animate-shake">
             <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-red-500"></div></div>
             <span className="font-medium">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm mb-6 border border-emerald-100 flex items-center gap-3">
             <CheckCircle size={20} className="shrink-0 text-emerald-500" />
             <span className="font-medium leading-snug">{successMsg}</span>
          </div>
        )}

        {renderForm()}

      </div>
      
      <div className="mt-8 text-center text-xs font-medium text-slate-400">
        &copy; {new Date().getFullYear()} Gestão de RH. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default Login;
