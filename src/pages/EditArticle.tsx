import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORIES = ['Desenvolvimento web', 'DevOps', 'Inteligência Artificial', 'Mobile', 'Segurança'];

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle]       = useState('');
  const [summary, setSummary]   = useState('');
  const [category, setCategory] = useState('Desenvolvimento web');
  const [content, setContent]   = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags]         = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get(`/articles/${id}`)
      .then(r => {
        const a = r.data;
        setTitle(a.title || '');
        setSummary(a.summary || '');
        setCategory(a.category || 'Desenvolvimento web');
        setContent(a.content || '');
        try { setTags(Array.isArray(a.tags) ? a.tags : (a.tags ? JSON.parse(a.tags) : [])); } catch { setTags([]); }
      })
      .catch(() => toast.error('Artigo não encontrado'))
      .finally(() => setFetching(false));
  }, [id]);

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime  = Math.max(1, Math.ceil(wordCount / 200));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('summary', summary);
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags));
    if (imageFile) formData.append('banner', imageFile);
    setLoading(true);
    try {
      await api.put(`/articles/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Artigo atualizado!');
      navigate('/dashboard');
    } catch { toast.error('Erro ao atualizar artigo'); }
    finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', borderRadius: '6px', padding: '10px 14px',
    width: '100%', outline: 'none', fontFamily: 'Inter, sans-serif',
    fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '6px',
  };

  if (fetching) return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: '760px', margin: '0 auto', width: '100%', padding: '2.5rem 1.5rem' }}>

        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none', marginBottom: '2rem' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </Link>

        <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Editar Artigo</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px', marginBottom: '2rem' }}>
          Atualize as informações do seu artigo
        </p>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '1.75rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          {/* Título */}
          <div>
            <label style={labelStyle}>Título do Artigo *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#00CFCF')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Resumo */}
          <div>
            <label style={labelStyle}>Resumo *</label>
            <textarea rows={3} value={summary} onChange={e => setSummary(e.target.value.slice(0, 120))}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => (e.target.style.borderColor = '#00CFCF')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'right', marginTop: '4px' }}>
              {summary.length}/120 caracteres
            </p>
          </div>

          {/* Categoria */}
          <div>
            <label style={labelStyle}>Categoria *</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Imagem */}
          <div>
            <label style={labelStyle}>Imagem de Capa</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)}
              style={{ ...inputStyle, cursor: 'pointer' }} />
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input type="text" value={tagInput} placeholder="Ex: TypeScript"
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => (e.target.style.borderColor = '#00CFCF')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              <button type="button" onClick={addTag}
                style={{ padding: '10px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <Plus size={14} />
              </button>
            </div>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tags.map(tag => (
                  <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '999px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {tag}
                    <button type="button" onClick={() => setTags(t => t.filter(x => x !== tag))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div>
            <label style={labelStyle}>Conteúdo do Artigo *</label>
            <textarea rows={14} value={content} onChange={e => setContent(e.target.value.slice(0, 8000))}
              placeholder="## Título&#10;&#10;Escreva em Markdown..."
              style={{ ...inputStyle, resize: 'none', fontFamily: 'monospace' }}
              onFocus={e => (e.target.style.borderColor = '#00CFCF')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
              {content.length}/8000 caracteres • {wordCount} palavras • {readTime} minutos de leitura
            </p>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button type="submit" disabled={loading}
              style={{ flex: 1, padding: '12px', backgroundColor: '#00CFCF', color: '#111111', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Inter, sans-serif' }}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')}
              style={{ padding: '12px 24px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Cancelar
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}