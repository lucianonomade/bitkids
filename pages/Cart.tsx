
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { WHATSAPP_NUMBER } from '../constants';

const Cart: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = React.useState<string>('pix');
    const [formData, setFormData] = React.useState({
        nome: '',
        telefone: '',
        cep: '',
        endereco: '',
        cidade: '',
        estado: ''
    });

    const paymentOptions = [
        { id: 'credit', label: 'Cartão de Crédito', icon: 'credit_card' },
        { id: 'debit', label: 'Cartão de Débito', icon: 'payment' },
        { id: 'pix', label: 'PIX', icon: 'qr_code_2' },
        { id: 'cash', label: 'Dinheiro', icon: 'attach_money' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        if (!formData.nome || !formData.telefone) {
            alert('Por favor, preencha pelo menos seu nome e telefone.');
            return;
        }

        let message = `*NOVO PEDIDO - BITT KIDS*\n\n`;
        message += `*CLIENTE:* ${formData.nome}\n`;
        message += `*CONTATO:* ${formData.telefone}\n`;
        if (formData.endereco) {
            message += `*ENTREGA:* ${formData.endereco}, ${formData.cidade}-${formData.estado} (CEP: ${formData.cep})\n`;
        }
        message += `\n*ÍTENS DO PEDIDO:*\n`;

        cartItems.forEach((item, index) => {
            message += `${index + 1}. *${item.product.name}*\n`;
            message += `   Tamanho: ${item.size}\n`;
            message += `   Quantidade: ${item.quantity}\n`;
            message += `   Preço: R$ ${item.product.price.toFixed(2).replace('.', ',')}\n`;
        });

        message += `\n*TOTAL: R$ ${totalPrice.toFixed(2).replace('.', ',')}*\n`;
        message += `*PAGAMENTO:* ${paymentOptions.find(o => o.id === paymentMethod)?.label}\n\n`;
        message += `Aguardo seu retorno para confirmarmos o pedido!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                    <i className="material-icons-outlined text-5xl text-slate-400">shopping_cart_off</i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">Seu carrinho está vazio</h2>
                <p className="text-slate-500 mb-8 max-w-xs">Parece que você ainda não escolheu nenhum look para o seu pequeno.</p>
                <Link to="/catalog" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-primary/20">
                    Explorar Catálogo
                </Link>
            </div>
        );
    }

    return (
        <main className="flex-grow max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white font-display">Finalizar Pedido</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-6">
                    {/* Delivery Section */}
                    <section className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800 dark:text-white">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <i className="material-icons-outlined text-lg">person</i>
                            </div>
                            Dados de Entrega
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                <input
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-600 dark:bg-slate-800 dark:text-white focus:ring-primary focus:border-primary outline-none py-2 px-3 border"
                                    placeholder="Digite seu nome"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone / WhatsApp</label>
                                <input
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-600 dark:bg-slate-800 dark:text-white focus:ring-primary focus:border-primary outline-none py-2 px-3 border"
                                    placeholder="(00) 00000-0000"
                                    type="tel"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</label>
                                <input
                                    name="cep"
                                    value={formData.cep}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-600 dark:bg-slate-800 dark:text-white focus:ring-primary focus:border-primary outline-none py-2 px-3 border"
                                    placeholder="00000-000"
                                    type="text"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço</label>
                                <input
                                    name="endereco"
                                    value={formData.endereco}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-600 dark:bg-slate-800 dark:text-white focus:ring-primary focus:border-primary outline-none py-2 px-3 border"
                                    placeholder="Rua, Número, Bairro"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
                                <input
                                    name="cidade"
                                    value={formData.cidade}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-600 dark:bg-slate-800 dark:text-white focus:ring-primary focus:border-primary outline-none py-2 px-3 border"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                                <select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-600 dark:bg-slate-800 dark:text-white focus:ring-primary focus:border-primary outline-none py-2 px-3 border"
                                >
                                    <option value="">Selecione</option>
                                    <option value="SP">SP</option>
                                    <option value="RJ">RJ</option>
                                    <option value="MG">MG</option>
                                    <option value="RS">RS</option>
                                    <option value="SC">SC</option>
                                    <option value="PR">PR</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Order Items Section */}
                    <section className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800 dark:text-white">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <i className="material-icons-outlined text-lg">shopping_bag</i>
                                </div>
                                Itens do Pedido ({totalItems})
                            </h2>
                            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">Limpar Carrinho</button>
                        </div>

                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={`${item.product.id}-${item.size}`} className="flex gap-4 md:gap-6 pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50">
                                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg font-display line-clamp-1">{item.product.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Tamanho: <span className="text-primary font-bold">{item.size}</span></p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-primary text-xl">R$ {item.product.price.toFixed(2).replace('.', ',')}</span>
                                            <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-300"
                                                >
                                                    <i className="material-icons-outlined text-sm">remove</i>
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-gray-800 dark:text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-300"
                                                >
                                                    <i className="material-icons-outlined text-sm">add</i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.product.id, item.size)}
                                        className="text-gray-400 hover:text-red-500 transition-colors self-start p-1"
                                    >
                                        <i className="material-icons-outlined">delete_outline</i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sticky Summary Column */}
                <div className="lg:col-span-5 relative">
                    <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-28">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4 font-display">Resumo do Pedido</h2>

                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
                            <div className="flex justify-between">
                                <span>Itens ({totalItems})</span>
                                <span className="font-medium">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Frete</span>
                                <span className="font-bold text-primary italic">A combinar</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-gray-100 dark:border-gray-700 pt-4 mb-8">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                            <span className="text-3xl font-black text-gray-900 dark:text-white">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-4">Forma de Pagamento</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {paymentOptions.map((option) => (
                                    <label key={option.id} className="cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === option.id}
                                            onChange={() => setPaymentMethod(option.id)}
                                            className="peer sr-only"
                                        />
                                        <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 transition-all h-24">
                                            <i className={`material-icons-outlined text-3xl mb-2 text-gray-600 dark:text-gray-300 peer-checked:text-primary`}>
                                                {option.icon}
                                            </i>
                                            <span className="text-[10px] font-bold text-center text-gray-600 dark:text-gray-300 peer-checked:text-primary uppercase leading-tight">
                                                {option.label}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-primary/30 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
                                </svg>
                            </span>
                            Finalizar no WhatsApp
                        </button>

                        <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                            Ao clicar em finalizar, você será redirecionado para o WhatsApp com o resumo do seu pedido para combinar o pagamento e a entrega.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Cart;
