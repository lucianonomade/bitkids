
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            navigate('/admin');
        } else {
            setError('Senha incorreta. Tente novamente.');
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-6">
            <div className="w-full max-w-md rounded-[2.5rem] bg-white dark:bg-surface-dark p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-center mb-10">
                    <div className="inline-flex size-20 items-center justify-center rounded-full bg-primary/20 text-primary-dark mb-6">
                        <span className="material-symbols-outlined text-4xl">lock</span>
                    </div>
                    <h1 className="text-3xl font-black text-accent-navy dark:text-white mb-2">Área Restrita</h1>
                    <p className="text-slate-500">Acesse o painel administrativo da Bitt Kids</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-4">Senha de Acesso</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            className="h-14 w-full rounded-full border border-slate-200 bg-slate-50 dark:bg-background-dark dark:border-slate-700 px-6 text-lg outline-none focus:border-primary transition-all dark:text-white"
                            placeholder="Digite a senha..."
                            required
                        />
                        {error && <span className="text-red-500 text-xs font-bold ml-4 mt-1">{error}</span>}
                    </div>

                    <button
                        type="submit"
                        className="h-14 w-full rounded-full bg-primary hover:bg-primary-dark text-accent-navy text-lg font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        Entrar no Painel
                    </button>
                </form>

                <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    Bitt Kids • Administração
                </p>
            </div>
        </div>
    );
};

export default Login;
