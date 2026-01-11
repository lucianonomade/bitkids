
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
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');

  const [isEditingCategory, setIsEditingCategory] = useState<string | null>(null);
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

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Todos' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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

  const renderProductTable = () => (
    <div className="glass-panel flex-grow overflow-hidden flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Preço</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Carregando produtos...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Nenhum produto encontrado.</td></tr>
            ) : filteredProducts.map(p => (
              <tr
                key={p.id}
                className={`group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${isEditing === p.id ? 'bg-primary-light/30 dark:bg-primary/5' : ''}`}
                onClick={() => handleEditProduct(p)}
              >
                <td className="px-6 py-4 relative">
                  {isEditing === p.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img alt={p.name} className="w-full h-full object-cover" src={p.image} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary-dark font-semibold">{p.category}</span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white uppercase">R$ {p.price.toFixed(2).replace('.', ',')}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditProduct(p); }}
                      className="p-1.5 text-gray-400 hover:text-primary transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="material-icons-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }}
                      className="p-1.5 text-gray-400 hover:text-danger transition-colors rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <span className="material-icons-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center mt-auto">
        <span className="text-xs text-gray-500">Mostrando {filteredProducts.length} de {products.length} produtos</span>
      </div>
    </div>
  );

  const renderEditPanel = () => (
    <div className="glass-panel p-6 h-full flex flex-col overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
          {isEditing === 'new' ? 'Novo Produto' : 'Detalhes do Produto'}
        </h2>
        <button onClick={() => setIsEditing(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <span className="material-icons-outlined">close</span>
        </button>
      </div>

      <div className="space-y-6">
        <div
          onClick={() => document.getElementById('file-upload')?.click()}
          className="w-full aspect-video bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group relative overflow-hidden"
        >
          {formData.image ? (
            <>
              <img alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" src={formData.image} />
              <div className="z-10 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-icons-outlined text-3xl text-primary mb-2">cloud_upload</span>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">{uploading ? 'Enviando...' : 'Alterar Imagem'}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <span className="material-icons-outlined text-3xl text-gray-300 mb-2">add_photo_alternate</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{uploading ? 'Enviando...' : 'Adicionar Imagem'}</span>
            </div>
          )}
          <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Produto</label>
            <input
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm font-medium py-2 px-3 outline-none"
              type="text"
              placeholder="Ex: Vestido Floral"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Preço (R$)</label>
              <input
                value={formData.price || ''}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm font-medium py-2 px-3 outline-none"
                type="number"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Preço Antigo</label>
              <input
                value={formData.old_price || ''}
                onChange={e => setFormData({ ...formData, old_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm font-medium py-2 px-3 outline-none"
                type="number"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Categoria</label>
            <select
              value={formData.category_id || ''}
              onChange={e => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm font-medium py-2 px-3 outline-none"
            >
              <option value="">Selecione...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descrição</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm font-medium resize-none py-2 px-3 outline-none"
              rows={3}
              placeholder="Breve descrição do produto..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tamanhos Disponíveis</label>
            <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              {SIZE_GROUPS.map(group => (
                <div key={group.name} className="space-y-2">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{group.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.sizes.map(size => {
                      const isSelected = formData.sizes?.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1 rounded border text-[10px] font-bold transition-all ${isSelected
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 text-gray-500 hover:border-primary dark:border-gray-700 dark:text-gray-400'
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

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_popular}
                onChange={e => setFormData({ ...formData, is_popular: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-primary transition-colors">Destaque</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_new}
                onChange={e => setFormData({ ...formData, is_new: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-primary transition-colors">Novidade</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 flex gap-3">
        <button
          onClick={() => setIsEditing(null)}
          className="flex-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={saveProduct}
          className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 transition-all flex justify-center items-center gap-2"
        >
          <span className="material-icons-outlined text-[18px]">save</span>
          Salvar
        </button>
      </div>
    </div>
  );

  const renderProductList = () => (
    <div className="flex-grow flex flex-col gap-6 w-full">
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <button
          onClick={() => setCategoryFilter('Todos')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${categoryFilter === 'Todos' ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary'}`}
        >
          Todos
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.name)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${categoryFilter === c.name ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary'}`}
          >
            {c.name}
          </button>
        ))}
      </div>
      {renderProductTable()}
    </div>
  );

  const renderOverview = () => {
    const totalInventoryValue = products.reduce((acc, p) => acc + p.price, 0);
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="inventory_2" label="Total Produtos" value={products.length.toString()} color="text-blue-500 bg-blue-500/10" />
          <StatCard icon="category" label="Categorias" value={categories.length.toString()} color="text-purple-500 bg-purple-500/10" />
          <StatCard icon="payments" label="Valor em Estoque" value={`R$ ${totalInventoryValue.toFixed(2).replace('.', ',')}`} color="text-green-500 bg-green-500/10" />
          <StatCard icon="trending_up" label="Destaques" value={products.filter(p => p.is_popular).length.toString()} color="text-orange-500 bg-orange-500/10" />
        </div>

        <div className="glass-panel p-8">
          <h3 className="text-xl font-bold mb-6 font-display text-gray-900 dark:text-white">Últimos Produtos</h3>
          <div className="space-y-4">
            {products.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">{p.category}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">R$ {p.price.toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCategories = () => (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 h-[calc(100vh-140px)]">
      <div className="xl:col-span-8 flex flex-col h-full">
        <div className="glass-panel flex-grow overflow-hidden flex flex-col">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4">Nome da Categoria</th>
                  <th className="px-6 py-4 text-right">Gerenciar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                {categories.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{c.name}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setIsEditingCategory(c.id); setCategoryFormData({ name: c.name }); }} className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><span className="material-icons-outlined text-[20px]">edit</span></button>
                        <button onClick={() => deleteCategory(c.id)} className="p-2 text-gray-400 hover:text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><span className="material-icons-outlined text-[20px]">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="xl:col-span-4 h-full">
        <div className="glass-panel p-6 h-full">
          <h3 className="text-lg font-bold mb-6 font-display text-gray-900 dark:text-white">{isEditingCategory ? (isEditingCategory === 'new' ? 'Nova Categoria' : 'Editar Categoria') : 'Painel de Categoria'}</h3>
          {isEditingCategory ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nome da Categoria</label>
                <input
                  value={categoryFormData.name}
                  onChange={e => setCategoryFormData({ name: e.target.value })}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm font-medium py-2 px-3 outline-none border"
                  placeholder="Ex: Meninos"
                />
              </div>
              <button onClick={saveCategory} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
                <span className="material-icons-outlined text-[18px]">save</span>
                {isEditingCategory === 'new' ? 'Criar Categoria' : 'Salvar Alterações'}
              </button>
              <button className="w-full text-gray-400 py-2 text-sm font-bold uppercase tracking-widest hover:text-gray-600 transition-colors" onClick={() => setIsEditingCategory(null)}>Cancelar</button>
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-icons-outlined text-5xl text-gray-200 mb-4">category</span>
              <p className="text-gray-400 text-sm font-medium">Selecione uma categoria para editar ou crie uma nova.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body transition-colors duration-300 min-h-screen flex overflow-hidden w-full">
      <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col h-screen fixed left-0 top-0 z-20">
        <div className="p-6 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="material-icons-outlined text-2xl">child_care</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-display text-gray-900 dark:text-white leading-none">Bitt Kids</span>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon="dashboard" label="Visão Geral" />
          <NavButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon="inventory_2" label="Produtos" />
          <NavButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon="category" label="Categorias" />
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-bold text-sm"
          >
            <span className="material-icons-outlined text-xl">logout</span>
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow md:ml-64 p-6 md:p-8 h-screen overflow-y-auto custom-scrollbar">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-display">
              {activeTab === 'overview' ? 'Visão Geral' : activeTab === 'products' ? 'Produtos' : 'Categorias'}
            </h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Gerenciamento Bitt Kids</p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'products' && (
              <>
                <div className="relative group">
                  <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-sm">search</span>
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm w-48 md:w-64 shadow-sm transition-all outline-none"
                    placeholder="Buscar produto..."
                    type="text"
                  />
                </div>
                <button
                  onClick={handleCreateProduct}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm"
                >
                  <span className="material-icons-outlined text-sm">add</span>
                  Novo Produto
                </button>
              </>
            )}
            {activeTab === 'categories' && (
              <button
                onClick={handleCreateCategory}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <span className="material-icons-outlined text-sm">add</span>
                Nova Categoria
              </button>
            )}
          </div>
        </header>

        {activeTab === 'overview' && renderOverview()}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-160px)]">
            <div className={`xl:col-span-8 h-full flex flex-col ${isEditing ? 'hidden xl:flex' : 'flex'}`}>
              {renderProductList()}
            </div>
            {(isEditing || !isEditing) && (
              <div className={`xl:col-span-4 h-full flex flex-col ${!isEditing ? 'hidden xl:flex' : 'flex'}`}>
                {isEditing ? renderEditPanel() : (
                  <div className="glass-panel flex items-center justify-center h-full text-center p-8">
                    <div>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                        <span className="material-icons-outlined text-3xl">touch_app</span>
                      </div>
                      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Editor de Produtos</h3>
                      <p className="text-gray-400 text-sm max-w-[240px]">Selecione um produto da lista ou crie um novo para começar a editar os detalhes aqui.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && renderCategories()}
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="glass-panel p-6">
    <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${color}`}>
      <span className="material-icons-outlined text-2xl">{icon}</span>
    </div>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{value}</p>
  </div>
);

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm ${active
      ? 'bg-primary-light dark:bg-primary/10 text-primary'
      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
  >
    <span className={`material-icons-outlined text-xl ${active ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>{icon}</span>
    <span>{label}</span>
  </button>
);

export default Admin;
