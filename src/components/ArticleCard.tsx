import { useNavigate } from 'react-router-dom';
import { Clock, Eye, Heart } from 'lucide-react';
import type { Article } from '../types';

interface Props {
  article: Article;
  view: 'grid' | 'list';
}

// Converte o buffer de imagem do MySQL para URL exibível
function getBannerUrl(banner: Article['banner_image']): string | null {
  if (!banner) return null;
  if (typeof banner === 'string') return `data:image/jpeg;base64,${banner}`;
  if (typeof banner === 'object') {
    const bytes = Object.values(banner as Record<string, number>);
    const blob = new Blob([new Uint8Array(bytes)]);
    return URL.createObjectURL(blob);
  }
  return null;
}

// Placeholder visual quando não há imagem (igual ao Figma)
function Placeholder() {
  return (
    <div className="w-full h-full flex items-center justify-center"
         style={{ backgroundColor: '#F4845F' }}>
      <span className="font-bold text-2xl text-black font-serif">Lorem ipsum</span>
    </div>
  );
}

export default function ArticleCard({ article, view }: Props) {
  const navigate = useNavigate();
  const bannerUrl = getBannerUrl(article.banner_image);
  const readTime = Math.max(1, Math.ceil((article.content?.split(' ').length || 100) / 200));
  const date = new Date(article.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  function handleClick() {
    navigate(`/articles/${article.id}`);
  }

  // ── MODO GRID ──
  if (view === 'grid') {
    return (
      <div
        onClick={handleClick}
        className="rounded-xl overflow-hidden cursor-pointer transition-transform hover:-translate-y-1"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {/* Imagem do artigo */}
        <div className="h-48 overflow-hidden">
          {bannerUrl
            ? <img src={bannerUrl} alt={article.title} className="w-full h-full object-cover" />
            : <Placeholder />
          }
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          {/* Badge de categoria + data */}
          <div className="flex items-center justify-between mb-2">
            {article.category && (
              <span className="text-xs px-2 py-1 rounded font-medium"
                    style={{ backgroundColor: '#2a1a0a', color: '#F4845F' }}>
                {article.category}
              </span>
            )}
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{date}</span>
          </div>

          {/* Título */}
          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
            {article.title}
          </h3>

          {/* Resumo */}
          {article.summary && (
            <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {article.summary}
            </p>
          )}

          {/* Rodapé do card: autor + métricas */}
          <div className="flex items-center justify-between pt-3"
               style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{article.author_name}</span>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1"><Clock size={11} />{readTime}min</span>
              <span className="flex items-center gap-1"><Eye size={11} />{article.views ?? 0}</span>
              <span className="flex items-center gap-1"><Heart size={11} />{article.likes ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MODO LISTA ──
  return (
    <div
      onClick={handleClick}
      className="flex gap-4 rounded-xl overflow-hidden cursor-pointer p-4 transition-transform hover:-translate-y-1"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      {/* Imagem menor à esquerda */}
      <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
        {bannerUrl
          ? <img src={bannerUrl} alt={article.title} className="w-full h-full object-cover" />
          : <Placeholder />
        }
      </div>

      {/* Conteúdo à direita */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {article.category && (
            <span className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{ backgroundColor: '#2a1a0a', color: '#F4845F' }}>
              {article.category}
            </span>
          )}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{date}</span>
        </div>
        <h3 className="font-semibold text-sm mb-1 truncate" style={{ color: 'var(--text-primary)' }}>{article.title}</h3>
        {article.summary && (
          <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--text-secondary)' }}>{article.summary}</p>
        )}
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{article.author_name}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{readTime}min</span>
          <span className="flex items-center gap-1"><Eye size={11} />{article.views ?? 0}</span>
          <span className="flex items-center gap-1"><Heart size={11} />{article.likes ?? 0}</span>
        </div>
      </div>
    </div>
  );
}