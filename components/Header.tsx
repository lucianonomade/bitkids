
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Catálogo', path: '/catalog' },
    { name: 'Tabela de Medidas', path: '/size-guide' },
    { name: 'Contato', path: '/contact' },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e7f3f2] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-4 lg:px-12">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary-dark group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-3xl">child_care</span>
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-accent-navy dark:text-white lg:text-2xl">Bitt Kids</h1>
      </Link>

      <nav className="hidden gap-8 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-semibold transition-colors hover:text-primary-dark dark:hover:text-primary ${location.pathname === link.path ? 'text-primary-dark font-bold' : 'text-accent-navy dark:text-white'
              }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Link
          to="/cart"
          className="relative flex items-center justify-center size-10 rounded-full bg-slate-100 text-accent-navy hover:bg-primary transition-all dark:bg-slate-800 dark:text-white dark:hover:bg-primary dark:hover:text-accent-navy"
        >
          <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-accent-pink text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
              {totalItems}
            </span>
          )}
        </Link>
        <Link
          to="/catalog"
          className="hidden sm:flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-accent-navy shadow-sm transition-transform hover:scale-105 hover:bg-primary-dark active:scale-95"
        >
          Catálogo
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-accent-navy dark:text-white"
        >
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-surface-dark shadow-xl p-6 flex flex-col gap-4 md:hidden animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-bold text-accent-navy dark:text-white"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/catalog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-4 text-accent-navy font-bold"
          >
            Ver Catálogo
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
