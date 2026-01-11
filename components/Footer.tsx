
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <i className="material-icons-outlined text-xl">child_care</i>
              </div>
              <span className="text-xl font-bold font-display text-gray-900 dark:text-white">Bitt Kids</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Moda infantil feita com carinho para os pequenos exploradores. Qualidade e conforto em cada detalhe.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <i className="material-icons-outlined text-lg">facebook</i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <i className="material-icons-outlined text-lg">camera_alt</i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <i className="material-icons-outlined text-lg">message</i>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-sm tracking-widest">Loja</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">Início</Link></li>
              <li><Link to="/catalog" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">Catálogo</Link></li>
              <li><Link to="/catalog?sale=true" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">Promocões</Link></li>
              <li><Link to="/admin" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">Área Restrita</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-sm tracking-widest">Ajuda</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">Fale Conosco</Link></li>
              <li><Link to="/size-guide" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">Tabela de Medidas</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">Como Comprar</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">Prazos e Entregas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-sm tracking-widest">Atendimento</h4>
            <div className="flex items-start gap-4 mb-4">
              <i className="material-icons-outlined text-primary">phone</i>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">(51) 99718-2923</p>
                <p className="text-xs text-gray-500">Seg. à Sex. das 9h às 18h</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <i className="material-icons-outlined text-primary">email</i>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">contato@bittkids.com.br</p>
                <p className="text-xs text-gray-500">Respondemos em até 24h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">© 2024 Bitt Kids. Todos os direitos reservados. Feito com ❤️ para os pequenos.</p>
          <div className="flex gap-4">
            <i className="material-icons-outlined text-gray-400 text-2xl">payments</i>
            <i className="material-icons-outlined text-gray-400 text-2xl">qr_code_2</i>
            <i className="material-icons-outlined text-gray-400 text-2xl">lock</i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
