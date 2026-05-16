import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Eye, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { Article, Comment } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ArticleDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/articles/${id}`),
      api.get(`/articles/${id}/comments`),
    ])
      .then(([artRes, comRes]) => {
        setArticle(artRes.data);
        setComments(comRes.data);
      })
      .catch(() => toast.error('Erro ao carregar artigo'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleLike() {
    if (liked) return;
    try {
      await api.post(`/articles/${id}/like`);
      setLiked(true);
      setArticle(prev => prev ? { ...prev, likes: (prev.likes ?? 0) + 1 } : prev);
      toast.success('Curtida registrada!');
    } catch { toast.error('Erro ao curtir'); }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/articles/${id}/comments`, { content: comment });
      const { data } = await api.get(`/articles/${id}/comments`);
      setComments(data);
      setComment('');
      toast.success('Comentário publicado!');
    } catch { toast.error('Erro ao publicar comentário'); }
    finally { setSubmitting(false); }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copiado!');
  }

  if (loading) return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Carregando artigo...</p>
    </div>
  );

  if (!article) return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Artigo não encontrado.</p>
    </div>
  );

  const readTime = Math.max(1, Math.ceil((article.content?.split(' ').length || 100) / 200));
  const date = new Date(article.created_at).toLocaleDateString('pt-BR');

  // Parse seguro de tags
  let tags: string[] = [];
  try {
    if (Array.isArray(article.tags)) tags = article.tags;
    else if (typeof article.tags === 'string' && article.tags) tags = JSON.parse(article.tags);
  } catch { tags = []; }

  // Banner: converte buffer do MySQL para base64
  function getBannerSrc() {
    if (!article!.banner_image) return null;
    if (typeof article!.banner_image === 'string') {
      // já é base64 string
      if (article!.banner_image.startsWith('data:')) return article!.banner_image;
      return `data:image/jpeg;base64,${article!.banner_image}`;
    }
    // é um objeto buffer vindo do MySQL
    const buf = article!.banner_image as unknown as { type: string; data: number[] };
    if (buf?.data) {
      const bytes = new Uint8Array(buf.data);
      const binary = bytes.reduce((acc, b) => acc + String.fromCharCode(b), '');
      return `data:image/jpeg;base64,${btoa(binary)}`;
    }
    return null;
  }
  const bannerSrc = getBannerSrc();

  const isOwner = user?.id === article.author_id;

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: '720px', margin: '0 auto', width: '100%', padding: '2.5rem 1.5rem' }}>

        {/* Voltar */}
        <Link to="/articles"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '2rem', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
          <ArrowLeft size={16} /> Voltar aos Artigos
        </Link>

        {/* Badge de categoria */}
        {article.category && (
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              backgroundColor: '#F4845F', color: '#111111',
              fontSize: '12px', fontWeight: 600,
              padding: '4px 12px', borderRadius: '4px',
              display: 'inline-block',
            }}>
              {article.category}
            </span>
          </div>
        )}

        {/* Título - Ajustado para quebra de texto e tema */}
        <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '1rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {article.title}
        </h1>

        {/* Resumo - Ajustado para quebra de texto e tema */}
        {article.summary && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            {article.summary}
          </p>
        )}

        {/* Linha do autor */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: '1rem', marginBottom: '1rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatar */}
            {(article as any).author_avatar ? (
              <img src={(article as any).author_avatar} alt={article.author_name}
                   style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: '#00CFCF', color: '#111111',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '16px',
              }}>
                {article.author_name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, margin: 0 }}>{article.author_name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>{date} • {readTime}min de leitura</p>
            </div>
          </div>

          {/* Ações do artigo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={handleLike} title="Curtir"
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: liked ? '#ef4444' : 'var(--text-secondary)', fontSize: '14px', padding: 0 }}>
              <Heart size={18} fill={liked ? '#ef4444' : 'none'} />
            </button>
            <button title="Salvar"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}>
              <Bookmark size={18} />
            </button>
            <button onClick={handleShare} title="Compartilhar"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}>
              <Share2 size={18} />
            </button>
            {/* Editar — só para o autor */}
            {isOwner && (
              <button onClick={() => navigate(`/articles/${article.id}/edit`)}
                style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: '6px', fontSize: '12px' }}>
                Editar
              </button>
            )}
          </div>
        </div>

        {/* Contadores */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <Heart size={14} /> {article.likes ?? 0} curtidas
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <Eye size={14} /> {article.views ?? 0} visualizações
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <MessageCircle size={14} /> {comments.length} comentários
          </span>
        </div>

        {/* Banner */}
        {bannerSrc && (
          <div style={{ marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden' }}>
            <img src={bannerSrc} alt={article.title}
                 style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        {/* Conteúdo Markdown - Ajustado para tema e quebra de texto */}
        <div style={{ marginBottom: '2rem', lineHeight: 1.8, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          <ReactMarkdown
            components={{
              h1: ({ ...p }) => <h1 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.5rem', margin: '1.5rem 0 0.75rem', wordBreak: 'break-word' }} {...p} />,
              h2: ({ ...p }) => <h2 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.2rem', margin: '1.5rem 0 0.75rem', wordBreak: 'break-word' }} {...p} />,
              h3: ({ ...p }) => <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, margin: '1rem 0 0.5rem', wordBreak: 'break-word' }} {...p} />,
              p:  ({ ...p }) => <p  style={{ color: 'var(--text-secondary)', marginBottom: '1rem', wordBreak: 'break-word' }} {...p} />,
              strong: ({ ...p }) => <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }} {...p} />,
              ul: ({ ...p }) => <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem', wordBreak: 'break-word' }} {...p} />,
              ol: ({ ...p }) => <ol style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem', wordBreak: 'break-word' }} {...p} />,
              li: ({ ...p }) => <li style={{ marginBottom: '4px', wordBreak: 'break-word' }} {...p} />,
              code: ({ ...p }) => <code style={{ backgroundColor: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85em', color: '#00CFCF', fontFamily: 'monospace', wordBreak: 'break-word' }} {...p} />,
              blockquote: ({ ...p }) => <blockquote style={{ borderLeft: '3px solid #00CFCF', paddingLeft: '1rem', color: 'var(--text-muted)', margin: '1rem 0', fontStyle: 'italic', wordBreak: 'break-word' }} {...p} />,
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            {tags.map((tag: string) => (
              <span key={tag} style={{
                backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: '12px',
                padding: '4px 12px', borderRadius: '999px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── SEÇÃO DE COMENTÁRIOS ── */}
        <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageCircle size={18} /> Comentário ({comments.length})
          </h3>

          {/* Input de comentário — logado */}
          {isAuthenticated ? (
            <form onSubmit={handleComment} style={{ marginBottom: '1.5rem' }}>
              <textarea
                rows={3}
                placeholder="Escreva seu comentário..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{
                  width: '100%', 
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border)', 
                  borderRadius: '8px',
                  color: 'var(--text-primary)', 
                  padding: '12px 14px', fontSize: '14px',
                  fontFamily: 'Inter, sans-serif', resize: 'none', outline: 'none',
                  marginBottom: '12px', boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#00CFCF')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              <button type="submit" disabled={submitting}
                style={{
                  backgroundColor: '#00CFCF', color: '#111111',
                  border: 'none', borderRadius: '8px',
                  padding: '10px 20px', fontSize: '14px', fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                }}>
                {submitting ? 'Publicando...' : 'Publicar Comentário'}
              </button>
            </form>
          ) : (
            /* Não logado */
            <div style={{
              backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem',
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>Faça login para comentar</p>
              <Link to="/login"
                style={{
                  backgroundColor: '#00CFCF', color: '#111111',
                  padding: '8px 20px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                }}>
                Fazer login
              </Link>
            </div>
          )}

          {/* Lista de comentários */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '2rem 0' }}>
                Seja o primeiro a comentar!
              </p>
            )}

            {comments.map(c => (
              <div key={c.id} style={{
                backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {(c as any).author_avatar ? (
                      <img src={(c as any).author_avatar} alt={c.author_name}
                           style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: '#00CFCF', color: '#111111',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '14px', flexShrink: 0,
                      }}>
                        {c.author_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, margin: 0 }}>{c.author_name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>
                        {new Date(c.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    <Heart size={12} /> {c.likes}
                  </span>
                </div>
                {/* Comentário - Ajustado para quebra de texto e cor do tema */}
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}