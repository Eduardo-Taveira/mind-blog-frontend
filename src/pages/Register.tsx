import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Register() {

  const navigate = useNavigate();

  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass]           = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos'); return;
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem'); return;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres'); return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Conta criada! Faça login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao criar conta');
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

  // Campo com toggle de olho reutilizável
  function PasswordField({
    label, value, onChange, show, onToggle, placeholder = '••••••••'
  }: {
    label: string; value: string;
    onChange: (v: string) => void;
    show: boolean; onToggle: () => void;
    placeholder?: string;
  }) {
    return (
      <div>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '6px' }}>
          {label}
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={show ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{ ...inputBase, paddingRight: '42px' }}
            onFocus={e => (e.target.style.borderColor = '#00CFCF')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          <button type="button" onClick={onToggle}
            title={show ? 'Esconder senha' : 'Mostrar senha'}
            style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 0, display: 'flex',
            }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '2rem', fontFamily: 'monospace', marginBottom: '1rem' }}>
              &lt;M/&gt;
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
              Criar Conta
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
              Junte-se à comunidade e comece a escrever
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px', padding: '1.75rem',
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Nome */}
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '6px' }}>
                  Nome Completo
                </label>
                <input type="text" placeholder="John Doe"
                  value={name} onChange={e => setName(e.target.value)}
                  style={inputBase}
                  onFocus={e => (e.target.style.borderColor = '#00CFCF')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>

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

              {/* Senha com olho */}
              <PasswordField
                label="Senha"
                value={password}
                onChange={setPassword}
                show={showPass}
                onToggle={() => setShowPass(!showPass)}
              />

              {/* Confirmar senha com olho */}
              <PasswordField
                label="Confirmar senha"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirm}
                onToggle={() => setShowConfirm(!showConfirm)}
              />

              <button type="submit" disabled={loading}
                style={{
                  backgroundColor: '#00CFCF', color: '#111111',
                  border: 'none', borderRadius: '8px',
                  padding: '12px', fontSize: '14px', fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontFamily: 'Inter, sans-serif', marginTop: '4px', width: '100%',
                }}>
                <UserPlus size={16} />
                {loading ? 'Criando...' : 'Criar conta'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Já tem uma conta?{' '}
              <Link to="/login" style={{ color: '#00CFCF', fontWeight: 600 }}>
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}