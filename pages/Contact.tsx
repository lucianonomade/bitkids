
import React from 'react';
import { WHATSAPP_NUMBER } from '../constants';

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-20">
      <section className="px-4 py-8 md:px-10 md:py-16 flex justify-center">
        <div className="max-w-[800px] flex flex-col items-center text-center gap-4">
          <h1 className="text-accent-navy dark:text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Estamos aqui para ajudar!
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-[600px]">
            Dúvidas sobre tamanho, frete ou pedido? Nossa equipe de atendimento está pronta para você.
          </p>
          <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Respondemos geralmente em menos de 1 hora!</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 pb-12 flex justify-center">
        <div className="max-w-[960px] w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="group flex items-center gap-5 rounded-3xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm transition-all hover:shadow-md hover:border-primary">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
              <span className="material-symbols-outlined text-4xl">chat</span>
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">WhatsApp</h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm">Suporte Instantâneo via WhatsApp</p>
              <span className="mt-2 text-primary font-bold text-sm block group-hover:underline">Iniciar conversa →</span>
            </div>
          </a>
          <a href="https://instagram.com/bittkids" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 rounded-3xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm transition-all hover:shadow-md hover:border-pink-500">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/30">
              <svg className="size-8 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Instagram</h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm">Siga & DM: @bittkids</p>
              <span className="mt-2 text-pink-500 font-bold text-sm block group-hover:underline">Ver Perfil →</span>
            </div>
          </a>
          <a href="https://facebook.com/bittkids" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 rounded-3xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-600">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
              <svg className="size-8 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Facebook</h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm">Acompanhe no Face: @bittkids</p>
              <span className="mt-2 text-blue-600 font-bold text-sm block group-hover:underline">Curtir Página →</span>
            </div>
          </a>
        </div>
      </section>

    </div>
  );
};

export default Contact;
