import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Settings, LogOut, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setShowDropdown(false);
    navigate('/');
  }

  return (
    <nav style={{
      backgroundColor: 'var(--nav-bg)',
      borderBottom: '1px solid var(--nav-border)',
      position: 'sticky', top: 0, zIndex: 50,
      padding: '0 1.5rem',
      transition: 'background-color 0.2s',
    }}>
      <div style={{
        maxWidth: '1152px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px',
      }}>

        {/* Logo */}
        <Link to="/" style={{
          color: 'var(--text-primary)', fontWeight: 700,
          fontSize: '1.2rem', fontFamily: 'monospace', textDecoration: 'none',
        }}>
          &lt;M/&gt;
        </Link>

        {/* Direita */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            Home
          </Link>
          <Link to="/articles" style={{ color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            Artigos
          </Link>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border)' }} />

          {/* Botão tema — alterna dark/light */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', padding: 0, display: 'flex',
            }}>
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Não logado */}
          {!isAuthenticated && (
            <>
              <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none' }}>
                Entrar
              </Link>
              <Link to="/register" style={{
                backgroundColor: '#00CFCF', color: '#111111',
                fontSize: '14px', fontWeight: 600,
                padding: '6px 16px', borderRadius: '6px', textDecoration: 'none',
              }}>
                Cadastrar
              </Link>
            </>
          )}

          {/* Logado */}
          {isAuthenticated && user && (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name}
                    style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00CFCF' }} />
                ) : (
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    backgroundColor: '#00CFCF', color: '#111111',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '14px',
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                  width: '220px', borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                  overflow: 'hidden', zIndex: 100,
                }}>
                  {/* Cabeçalho */}
                  <div style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: '#00CFCF', color: '#111111',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '14px',
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Login with Email */}
                  <div style={{ padding: '8px 16px 4px', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>Login with Email</p>
                  </div>

                  {/* Links */}
                  <div style={{ padding: '4px 0' }}>
                    {[
                      { to: '/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
                      { to: '/settings',  icon: <Settings size={15} />,        label: 'Configurações' },
                    ].map(item => (
                      <Link key={item.to} to={item.to}
                        onClick={() => setShowDropdown(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 16px', color: 'var(--text-secondary)',
                          fontSize: '13px', textDecoration: 'none',
                          transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                        {item.icon} {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Sair */}
                  <div style={{ borderTop: '1px solid var(--border)', padding: '4px 0' }}>
                    <button onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 16px', color: '#f87171', fontSize: '13px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        width: '100%', textAlign: 'left', fontFamily: 'Inter, sans-serif',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <LogOut size={15} /> Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}