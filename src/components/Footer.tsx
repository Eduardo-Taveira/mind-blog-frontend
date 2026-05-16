import { Link } from 'react-router-dom';
import { Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
      transition: 'background-color 0.2s',
    }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>

            {/* Esquerda */}
            <div style={{ maxWidth: '280px' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'monospace' }}>
                &lt;M/&gt;
              </span>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '8px', lineHeight: 1.6 }}>
                Seu portal de tecnologia com artigos, tutoriais e novidades do mundo tech.
              </p>
            </div>

            {/* Direita */}
            <div style={{ display: 'flex', gap: '4rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginBottom: '1rem' }}>
                  Navegação
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[['/', 'Home'], ['/articles', 'Artigos'], ['/dashboard', 'Dashboard']].map(([to, label]) => (
                    <Link key={to} to={to} style={{ color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginBottom: '1rem' }}>
                  Contatos
                </h4>
                {/* AQUI ESTÁ A CORREÇÃO: Usando apenas os ícones importados */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[<Globe size={18} key="globe" />, <Mail size={18} key="mail" />].map((icon, i) => (
                    <a key={i} href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
              © 2026 TechBlog. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}