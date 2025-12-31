
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../services/supabase';
import { Category, Product } from '../types';

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [priceRange, setPriceRange] = useState(300);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)');

    if (error) {
      console.error('Error fetching products:', error);
    } else if (data) {
      const formattedProducts = data.map((p: any) => ({
        ...p,
        category: p.categories?.name as Category
      }));
      setProducts(formattedProducts);
    }
    setLoading(false);
  };

  const categories = ['Todos', ...Object.values(Category)];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesPrice = p.price <= priceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, priceRange]);

  return (
    <div className="flex flex-col w-full pt-16">
      <section className="w-full bg-white dark:bg-surface-dark px-6 py-8 lg:px-12 border-b border-[#e7f3f2] dark:border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-accent-navy dark:text-white">Nosso Catálogo</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Explore nossa coleção completa de roupas infantis.</p>
              </div>
              <div className="relative w-full md:w-96">
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined">search</span>
                  </span>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium focus:border-primary focus:ring-0 focus:bg-white transition-all dark:border-slate-700 dark:bg-background-dark dark:text-white"
                    placeholder="O que você procura? (ex: vestido, pijama...)"
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full overflow-x-auto pb-2 no-scrollbar gap-3 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition-all ${selectedCategory === cat
                      ? 'bg-primary text-accent-navy shadow-md shadow-primary/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/30'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filter Drawer Style */}
            <div className="mt-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-background-dark/50">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Tamanho</h3>
                  <div className="flex flex-wrap gap-2">
                    {['P', 'M', 'G', '2', '4', '6', '8', '10'].map(size => (
                      <button key={size} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-primary dark:bg-surface-dark dark:border-slate-600 dark:text-slate-300">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="hidden h-auto w-px bg-slate-200 lg:block dark:bg-slate-700"></div>
                <div className="flex-1 min-w-[200px]">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Preço Máximo</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                    />
                    <div className="flex justify-between mt-2 text-xs font-bold text-primary-dark">
                      <span>R$ 0</span>
                      <span>R$ {priceRange}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-slate-500">Buscando os melhores looks...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
              <h3 className="text-xl font-bold text-slate-500">Nenhum produto encontrado</h3>
              <p className="text-slate-400 mt-2">Tente ajustar seus filtros ou busca.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); setPriceRange(300); }} className="mt-6 text-primary-dark font-bold hover:underline">
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Catalog;
