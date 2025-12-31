
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../services/supabase';
import { WHATSAPP_NUMBER } from '../constants';
import { Product, Category } from '../types';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .limit(4);

    if (error) {
      console.error('Error fetching featured products:', error);
    } else if (data) {
      const formattedProducts = data.map((p: any) => ({
        ...p,
        category: p.categories?.name as Category
      }));
      setFeaturedProducts(formattedProducts);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full pt-16">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden px-6 py-12 lg:px-12 lg:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-12 lg:flex-row lg:justify-between">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left lg:w-1/2">
            <div className="inline-flex items-center rounded-full bg-accent-yellow/20 px-3 py-1 text-xs font-bold text-yellow-700 dark:text-yellow-400">
              <span className="mr-1">✨</span> Nova Coleção Disponível
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-accent-navy dark:text-white lg:text-6xl">
              Moda infantil com <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-accent-pink">amor</span> e conforto
            </h2>
            <p className="max-w-md text-lg font-medium text-slate-600 dark:text-slate-300">
              Peças lindas e coloridas para o dia a dia do seu pequeno. Escolha o look perfeito e peça direto no WhatsApp!
            </p>
            <div className="flex flex-col gap-3 sm:flex-row w-full sm:w-auto">
              <Link to="/catalog" className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-accent-navy shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:bg-primary-dark w-full sm:w-auto">
                <span className="material-symbols-outlined">chat</span>
                Comprar agora
              </Link>
              <Link to="/catalog" className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-transparent px-8 py-4 text-base font-bold text-accent-navy hover:border-primary hover:bg-primary/10 dark:border-slate-700 dark:text-white w-full sm:w-auto transition-all">
                Ver catálogo
              </Link>
            </div>
          </div>
          <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-accent-pink/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/20 blur-2xl"></div>
            <div className="relative aspect-[4/3] w-full max-w-[600px] overflow-hidden rounded-[2rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 bg-slate-200" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full bg-white px-6 py-16 dark:bg-surface-dark lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold text-accent-navy dark:text-white">Por que escolher a Bitt Kids?</h3>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Cuidamos de cada detalhe para o conforto do seu filho.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: 'checkroom', title: 'Conforto Garantido', desc: 'Tecidos macios que não incomodam a pele.', color: 'bg-primary/20 text-primary-dark' },
              { icon: 'verified', title: 'Qualidade Premium', desc: 'Peças duráveis para todas as brincadeiras.', color: 'bg-accent-pink/20 text-pink-500' },
              { icon: 'forum', title: 'Atendimento Fácil', desc: 'Compre tudo pelo WhatsApp sem complicação.', color: 'bg-accent-green/20 text-green-600' },
              { icon: 'local_shipping', title: 'Entrega Rápida', desc: 'Chega rapidinho na sua casa com todo cuidado.', color: 'bg-accent-orange/20 text-orange-600' }
            ].map((benefit, i) => (
              <div key={i} className="group flex flex-col items-center gap-4 rounded-2xl bg-background-light p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:bg-background-dark border border-slate-100 dark:border-slate-800">
                <div className={`flex size-14 items-center justify-center rounded-full ${benefit.color} group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-accent-navy dark:text-white">{benefit.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="w-full px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-extrabold text-accent-navy dark:text-white">Destaques da Coleção</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Os queridinhos das mamães e papais.</p>
            </div>
            <Link to="/catalog" className="group flex items-center gap-1 text-sm font-bold text-primary-dark hover:text-primary transition-colors">
              Ver catálogo completo
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.length > 0 ? featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              )) : (
                <p className="col-span-full text-center text-slate-400 py-10">Adicione produtos no admin para vê-los aqui!</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / Contact CTA */}
      <section className="w-full px-6 py-16 lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-[#e0f7fa] to-[#e8f5e9] p-8 text-center dark:from-slate-800 dark:to-slate-900 sm:p-16">
          <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-white shadow-lg dark:bg-surface-dark">
            <span className="material-symbols-outlined text-4xl text-primary-dark dark:text-primary">smartphone</span>
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-accent-navy dark:text-white sm:text-4xl">Fale com a gente!</h2>
          <p className="mb-8 max-w-lg text-lg text-slate-600 dark:text-slate-300">
            Tem dúvidas sobre tamanhos ou quer ver mais modelos? Nossa equipe adora ajudar você a escolher o melhor look.
          </p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-1 hover:brightness-105 active:scale-95">
            <span className="material-symbols-outlined">chat</span>
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
