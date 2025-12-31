
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { WHATSAPP_NUMBER } from '../constants';

const Cart: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        let message = `*Pedido Bitt Kids*\n\n`;
        message += `Olá! Gostaria de finalizar o pedido dos seguintes itens:\n\n`;

        cartItems.forEach((item, index) => {
            message += `${index + 1}. *${item.product.name}*\n`;
            message += `   Tamanho: ${item.size}\n`;
            message += `   Quantidade: ${item.quantity}\n`;
            message += `   Preço: R$ ${item.product.price.toFixed(2).replace('.', ',')}\n\n`;
        });

        message += `*Total: R$ ${totalPrice.toFixed(2).replace('.', ',')}*\n\n`;
        message += `Aguardo seu retorno para combinarmos a entrega e o pagamento!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                <div className="size-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl text-slate-400">shopping_cart_off</span>
                </div>
                <h2 className="text-2xl font-bold text-accent-navy dark:text-white mb-2">Seu carrinho está vazio</h2>
                <p className="text-slate-500 mb-8 max-w-xs">Parece que você ainda não escolheu nenhum look para o seu pequeno.</p>
                <Link to="/catalog" className="bg-primary hover:bg-primary-dark text-accent-navy px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-primary/20">
                    Explorar Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-12">
            <h1 className="text-3xl font-extrabold text-accent-navy dark:text-white mb-8">Meu Carrinho ({totalItems})</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {cartItems.map((item) => (
                        <div key={`${item.product.id}-${item.size}`} className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[2rem] bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="size-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                                <img src={item.product.image} alt={item.product.name} className="size-full object-cover" />
                            </div>

                            <div className="flex-1 flex flex-col gap-1 w-full text-center sm:text-left">
                                <h3 className="text-lg font-bold text-accent-navy dark:text-white line-clamp-1">{item.product.name}</h3>
                                <p className="text-sm text-slate-500">Tamanho: <span className="font-bold text-primary-dark">{item.size}</span></p>
                                <p className="text-primary-dark font-extrabold">R$ {item.product.price.toFixed(2).replace('.', ',')}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center rounded-full border border-slate-200 dark:border-slate-700 p-1">
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                        className="size-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg focus:outline-none">remove</span>
                                    </button>
                                    <span className="w-8 text-center font-bold text-accent-navy dark:text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                        className="size-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg focus:outline-none">add</span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.product.id, item.size)}
                                    className="size-10 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        className="text-slate-400 text-sm font-semibold hover:text-slate-600 self-start ml-2"
                    >
                        Limpar Carrinho
                    </button>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-background-dark/50 border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-accent-navy dark:text-white mb-6">Resumo</h2>

                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Itens ({totalItems})</span>
                                <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Frete</span>
                                <span className="text-accent-green font-bold italic">A combinar</span>
                            </div>
                            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                            <div className="flex justify-between text-xl font-extrabold text-accent-navy dark:text-white">
                                <span>Total</span>
                                <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-primary hover:bg-primary-dark text-accent-navy py-4 rounded-full font-extrabold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">chat</span>
                            Finalizar no WhatsApp
                        </button>
                        <p className="mt-4 text-[10px] text-center text-slate-400 px-4">
                            Ao clicar em finalizar, você será redirecionado para o WhatsApp com o resumo do seu pedido.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
