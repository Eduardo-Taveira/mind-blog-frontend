import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import type { Article } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';

export default function Home() {
  const { isDark } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    api.get('/articles').then(r => setArticles(r.data));
  }, []);

  const featured = articles.slice(0, 4);
  const recent   = articles.slice(0, 4);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '7rem 1.5rem',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: `1px solid var(--border)`,
      }}>
        <h1 style={{
          color: 'var(--text-primary)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 700, lineHeight: 1.2,
          marginBottom: '1rem', maxWidth: '700px',
        }}>
          Explore o Futuro da{' '}
          <span style={{ color: '#00CFCF' }}>Tecnologia</span>
        </h1>
        <p style={{
          color: 'var(--text-secondary)', fontSize: '1.1rem',
          maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.6,
        }}>
          Artigos sobre IA, desenvolvimento, DevOps e as últimas tendências tecnológicas
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/articles" style={{
            backgroundColor: '#00CFCF', color: '#111111',
            padding: '12px 28px', borderRadius: '8px',
            fontWeight: 600, fontSize: '15px', textDecoration: 'none',
          }}>
            Explorar Artigos
          </Link>
          <Link to="/register" style={{
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            padding: '12px 28px', borderRadius: '8px',
            fontWeight: 500, fontSize: '15px', textDecoration: 'none',
          }}>
            Começar a Escrever
          </Link>
        </div>
      </section>

      <main style={{ flex: 1, maxWidth: '1152px', margin: '0 auto', width: '100%', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>

        {/* Artigos em Destaque */}
        {featured.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                  Artigos em Destaque
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                  Os melhores conteúdos selecionados para você
                </p>
              </div>
              <Link to="/articles" style={{
                color: '#00CFCF', fontSize: '14px', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {featured.map(article => (
                <ArticleCard key={article.id} article={article} view="grid" />
              ))}
            </div>
          </section>
        )}

        {/* Artigos Recentes */}
        {recent.length > 0 && (
          <section>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                Artigos Recentes
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                Conteúdo recente da comunidade
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {recent.map(article => (
                <ArticleCard key={article.id} article={article} view="grid" />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px', padding: '3rem', textAlign: 'center',
        }}>
          <Mail size={32} style={{ color: '#00CFCF', margin: '0 auto 1rem' }} />
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
            Newsletter Semanal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Receba os melhores artigos de tecnologia diretamente no seu email. Sem spam, apenas conteúdo de qualidade.
          </p>
          <div style={{ display: 'flex', gap: '12px', maxWidth: '380px', margin: '0 auto' }}>
            <input type="email" placeholder="exemplo@email.com"
              style={{
                flex: 1, backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border)', color: 'var(--text-primary)',
                borderRadius: '8px', padding: '10px 14px', fontSize: '14px',
                outline: 'none', fontFamily: 'Inter, sans-serif',
              }} />
            <button style={{
              backgroundColor: '#00CFCF', color: '#111111',
              border: 'none', borderRadius: '8px',
              padding: '10px 20px', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'Inter, sans-serif',
            }}>
              Inscrever
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '12px' }}>
            Mais de 10.000 desenvolvedores já recebem nossa newsletter
          </p>
        </section>

        {/* CTA */}
        <section style={{
          background: isDark
            ? 'linear-gradient(135deg, #0a2a2a, #111111)'
            : 'linear-gradient(135deg, #e0fafa, #f9fafb)',
          border: '1px solid var(--border)',
          borderRadius: '16px', padding: '3rem', textAlign: 'center',
        }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
            Compartilhe Seu Conhecimento
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Junte-se à nossa comunidade de escritores e compartilhe suas experiências e conhecimentos em tecnologia
          </p>
          <Link to="/register" style={{
            display: 'inline-block',
            backgroundColor: '#00CFCF', color: '#111111',
            padding: '12px 28px', borderRadius: '8px',
            fontWeight: 600, fontSize: '15px', textDecoration: 'none',
          }}>
            Criar Conta Gratuita
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}