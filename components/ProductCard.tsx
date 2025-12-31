
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
// Fixed: WHATSAPP_NUMBER is exported from constants.ts, not types.ts
import { WHATSAPP_NUMBER } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`Olá! Gostaria de mais informações sobre o produto: ${product.name} (ID: ${product.id})`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-xl dark:bg-surface-dark border border-slate-100 dark:border-slate-800 min-h-[400px]">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] w-full overflow-hidden bg-slate-100">
        {product.is_popular && (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-accent-navy shadow-sm backdrop-blur-sm dark:bg-black/50 dark:text-white uppercase tracking-wider">
            ❤️ Popular
          </div>
        )}
        {product.is_new && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-accent-green px-2 py-1 text-[10px] font-bold text-green-900 shadow-sm uppercase tracking-wider">
            Novo
          </div>
        )}
        {product.old_price && (
          <div className="absolute right-3 bottom-3 z-10 rounded-full bg-accent-orange px-2 py-1 text-[10px] font-bold text-white shadow-sm">
            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}% OFF
          </div>
        )}
        <img
          src={product.image || 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=400&auto=format&fit=crop'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-1 max-h-12 overflow-hidden">
          {product.sizes?.map(size => (
            <span key={size} className="rounded bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700">
              {size}
            </span>
          ))}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-base font-bold leading-tight text-accent-navy dark:text-white hover:text-primary-dark transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {product.description || 'Nenhuma descrição disponível.'}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex flex-col">
            {product.old_price && (
              <span className="text-[10px] text-slate-400 line-through leading-none">R$ {product.old_price.toFixed(2).replace('.', ',')}</span>
            )}
            <span className="text-lg font-extrabold text-primary-dark dark:text-primary leading-tight">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <Link
            to={`/product/${product.id}`}
            className="flex size-10 items-center justify-center rounded-full bg-primary text-accent-navy transition-transform hover:scale-110 active:scale-95 hover:bg-primary-dark shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
