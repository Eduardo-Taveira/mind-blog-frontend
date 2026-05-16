import { useState, useEffect } from 'react';
import { Search, Grid, List } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import type { Article } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';

const CATEGORIES = ['Todos', 'Desenvolvimento web', 'DevOps', 'Inteligência Artificial', 'Mobile', 'Segurança'];

export default function Articles() {
  const { isDark } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/articles')
      .then(r => setArticles(r.data))
      .catch(() => toast.error('Erro ao carregar artigos'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles
    .filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
    .filter(a => category === 'Todos' || a.category === category);

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: '8px', padding: '10px 14px 10px 40px',
    fontSize: '14px', outline: 'none', width: '100%',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: '1152px', margin: '0 auto', width: '100%', padding: '2.5rem 1.5rem' }}>

        <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 700, margin: 0 }}>
          Todos os Artigos
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', marginBottom: '2rem' }}>
          Explore nossa coleção completa de artigos técnicos
        </p>

        {/* Controles: busca + filtro + toggle view */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', flexWrap: 'wrap' }}>

          {/* Busca */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
            }} />
            <input
              type="text" placeholder="Buscar artigos..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#00CFCF')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Filtro de categoria */}
          <div style={{ position: 'relative' }}>
            <select
              value={category} onChange={e => setCategory(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '8px', padding: '10px 36px 10px 16px',
                fontSize: '14px', outline: 'none', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', minWidth: '180px',
                appearance: 'none',
              }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>▾</span>
          </div>

          {/* Toggle grid/lista */}
          <div style={{
            display: 'flex', gap: '4px', padding: '4px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)', borderRadius: '8px',
          }}>
            {(['grid', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{
                  padding: '6px 10px', borderRadius: '6px', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  backgroundColor: view === v ? '#00CFCF' : 'transparent',
                  color: view === v ? '#111111' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                }}>
                {v === 'grid' ? <Grid size={16} /> : <List size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Skeletons de loading */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: '280px', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        )}

        {/* Sem resultados */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Nenhum artigo encontrado.
          </div>
        )}

        {/* Lista de artigos */}
        {!loading && filtered.length > 0 && (
          <div style={view === 'grid'
            ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }
            : { display: 'flex', flexDirection: 'column', gap: '1rem' }
          }>
            {filtered.map(article => (
              <ArticleCard key={article.id} article={article} view={view} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}