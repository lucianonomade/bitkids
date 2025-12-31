
import React from 'react';
import { Link } from 'react-router-dom';

const SizeGuide: React.FC = () => {
    const babySizes = [
        { size: 'RN', height: 'Até 52cm', weight: 'Até 4kg' },
        { size: 'P (0-3m)', height: '52-62cm', weight: '4-6kg' },
        { size: 'M (3-6m)', height: '62-67cm', weight: '6-8kg' },
        { size: 'G (6-9m)', height: '67-72cm', weight: '8-10kg' },
        { size: 'GG (9-12m)', height: '72-77cm', weight: '10-12kg' },
        { size: '1 ano', height: '77-82cm', weight: '12-14kg' },
    ];

    const kidsSizes = [
        { size: '2', height: '88-98cm', weight: '13-16kg' },
        { size: '4', height: '98-105cm', weight: '16-19kg' },
        { size: '6', height: '105-117cm', weight: '19-22kg' },
        { size: '8', height: '117-128cm', weight: '22-25kg' },
        { size: '10', height: '128-137cm', weight: '25-28kg' },
        { size: '12', height: '137-150cm', weight: '28-32kg' },
    ];

    return (
        <div className="flex flex-col w-full pb-20 pt-20">
            <section className="px-6 md:px-12 mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-accent-navy dark:text-white mb-4">Tabela de Medidas</h1>
                <p className="text-slate-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Queremos que seu pequeno fique confortável! Use nossa tabela de referência para escolher o tamanho ideal.
                </p>
            </section>

            <div className="mx-auto max-w-5xl px-6 lg:px-12 space-y-16">
                {/* Baby Section */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-primary/20 text-primary-dark p-3 rounded-2xl">
                            <span className="material-symbols-outlined text-3xl">child_care</span>
                        </div>
                        <h2 className="text-2xl font-bold text-accent-navy dark:text-white">Linha Baby</h2>
                    </div>
                    <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-background-dark/50">
                                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Tamanho</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Altura</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Peso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {babySizes.map((item) => (
                                    <tr key={item.size} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-accent-navy dark:text-white">{item.size}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.height}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.weight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Kids Section */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-accent-pink/20 text-accent-pink p-3 rounded-2xl">
                            <span className="material-symbols-outlined text-3xl">child_friendly</span>
                        </div>
                        <h2 className="text-2xl font-bold text-accent-navy dark:text-white">Linha Infantil</h2>
                    </div>
                    <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-background-dark/50">
                                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Tamanho</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Altura</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Peso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {kidsSizes.map((item) => (
                                    <tr key={item.size} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-accent-navy dark:text-white">{item.size}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.height}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.weight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-[2.5rem] p-8 md:p-12 border border-yellow-100 dark:border-yellow-900/40">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="size-20 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-4xl text-white">lightbulb</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-accent-navy dark:text-white mb-2">Ainda na dúvida?</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Lembre-se que cada criança cresce no seu tempo! Se a criança estiver entre dois tamanhos, recomendamos escolher o maior para garantir mais tempo de uso e conforto.
                            </p>
                            <Link to="/contact" className="inline-block mt-4 font-bold text-primary-dark hover:underline">
                                Fale conosco para orientações personalizadas →
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SizeGuide;
