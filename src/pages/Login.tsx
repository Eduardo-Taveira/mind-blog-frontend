import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error('Preencha todos os campos'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      toast.success(`Bem-vindo, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  const inputBase: React.CSSProperties = {
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: '6px', padding: '10px 14px',
    width: '100%', outline: 'none',
    fontFamily: 'Inter, sans-serif', fontSize: '14px',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Logo + título */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '2rem', fontFamily: 'monospace', marginBottom: '1rem' }}>
              &lt;M/&gt;
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
              Entrar na Plataforma
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
              Acesse sua conta para gerenciar seus artigos
            </p>
          </div>

          {/* Card do formulário */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px', padding: '1.75rem',
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Email */}
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '6px' }}>
                  Email
                </label>
                <input type="email" placeholder="exemplo@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={inputBase}
                  onFocus={e => (e.target.style.borderColor = '#00CFCF')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>

              {/* Senha com toggle de visibilidade */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Senha</label>
                  <a href="#" style={{ color: 'var(--text-muted)', fontSize: '12px', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    Esqueceu a senha?
                  </a>
                </div>
                {/* Wrapper com posição relativa para o ícone */}
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ ...inputBase, paddingRight: '42px' }}
                    onFocus={e => (e.target.style.borderColor = '#00CFCF')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />
                  {/* Botão olho */}
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    title={showPass ? 'Esconder senha' : 'Mostrar senha'}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', padding: 0, display: 'flex',
                    }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Botão entrar */}
              <button type="submit" disabled={loading}
                style={{
                  backgroundColor: '#00CFCF', color: '#111111',
                  border: 'none', borderRadius: '8px',
                  padding: '12px', fontSize: '14px', fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontFamily: 'Inter, sans-serif', marginTop: '4px',
                  width: '100%',
                }}>
                <LogIn size={16} />
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Não tem uma conta?{' '}
              <Link to="/register" style={{ color: '#00CFCF', fontWeight: 600 }}>
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}