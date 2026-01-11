
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Início', path: '/', icon: 'home' },
    { name: 'Nova Coleção', path: '/catalog' },
    { name: 'Meninas', path: '/catalog?category=Meninas' },
    { name: 'Meninos', path: '/catalog?category=Meninos' },
    { name: 'Bebês', path: '/catalog?category=Bebês' },
    { name: 'Ofertas', path: '/catalog?sale=true' },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-dark text-white text-[10px] md:text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1"><i className="material-icons-outlined text-sm">storefront</i> Informações da Loja</span>
            <span className="hidden md:flex items-center gap-1"><i className="material-icons-outlined text-sm">payment</i> Formas de Pagamento</span>
          </div>
          <div className="flex items-center space-x-4 text-center md:text-right">
            <span className="flex items-center gap-1"><i className="material-icons-outlined text-sm">local_shipping</i> Frete Grátis acima de R$299</span>
            <div className="hidden sm:flex items-center gap-2 border-l border-white/20 pl-4">
              <i className="material-icons-outlined text-sm">lock</i>
              <span>Ambiente Seguro</span>
            </div>
          </div>
        </div>
      </div>

      <header className="bg-surface-light dark:bg-surface-dark shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <i className="material-icons-outlined text-2xl">child_care</i>
              </div>
              <span className="text-2xl font-bold font-display text-gray-900 dark:text-white">Bitt Kids</span>
            </Link>

            {/* Search Bar */}
            <div className="w-full max-w-2xl relative order-3 md:order-2">
              <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <input
                  className="w-full py-3 px-4 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-none focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Buscar produtos (ex: Body, Conjunto, Vestido)..."
                  type="text"
                />
                <button className="bg-primary hover:bg-primary-dark text-white px-6 flex items-center justify-center transition-colors">
                  <i className="material-icons-outlined">search</i>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 flex-shrink-0 order-2 md:order-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              >
                <i className="material-icons-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</i>
              </button>

              <Link to="/contact" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                <i className="material-icons-outlined text-2xl">support_agent</i>
                <span className="text-xs font-medium mt-1">Atendimento</span>
              </Link>
              <Link to="/login" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                <i className="material-icons-outlined text-2xl">person_outline</i>
                <span className="text-xs font-medium mt-1">Minha Conta</span>
              </Link>
              <Link to="/cart" className="group flex items-center bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-all">
                <div className="relative">
                  <i className="material-icons-outlined text-2xl">shopping_cart</i>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="ml-2 font-bold text-sm hidden sm:block">Carrinho</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-700 p-4 absolute top-full left-0 w-full shadow-lg z-50">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-bold uppercase text-sm hover:text-primary transition-colors"
                  >
                    {link.icon && <i className="material-icons-outlined text-lg">{link.icon}</i>}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Navigation Bar (Desktop) */}
      <nav className="bg-primary text-white shadow-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center md:gap-10 overflow-x-auto py-3 md:py-4 text-sm font-bold uppercase tracking-wide hide-scrollbar whitespace-nowrap">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.path}>
                {index > 0 && <li className="h-4 w-px bg-white/30"></li>}
                <li>
                  <Link to={link.path} className="flex items-center gap-1 hover:text-yellow-200 transition-colors">
                    {link.icon && <i className="material-icons-outlined text-lg">{link.icon}</i>}
                    {link.name}
                  </Link>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
