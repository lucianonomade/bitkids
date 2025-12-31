
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Category, Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

type AdminTab = 'overview' | 'products' | 'categories';

const SIZE_GROUPS = [
  { name: 'Bebê', sizes: ['0-3m', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m'] },
  { name: 'Infantil', sizes: ['2', '4', '6', '8', '10', '12', '14', '16'] },
  { name: 'Adulto/Letras', sizes: ['P', 'M', 'G', 'GG', 'XG'] }
];

const Admin: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null); // 'new' or UUID
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [uploading, setUploading] = useState(false);

  // Category management state
  const [isEditingCategory, setIsEditingCategory] = useState<string | null>(null); // 'new' or UUID
  const [categoryFormData, setCategoryFormData] = useState({ name: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: catData } = await supabase.from('categories').select('*').order('name');
    if (catData) setCategories(catData);

    const { data: prodData } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (prodData) {
      const formattedProducts = prodData.map((p: any) => ({
        ...p,
        category: p.categories?.name as Category
      }));
      setProducts(formattedProducts);
    }
    setLoading(false);
  };

  // --- Image Upload ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      setFormData({ ...formData, image: data.publicUrl });
    } catch (error: any) {
      alert("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- Product Actions ---
  const handleEditProduct = (product: Product) => {
    setIsEditing(product.id);
    setFormData(product);
  };

  const handleCreateProduct = () => {
    setIsEditing('new');
    setFormData({
      name: '',
      price: 0,
      description: '',
      category_id: categories[0]?.id || '',
      image: '',
      sizes: [],
      colors: [],
      old_price: undefined,
      is_popular: false,
      is_new: false
    });
  };

  const toggleSize = (size: string) => {
    const currentSizes = formData.sizes || [];
    if (currentSizes.includes(size)) {
      setFormData({ ...formData, sizes: currentSizes.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...currentSizes, size] });
    }
  };

  const saveProduct = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
      alert("Por favor, preencha nome, preço e categoria.");
      return;
    }

    // Prepare data (remove UI-only fields)
    const { id, category, categories: _, ...updateData } = formData as any;

    if (isEditing === 'new') {
      const { error } = await supabase.from('products').insert([updateData]);
      if (error) alert("Erro ao criar produto: " + error.message);
    } else {
      const { error } = await supabase.from('products').update(updateData).eq('id', isEditing);
      if (error) alert("Erro ao atualizar produto: " + error.message);
    }
    setIsEditing(null);
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert("Erro ao excluir produto: " + error.message);
      fetchData();
    }
  };

  // --- Category Actions ---
  const handleCreateCategory = () => {
    setIsEditingCategory('new');
    setCategoryFormData({ name: '' });
  };

  const saveCategory = async () => {
    if (!categoryFormData.name) return;
    if (isEditingCategory === 'new') {
      const { error } = await supabase.from('categories').insert([categoryFormData]);
      if (error) alert("Erro ao criar categoria: " + error.message);
    } else {
      const { error } = await supabase.from('categories').update(categoryFormData).eq('id', isEditingCategory);
      if (error) alert("Erro ao atualizar categoria: " + error.message);
    }
    setIsEditingCategory(null);
    setCategoryFormData({ name: '' });
    fetchData();
  };

  const deleteCategory = async (id: string) => {
    if (confirm("Excluir esta categoria? Produtos vinculados podem ficar sem categoria.")) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) alert("Erro: Esta categoria pode estar em uso.");
      fetchData();
    }
  };

  // --- Render Sections ---
  const renderOverview = () => {
    const totalInventoryValue = products.reduce((acc, p) => acc + p.price, 0);
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="inventory_2" label="Total Produtos" value={products.length.toString()} color="bg-blue-500" />
          <StatCard icon="category" label="Categorias" value={categories.length.toString()} color="bg-purple-500" />
          <StatCard icon="payments" label="Valor em Estoque" value={`R$ ${totalInventoryValue.toFixed(2)}`} color="bg-green-500" />
          <StatCard icon="trending_up" label="Destaques" value={products.filter(p => p.is_popular).length.toString()} color="bg-orange-500" />
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 dark:bg-surface-dark dark:ring-slate-800">
          <h3 className="text-xl font-bold mb-6">Últimos Produtos</h3>
          <div className="space-y-4">
            {products.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-slate-100 bg-cover bg-center" style={{ backgroundImage: `url('${p.image}')` }}></div>
                  <div>
                    <p className="text-sm font-bold">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.category}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary-dark">R$ {p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark pt-20">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-100 bg-white dark:border-slate-800 dark:bg-surface-dark lg:flex">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-50 dark:border-slate-800">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary-dark">
            <span className="material-symbols-outlined text-2xl">child_care</span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-accent-navy dark:text-white">Bitt Kids</h1>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin</span>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-4 py-6">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon="dashboard" label="Visão Geral" />
          <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon="inventory_2" label="Produtos" />
          <TabButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon="category" label="Categorias" />

          <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <span className="material-symbols-outlined">logout</span> Sair
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">

          {activeTab === 'overview' && renderOverview()}

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
              <div className="xl:col-span-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-accent-navy dark:text-white">Produtos</h2>
                  <button onClick={handleCreateProduct} className="flex items-center gap-2 rounded-xl bg-accent-navy px-5 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-accent-navy shadow-lg shadow-navy/20">
                    <span className="material-symbols-outlined">add</span> Novo Produto
                  </button>
                </div>
                <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-surface-dark dark:ring-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Item</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Categoria</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Preço</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {loading ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Carregando produtos...</td></tr>
                      ) : products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-cover bg-center bg-slate-100" style={{ backgroundImage: `url('${p.image}')` }}></div>
                              <span className="font-bold text-sm text-accent-navy dark:text-white">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400">{p.category}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold">R$ {p.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEditProduct(p)} className="p-1 text-slate-400 hover:text-primary-dark"><span className="material-symbols-outlined text-lg">edit</span></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-1 text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="xl:col-span-4">
                <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100 dark:bg-surface-dark dark:ring-slate-800 sticky top-4">
                  <h3 className="text-lg font-bold mb-6">{isEditing ? (isEditing === 'new' ? 'Novo Produto' : 'Editar Produto') : 'Painel de Detalhes'}</h3>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Foto do Produto</label>
                        <div className="flex flex-col gap-3">
                          {formData.image && (
                            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                              <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                              <button onClick={() => setFormData({ ...formData, image: '' })} className="absolute top-2 right-2 size-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">
                                <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                            </div>
                          )}
                          <label className={`flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <span className="material-symbols-outlined text-slate-300 text-3xl">{uploading ? 'hourglass_top' : 'add_photo_alternate'}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{uploading ? 'Enviando...' : 'Escolher Foto'}</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                        </div>
                      </div>

                      <InputField label="Nome" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />

                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Preço" type="number" value={formData.price?.toString()} onChange={v => setFormData({ ...formData, price: parseFloat(v) })} />
                        <InputField label="Preço Antigo (Opcional)" type="number" value={formData.old_price?.toString()} onChange={v => setFormData({ ...formData, old_price: v ? parseFloat(v) : undefined })} />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Descrição</label>
                        <textarea className="w-full rounded-xl border-slate-200 p-3 text-sm dark:bg-slate-800 dark:border-slate-700 min-h-[100px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Detalhes do produto..."></textarea>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Tamanhos Disponíveis</label>
                        <div className="space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                          {SIZE_GROUPS.map(group => (
                            <div key={group.name} className="space-y-2">
                              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{group.name}</p>
                              <div className="flex flex-wrap gap-2">
                                {group.sizes.map(size => {
                                  const isSelected = formData.sizes?.includes(size);
                                  return (
                                    <button
                                      key={size}
                                      onClick={() => toggleSize(size)}
                                      className={`flex h-9 min-w-[2.5rem] items-center justify-center rounded-lg border-2 px-2 text-xs font-bold transition-all ${isSelected
                                        ? 'border-primary bg-primary/20 text-primary-dark shadow-sm'
                                        : 'border-white bg-white text-slate-400 hover:border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                                        }`}
                                    >
                                      {size}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Categoria</label>
                        <select className="w-full rounded-xl border-slate-200 p-3 text-sm dark:bg-slate-800 dark:border-slate-700" value={formData.category_id || ''} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                          <option value="">Selecione...</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>

                      <div className="flex gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData.is_popular} onChange={e => setFormData({ ...formData, is_popular: e.target.checked })} className="rounded text-primary focus:ring-primary" />
                          <span className="text-xs font-bold text-slate-500 uppercase">Popular</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData.is_new} onChange={e => setFormData({ ...formData, is_new: e.target.checked })} className="rounded text-primary focus:ring-primary" />
                          <span className="text-xs font-bold text-slate-500 uppercase">Lançamento</span>
                        </label>
                      </div>

                      <div className="pt-4 space-y-3">
                        <button className="w-full rounded-xl bg-primary py-4 font-bold text-accent-navy shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" onClick={saveProduct}>Salvar Produto</button>
                        <button className="w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-500 dark:bg-slate-800" onClick={() => setIsEditing(null)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-5xl text-slate-100 mb-4">inventory</span>
                      <p className="text-slate-400 text-sm">Selecione um item ou crie um novo para gerenciar aqui.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
              <div className="xl:col-span-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-accent-navy dark:text-white">Categorias</h2>
                  <button onClick={handleCreateCategory} className="flex items-center gap-2 rounded-xl bg-accent-navy px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-navy/20">
                    <span className="material-symbols-outlined">add</span> Nova Categoria
                  </button>
                </div>
                <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-surface-dark dark:ring-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nome da Categoria</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Gerenciar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {categories.map(c => (
                        <tr key={c.id}>
                          <td className="px-6 py-4 font-bold text-sm">{c.name}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => { setIsEditingCategory(c.id); setCategoryFormData({ name: c.name }); }} className="p-2 text-slate-400 hover:text-primary-dark"><span className="material-symbols-outlined">edit</span></button>
                            <button onClick={() => deleteCategory(c.id)} className="p-2 text-slate-400 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="xl:col-span-4">
                <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100 dark:bg-surface-dark dark:ring-slate-800">
                  <h3 className="text-lg font-bold mb-6">{isEditingCategory ? (isEditingCategory === 'new' ? 'Nova Categoria' : 'Editar Categoria') : 'Gerenciar Categorias'}</h3>
                  {isEditingCategory ? (
                    <div className="space-y-4">
                      <InputField label="Nome da Categoria" value={categoryFormData.name} onChange={v => setCategoryFormData({ name: v })} />
                      <button className="w-full rounded-xl bg-accent-navy text-white py-4 font-bold shadow-lg" onClick={saveCategory}>
                        {isEditingCategory === 'new' ? 'Criar Categoria' : 'Atualizar Categoria'}
                      </button>
                      <button className="w-full text-slate-400 text-sm font-bold" onClick={() => { setIsEditingCategory(null); setCategoryFormData({ name: '' }); }}>Cancelar</button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-5xl text-slate-100 mb-4">category</span>
                      <p className="text-slate-400 text-sm">Clique em "Nova Categoria" ou edite uma existente na lista.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- Helper Components ---
const StatCard = ({ icon, label, value, color }: any) => (
  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-surface-dark dark:ring-slate-800">
    <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${color} bg-opacity-10 ${color.replace('bg-', 'text-')}`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    <p className="text-3xl font-extrabold text-accent-navy dark:text-white mt-1">{value}</p>
  </div>
);

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${active ? 'bg-primary/10 text-primary-dark' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`}>
    <span className="material-symbols-outlined">{icon}</span> {label}
  </button>
);

const InputField = ({ label, type = "text", value, onChange, placeholder }: any) => (
  <div>
    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{label}</label>
    <input
      type={type}
      className="w-full rounded-xl border-slate-200 p-3 text-sm dark:bg-slate-800 dark:border-slate-700"
      placeholder={placeholder || label}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default Admin;
