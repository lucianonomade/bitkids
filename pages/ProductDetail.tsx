
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { WHATSAPP_NUMBER } from '../constants';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
    } else if (data) {
      setProduct({
        ...data,
        category: data.categories?.name
      } as Product);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-slate-500">Carregando detalhes...</p>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center h-[60vh] pt-20">
      <h2 className="text-2xl font-bold">Produto não encontrado</h2>
      <Link to="/catalog" className="text-primary-dark mt-4 font-bold">Voltar ao catálogo</Link>
    </div>
  );

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      alert("Por favor, selecione um tamanho.");
      return;
    }
    addToCart(product, selectedSize);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSize) {
      alert("Por favor, selecione um tamanho.");
      return;
    }
    const text = encodeURIComponent(`Olá! Quero comprar o produto: ${product.name} (ID: ${product.id}) no tamanho ${selectedSize}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div className="w-full pt-16">
      <div className="w-full px-6 py-4 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link className="hover:text-primary-dark" to="/">Início</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link className="hover:text-primary-dark" to="/catalog">Catálogo</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="font-bold text-accent-navy dark:text-white">{product.name}</span>
        </div>
      </div>

      <section className="w-full px-6 pb-12 pt-4 lg:px-12 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <div className="flex w-full flex-col gap-4 lg:w-1/2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-surface-dark">
                <div className="h-full w-full bg-slate-100 bg-cover bg-center" style={{ backgroundImage: `url('${product.image}')` }}></div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('${product.image}')`, filter: i > 1 ? `hue-rotate(${i * 45}deg)` : 'none' }}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col lg:w-1/2">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex text-accent-yellow">
                  <span className="material-symbols-outlined text-lg fill-current">star</span>
                  <span className="material-symbols-outlined text-lg fill-current">star</span>
                  <span className="material-symbols-outlined text-lg fill-current">star</span>
                  <span className="material-symbols-outlined text-lg fill-current">star</span>
                  <span className="material-symbols-outlined text-lg">star_half</span>
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">(42 avaliações)</span>
              </div>
              <h1 className="mb-2 text-3xl font-extrabold leading-tight text-accent-navy dark:text-white sm:text-4xl">
                {product.name}
              </h1>
              <div className="mb-6 flex items-end gap-3">
                <span className="text-4xl font-extrabold text-primary-dark dark:text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                {product.old_price && (
                  <span className="mb-1 text-lg text-slate-400 line-through">R$ {product.old_price.toFixed(2).replace('.', ',')}</span>
                )}
              </div>
              <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {product.description} Este produto é feito com os melhores materiais para garantir que seu pequeno esteja sempre confortável e estiloso em qualquer ocasião.
              </p>

              <div className="mb-8 space-y-6 rounded-2xl bg-slate-50 p-6 dark:bg-surface-dark border border-slate-100 dark:border-slate-800">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-bold text-accent-navy dark:text-white">Tamanho:</span>
                    <Link to="/size-guide" className="text-xs font-semibold text-primary-dark underline decoration-dotted underline-offset-2 hover:text-primary">Tabela de Medidas</Link>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes?.length > 0 ? product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-12 min-w-[3rem] items-center justify-center rounded-lg border-2 px-3 font-bold transition-all ${selectedSize === size
                          ? 'border-primary bg-primary/10 text-primary-dark'
                          : 'border-slate-200 bg-white text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                          }`}
                      >
                        {size}
                      </button>
                    )) : (
                      <p className="text-sm text-slate-400">Tamanho único ou sob consulta.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex flex-1 items-center justify-center gap-3 rounded-2xl px-8 py-5 text-xl font-bold border-2 transition-all active:scale-95 ${addedFeedback
                    ? 'bg-accent-green border-accent-green text-green-900'
                    : 'bg-white border-primary text-accent-navy hover:bg-primary/10'
                    }`}
                >
                  <span className="material-symbols-outlined">{addedFeedback ? 'check_circle' : 'add_shopping_cart'}</span>
                  {addedFeedback ? 'Adicionado!' : 'Adicionar ao Carrinho'}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-xl font-bold text-accent-navy shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 hover:bg-primary-dark active:scale-95"
                >
                  <span className="material-symbols-outlined">chat</span>
                  Comprar agora
                </button>
              </div>
              <p className="mt-4 text-center text-sm text-slate-500">
                Pague no recebimento ou via PIX • Atendimento personalizado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
