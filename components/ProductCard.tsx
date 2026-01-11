
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { WHATSAPP_NUMBER } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Único';
    addToCart(product, defaultSize);
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden block">
        {product.is_new && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded z-10">NOVIDADE</span>
        )}
        {product.is_popular && (
          <span className="absolute top-2 left-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10">DESTAQUE</span>
        )}
        {product.old_price && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10">
            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
          </span>
        )}
        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/80 dark:bg-black/50 p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-all z-10">
          <i className="material-icons-outlined text-sm">favorite_border</i>
        </button>
        <img
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={product.image || 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=400&auto=format&fit=crop'}
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-primary font-bold py-2 rounded-lg shadow text-sm hover:bg-gray-50 transition-colors"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-800 dark:text-white truncate hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 my-1">
          <i className="material-icons-outlined text-yellow-400 text-xs">star</i>
          <i className="material-icons-outlined text-yellow-400 text-xs">star</i>
          <i className="material-icons-outlined text-yellow-400 text-xs">star</i>
          <i className="material-icons-outlined text-yellow-400 text-xs">star</i>
          <i className="material-icons-outlined text-gray-300 text-xs">star</i>
          <span className="text-xs text-gray-400 ml-1">(12)</span>
        </div>
        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex flex-col">
            {product.old_price && (
              <span className="text-xs text-gray-400 line-through">R$ {product.old_price.toFixed(2).replace('.', ',')}</span>
            )}
            <span className="text-lg font-bold text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
