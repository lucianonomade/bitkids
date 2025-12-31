
import React, { useState, useRef, useEffect } from 'react';
import { getShoppingAdvice } from '../services/geminiService';
import { supabase } from '../services/supabase';
import { Product } from '../types';

const ShoppingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Oi! 👋 Sou o Bitt Assistant. Precisa de ajuda para escolher o look perfeito para o seu pequeno?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').limit(10);
    if (data) setProducts(data as Product[]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const context = `Nossos produtos atuais incluem: ${products.map(p => `${p.name} por R$${p.price}`).join(', ')}.`;
    const response = await getShoppingAdvice(userMsg, context);

    setMessages(prev => [...prev, { role: 'assistant', content: response || "Puxa, não consegui processar isso agora. Mas posso te dizer que nossos conjuntos de algodão são ótimos!" }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="float-animation flex size-14 items-center justify-center rounded-full bg-primary text-accent-navy shadow-2xl hover:bg-primary-dark transition-all"
        >
          <span className="material-symbols-outlined text-3xl">smart_toy</span>
        </button>
      ) : (
        <div className="flex h-[500px] w-[350px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100 dark:bg-surface-dark dark:ring-slate-800">
          <div className="flex items-center justify-between bg-primary p-4 text-accent-navy">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">smart_toy</span>
              <span className="font-bold">Bitt Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user'
                    ? 'bg-primary/20 text-accent-navy dark:text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none'
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 text-sm animate-pulse">
                  Pensando... 🪄
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 p-4 dark:border-slate-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre tamanhos..."
              className="flex-1 rounded-full border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-primary focus:ring-0 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            <button
              onClick={handleSend}
              className="flex size-10 items-center justify-center rounded-full bg-primary text-accent-navy hover:bg-primary-dark"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingAssistant;
