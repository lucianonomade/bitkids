
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../services/supabase';
import { WHATSAPP_NUMBER } from '../constants';
import { Product, Category } from '../types';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categoriesPlaceholder = [
    { name: 'Blusas', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALBNAxHhbXGbgNvslnfx_CQ_FZtd37YP49uxR3YUzegvCMvsDTSj3J7j_tm-XK6YwkyT-vvI7FDvQJnzmKNjWSvjN9UafOtv1jxDw33Z8pAYtHFevMj-EYI21xdbGhFvlYSgScFJMdJfRZT9l7kDKLs7Z62nbsNEZi1T1rO8NdrMQIYmYU-zGgRgj6NPhT75cbq5MHG25UDBqj28pYNZjGMXamo1yk-XdQEDe1-z7uGBD9qUV_Yt-Lbrn9acMWB8-HiOdVxVItL-Q' },
    { name: 'Vestidos', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANQ8KVjs3Q3Rt6BKNLcSeeSJLTlpCARqdm3qkkX7XEiniPffVuOuoI-TAheoit0o1me3rm4eiine5950Qc0rRpwVaF5m6cncVaLaAdbvovGrDie4draG7APqYhSGif29JkaWJUAf0ianybMuhDDBCNWdS7qbcRTXn5grW-fdNjOAWcPnJFhIO5y_6rbkXI16Bwdr9rwNHWb5Su_JX6ToglqSLI8XG3eJxY2ZWxngRWc2OxIqHLNt99iHryw_9fDQ_dWkfXENd5UZE' },
    { name: 'Conjuntos', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIr0CmNajQ03zMawCELzLdT0RjhoJlU1R7JfMdrFlu8RuYRqKZPAz-jIahuWxHnxLD3bFn3dHTfeK0Ece23sFSRjITAfH5pLMKHNX-cFYBktuWC77F0fVs-V-UTm4PzbpGd0Dfmrh8THIXWUT3e5LSMorl71Wrow3qFA1_99cD8-V6wfZyJ4SVB75gVFvOMoofuYLEcGpjgrtnOCbTzfNlWGOaoF_z4qdxjwFdzGkhYu86StrkcA3qA5XNLypG9XeVBP1Xs4nnN_w' },
    { name: 'Calçados', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_GpI5E_kmtjMQ3sBgQkY4dpuSA1RzPPc3B_DhQw_2RArckgWCApu8cCP3a4db8cjFR7gj9AGMjMyNwVQTmNCoInhVDKvSYx62GRBhKVmhBfsqLbKZdrWH0MGpT3Sb_udBPQXKNwDQhLkk-3OFy7oEWkL8nJFey6SJUdAlqRs8BElj75jXfxGPT_toRqRjy6vjOiKSHL3Yfp6TGLMV1sf7FxHmuMt6G65rzO0vZPMB_caRvwoNWUw_xD-TJq2I4w7Y5zByz2cxS2c' },
    { name: 'Acessórios', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtmWJrQWueEE-OmbHijtyTB5hZUUXC-6Nkh3tLwrCrzM0Wnu1ICstdlxTFkzi23hXqBxP-1fHoc-sZqzJMiAGem2HS_x1_mx20CA4mvNM8q2qRjlSAX5j0Xvh60-S-rV6EDauZGYD5Ob5L1SOpS1Fg80LUfk9eeVDa8M4D8gh0bZjBUd77_ksIH2rjpOlo32CBCDr-22fsZP5XYVzlUAL9ftStRYh7Zt4Ntw-MQOwxHo4RNLSAmCsLsJgUaT1OXKQnV1j_qi1Maek' },
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
      .limit(8);

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
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-surface-dark rounded-3xl p-6 md:p-12 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="z-10 order-2 md:order-1">
            <span className="inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-bold px-3 py-1 rounded-full mb-4">✨ Nova Coleção Disponível</span>
            <h1 className="text-4xl md:text-6xl font-black font-display text-gray-900 dark:text-white leading-tight mb-6">
              Moda infantil com <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">amor</span> e conforto
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
              Peças lindas e coloridas para o dia a dia do seu pequeno. Escolha o look perfeito e peça direto no WhatsApp!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/30 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                <i className="material-icons-outlined">shopping_bag</i>
                Comprar agora
              </Link>
              <Link to="/catalog" className="bg-transparent border-2 border-gray-200 dark:border-gray-600 hover:border-primary text-gray-700 dark:text-white font-bold py-3 px-8 rounded-full hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                Ver catálogo
              </Link>
            </div>
          </div>
          <div className="relative z-10 h-64 md:h-96 w-full rounded-2xl overflow-hidden order-1 md:order-2 group">
            <img
              alt="Crianças brincando"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwAeBfVTU6AWJRN54_qX6n5s1S_E6qXs8F_o1K91ksdtiwoW07X8uj5cLJmJhZTarLMZq6-vCFxQ1ug89PfGQQB0UkdEBoN0FAgkgWOql2qiXZ9wdZ7wb5aoy31JGxhjZuPAJU2LW3sxU4_OslxCWHky-Q3v7wheb1kkDKx__cvBkUf9rYR2Xsa0qaOD6kl9erDy4ZvhfSGxAeFyM53UB-GCSPvzI45XhfhW5pytc8Ajdsv-ka6T8h1XdFJEzijQcwUvbaASYYN9U"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Categorias</h2>
          <Link to="/catalog" className="text-primary hover:text-primary-dark font-medium text-sm flex items-center">
            Ver todas <i className="material-icons-outlined text-sm ml-1">arrow_forward</i>
          </Link>
        </div>
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {categoriesPlaceholder.map((cat, i) => (
            <Link key={i} to={`/catalog?category=${cat.name}`} className="flex flex-col items-center min-w-[100px] group snap-start">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-surface-dark shadow-md group-hover:border-primary transition-all duration-300">
                <img alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={cat.image} />
              </div>
              <span className="mt-3 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary">{cat.name}</span>
            </Link>
          ))}
          <Link to="/catalog" className="flex flex-col items-center min-w-[100px] group snap-start">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-surface-dark shadow-md group-hover:border-primary transition-all duration-300 bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
              <i className="material-icons-outlined text-4xl text-gray-400">add</i>
            </div>
            <span className="mt-3 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary">Ver Mais</span>
          </Link>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16 w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white inline-block relative pb-2 font-display">
            Acabaram de Chegar
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary rounded-full"></div>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-[4/5] rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.length > 0 ? featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            )) : (
              <p className="col-span-full text-center text-slate-400 py-10">Nenhum produto encontrado.</p>
            )}
          </div>
        )}
      </section>

      {/* WhatsApp Floating Button (Moved to App or Layout if wanted, but fine here) */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all flex items-center justify-center animate-bounce"
      >
        <svg className="bi bi-whatsapp" fill="currentColor" height="32" viewBox="0 0 16 16" width="32" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
        </svg>
      </a>

      {/* Checkout CTA Bar */}
      <Link to="/cart" className="bg-primary text-white py-4 text-center cursor-pointer hover:bg-primary-dark transition-colors sticky bottom-0 z-40 block">
        <span className="font-bold text-lg flex items-center justify-center gap-2">
          FINALIZAR PEDIDO <i className="material-icons-outlined">send</i>
        </span>
      </Link>
    </div>
  );
};

export default Home;
