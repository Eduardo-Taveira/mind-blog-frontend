import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Settings, Pencil, Trash2, FileText, Heart, Eye, Clock, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { Article } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DeleteModal from '../components/DeleteModal';

// Converte o banner (Buffer do MySQL ou base64 string) para URL exibível
function getBannerUrl(banner: unknown): string | null {
  if (!banner) return null;
  if (typeof banner === 'string') {
    return banner.startsWith('data:') ? banner : `data:image/jpeg;base64,${banner}`;
  }
  const buf = banner as { type?: string; data?: number[] };
  if (buf?.data) {
    const bytes = new Uint8Array(buf.data);
    const binary = bytes.reduce((acc, b) => acc + String.fromCharCode(b), '');
    return `data:image/jpeg;base64,${btoa(binary)}`;
  }
  return null;
}

interface RecentActivity {
  id: number;
  author_name: string;
  author_avatar?: string;
  article_title: string;
  article_id: number;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await api.get('/articles');
        const mine: Article[] = data.filter((a: Article) => a.author_id === user?.id);
        setArticles(mine);

        // Busca comentários de cada artigo do usuário para montar a atividade recente
        const allActivity: RecentActivity[] = [];
        await Promise.all(
          mine.map(async (article) => {
            try {
              const { data: comments } = await api.get(`/articles/${article.id}/comments`);
              comments.forEach((c: any) => {
                allActivity.push({
                  id: c.id,
                  author_name: c.author_name,
                  author_avatar: c.author_avatar,
                  article_title: article.title,
                  article_id: article.id,
                  created_at: c.created_at,
                });
              });
            } catch {
              // ignora erro de comentários de um artigo específico
            }
          })
        );

        // Ordena do mais recente para o mais antigo
        allActivity.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecentActivity(allActivity);
      } finally {
        setLoading(false);
      }
    }

    if (user) loadData();
  }, [user]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/articles/${deleteId}`);
      setArticles(prev => prev.filter(a => a.id !== deleteId));
      toast.success('Artigo excluído');
      setDeleteId(null);
    } catch {
      toast.error('Erro ao excluir artigo');
    } finally {
      setDeleting(false);
    }
  }

  // Stats calculados a partir dos artigos do usuário
  const totalLikes = articles.reduce((s, a) => s + (a.likes ?? 0), 0);
  const totalViews = articles.reduce((s, a) => s + (a.views ?? 0), 0);
  const avgRead = articles.length
    ? Math.ceil(
        articles.reduce(
          (s, a) => s + Math.ceil((a.content?.split(' ').length || 100) / 200),
          0
        ) / articles.length
      )
    : 0;

  // Formata tempo relativo: "5 min atrás", "2 dias atrás", etc.
  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)   return 'agora mesmo';
    if (mins < 60)  return `${mins} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days} dia${days > 1 ? 's' : ''} atrás`;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: '1152px', margin: '0 auto', width: '100%', padding: '2.5rem 1.5rem' }}>

        {/* ── Cabeçalho ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 700, margin: 0 }}>Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>
              Bem-vindo de volta, {user?.name}!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/settings" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '8px',
              color: 'var(--text-secondary)', fontSize: '14px',
              border: '1px solid var(--border)', textDecoration: 'none',
            }}>
              <Settings size={15} /> Configurações
            </Link>
            <Link to="/articles/new" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '8px',
              backgroundColor: '#00CFCF', color: '#111111',
              fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            }}>
              <Plus size={15} /> Novo Artigo
            </Link>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '2rem' }}>
          {[
            { label: 'Total de Artigos',      value: articles.length,  icon: <FileText size={18} /> },
            { label: 'Engajamento',           value: totalViews,       icon: <Eye size={18} /> },
            { label: 'Curtidas',              value: totalLikes,       icon: <Heart size={18} /> },
            { label: 'Tempo médio de leitura',value: `${avgRead} min`, icon: <Clock size={18} /> },
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{stat.label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{stat.icon}</span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Linha principal: Meus Artigos + Atividade Recente ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

          {/* Meus Artigos — ocupa 2/3 da largura */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px', padding: '1.5rem',
          }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, margin: '0 0 1.25rem' }}>
              Meus Artigos
            </h2>

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ height: '64px', borderRadius: '8px', backgroundColor: 'var(--border)' }} />
                ))}
              </div>
            )}

            {!loading && articles.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Você ainda não publicou nenhum artigo.</p>
                <Link to="/articles/new" style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                  backgroundColor: '#00CFCF', color: '#111111', textDecoration: 'none'
                }}>
                  Criar primeiro artigo
                </Link>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {articles.map(article => (
                <div key={article.id} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '1rem', borderRadius: '8px',
                  border: '1px solid var(--border)',
                  marginBottom: '12px',
                }}>
                  {/* thumbnail */}
                  <div style={{ width: '56px', height: '56px', borderRadius: '8px', flexShrink: 0, backgroundColor: '#F4845F', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => {
                      const src = getBannerUrl(article.banner_image);
                      return src
                        ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ color: '#111', fontWeight: 700, fontSize: '11px' }}>IMG</span>;
                    })()}
                  </div>
                  
                  {/* info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {article.summary || article.content?.slice(0, 70)}...
                    </p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      <span>{new Date(article.created_at).toLocaleDateString('pt-BR')}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageCircle size={10} /> 0</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={10} /> {article.likes ?? 0}</span>
                    </div>
                  </div>
                  
                  {/* ações */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => navigate(`/articles/${article.id}/edit`)} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
                      color: 'var(--text-secondary)', background: 'none',
                      border: '1px solid var(--border)', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      <Pencil size={12} /> Editar
                    </button>
                    <button onClick={() => setDeleteId(article.id!)} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
                      color: '#f87171', background: 'none',
                      border: '1px solid #3a1a1a', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      <Trash2 size={12} /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Atividade Recente — 1/3 da largura */}
          <div style={{
            backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '1.5rem',
          }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, marginBottom: '1.25rem', margin: '0 0 1.25rem' }}>
              Atividade Recente
            </h2>

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--border)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '10px', backgroundColor: 'var(--border)', borderRadius: '4px', marginBottom: '6px' }} />
                      <div style={{ height: '10px', backgroundColor: 'var(--border)', borderRadius: '4px', width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && recentActivity.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>Nenhuma atividade ainda.</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                  Comentários nos seus artigos aparecerão aqui.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {recentActivity.slice(0, 6).map((activity, idx) => (
                <div key={`${activity.id}-${idx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>

                  {/* Avatar do comentador */}
                  {activity.author_avatar ? (
                    <img src={activity.author_avatar} alt={activity.author_name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                      backgroundColor: 'var(--border)', color: 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '13px',
                    }}>
                      {activity.author_name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Texto */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{activity.author_name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}> comentou em </span>
                      <Link
                        to={`/articles/${activity.article_id}`}
                        style={{ color: '#00CFCF', fontWeight: 500, textDecoration: 'none', fontSize: '13px' }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
                        {activity.article_title.length > 30
                          ? activity.article_title.slice(0, 30) + '...'
                          : activity.article_title}
                      </Link>
                    </p>
                    {/* Tempo relativo */}
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageCircle size={10} />
                      {timeAgo(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Fim do Grid Principal */}
        </div>
      </main>

      {deleteId && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={deleting}
        />
      )}

      <Footer />
    </div>
  );
}