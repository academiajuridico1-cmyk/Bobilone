import React, { useState, useMemo } from 'react';
import { Lock, Mail, ArrowRight, CheckCircle, KeyRound, Check, ArrowLeft, Send } from 'lucide-react';
import { Employee } from '../types';

interface LoginProps {
  onLogin: (email: string, pass: string) => Employee | null;
  onChangePassword: (userId: string, newPass: string) => boolean;
  onLoginSuccess: (user: Employee) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onChangePassword, onLoginSuccess }) => {
  const [step, setStep] = useState<'LOGIN' | 'CHANGE_PW' | 'FORGOT_PW'>('LOGIN');
  const [tempUser, setTempUser] = useState<Employee | null>(null);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
    { id: 'number', label: 'Pelo menos um número', test: (p: string) => /[0-9]/.test(p) },
  ], []);

  const isPasswordValid = useMemo(() => {
    return passwordRules.every(rule => rule.test(newPassword));
  }, [newPassword, passwordRules]);

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
        case 'FORGOT_PW':
            return (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                     <button 
                        type="button" 
                        onClick={() => { setStep('LOGIN'); setSuccessMsg(''); setError(''); }}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors"
                    >
                        <ArrowLeft size={16} /> Voltar para o Login
                    </button>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Cadastrado</label>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            placeholder="nome@empresa.com"
                            value={forgotEmail}
                            onChange={e => setForgotEmail(e.target.value)}
                        />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-brand-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? 'Enviando...' : 'Recuperar Senha'}
                        {!isLoading && <Send size={18} />}
                    </button>
                </form>
            );

        case 'CHANGE_PW':
            return (
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800 mb-4">
                        Você está usando uma senha provisória. Por favor, crie uma senha pessoal e segura.
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="password" 
                                required
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${isPasswordValid ? 'border-green-300 focus:ring-green-500' : 'border-slate-200 focus:ring-brand-500'}`}
                                placeholder="Nova senha segura"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>
                        {/* Password Rules Visualization */}
                        <div className="mt-2 space-y-1.5 p-2 bg-slate-50 rounded-lg">
                            {passwordRules.map(rule => {
                                const isMet = rule.test(newPassword);
                                return (
                                    <div key={rule.id} className={`flex items-center gap-2 text-xs transition-colors ${isMet ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                                        {isMet ? <Check size={12} className="stroke-[3]" /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
                                        {rule.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nova Senha</label>
                        <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="password" 
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            placeholder="Repita a senha"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || !isPasswordValid}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-brand-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? 'Atualizando...' : 'Definir Senha e Entrar'}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>
            );

        case 'LOGIN':
        default:
            return (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Profissional</label>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            placeholder="nome@empresa.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="password" 
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            type="button"
                            onClick={() => { setStep('FORGOT_PW'); setSuccessMsg(''); setError(''); }}
                            className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline transition-colors"
                        >
                            Esqueceu sua senha?
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-brand-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? 'Verificando...' : 'Entrar na Plataforma'}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>
            );
    }
  };

  const getTitle = () => {
    switch(step) {
        case 'LOGIN': return 'Acesso ao Sistema';
        case 'CHANGE_PW': return 'Redefinição de Senha';
        case 'FORGOT_PW': return 'Recuperação de Acesso';
    }
  };

  const getSubtitle = () => {
    switch(step) {
        case 'LOGIN': return 'Entre com suas credenciais profissionais.';
        case 'CHANGE_PW': return 'Para sua segurança, defina uma nova senha.';
        case 'FORGOT_PW': return 'Informe seu email para receber instruções.';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center animate-fade-in">
         <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-200">
           <span className="text-3xl font-bold text-white">G</span>
         </div>
         <h1 className="text-3xl font-bold text-slate-900">Gestão de RH</h1>
         <p className="text-slate-500 mt-2">Plataforma Integrada de Recursos Humanos</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 animate-fade-in transition-all">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
            {getTitle()}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
            {getSubtitle()}
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 flex items-center gap-2 animate-pulse">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
             {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-sm mb-4 border border-blue-100 flex items-center gap-2">
             <CheckCircle size={16} className="shrink-0" />
             <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {renderForm()}

      </div>
      
      <div className="mt-8 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Gestão de RH. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default Login;