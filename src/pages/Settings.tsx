import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Settings() {
  const { user, login, token } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get('/auth/profile')
      .then(r => {
        setName(r.data.name || '');
        setEmail(r.data.email || '');
        setBio(r.data.bio || '');
        setAvatarUrl(r.data.avatar_url || '');
        setAvatarPreview(r.data.avatar_url || '');
      })
      .finally(() => setFetching(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name, email, bio, avatar_url: avatarUrl,
      });
      if (token) login(token, data);
      setAvatarPreview(avatarUrl);
      toast.success('Perfil atualizado com sucesso!');
    } catch {
      toast.error('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    color: '#ffffff',
    borderRadius: '6px',
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  if (fetching) return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6b7280' }}>Carregando...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: '760px', margin: '0 auto', width: '100%', padding: '2.5rem 1.5rem' }}>

        {/* Voltar */}
        <Link to="/dashboard"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '14px', marginBottom: '2rem', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </Link>

        <div style={{ borderBottom: '1px solid #2a2a2a', marginBottom: '2rem', paddingBottom: '1rem' }}>
          <h1 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Configurações do Perfil</h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Gerencie suas informações pessoais</p>
        </div>

        {/* Card principal */}
        <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '2rem' }}>
          <form onSubmit={handleSave}>

            {/* Foto de perfil — centralizada */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
              {/* Preview da imagem */}
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  onError={() => setAvatarPreview('')}
                  style={{
                    width: '96px', height: '96px', borderRadius: '50%',
                    objectFit: 'cover', border: '3px solid #00CFCF',
                    marginBottom: '1rem',
                  }}
                />
              ) : (
                <div style={{
                  width: '96px', height: '96px', borderRadius: '50%',
                  backgroundColor: '#00CFCF', color: '#111111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', fontWeight: 700, marginBottom: '1rem',
                  border: '3px solid #00CFCF',
                }}>
                  {name.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              {/* Campo URL da foto */}
              <div style={{ width: '100%', maxWidth: '420px' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px', textAlign: 'center' }}>
                  Foto de Perfil
                </label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/sua-foto.jpg"
                  value={avatarUrl}
                  onChange={e => {
                    setAvatarUrl(e.target.value);
                    setAvatarPreview(e.target.value); // preview em tempo real
                  }}
                  style={{ ...inputStyle, textAlign: 'center', fontSize: '12px' }}
                  onFocus={e => (e.target.style.borderColor = '#00CFCF')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
                />
                <p style={{ color: '#6b7280', fontSize: '11px', textAlign: 'center', marginTop: '4px' }}>
                  Adicione uma imagem ou deixe em branco
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Nome */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '13px', marginBottom: '6px' }}>
                  <User size={14} /> Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#00CFCF')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '13px', marginBottom: '6px' }}>
                  <Mail size={14} /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#00CFCF')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
                />
              </div>

              {/* Bio */}
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px' }}>Bio</label>
                <textarea
                  rows={4}
                  placeholder="Conte um pouco sobre você..."
                  value={bio}
                  onChange={e => setBio(e.target.value.slice(0, 500))}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#00CFCF')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
                />
                <p style={{ color: '#6b7280', fontSize: '11px', textAlign: 'right', marginTop: '4px' }}>
                  {bio.length}/500 caracteres
                </p>
              </div>
            </div>

            {/* Informações da conta */}
            <div style={{ borderTop: '1px solid #2a2a2a', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
              <h3 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Informações da conta</h3>
              <div style={{ display: 'flex', gap: '3rem' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Tipo de conta</p>
                  <p style={{ color: '#ffffff', fontSize: '14px', margin: '2px 0 0' }}>Membro</p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Membro desde</p>
                  <p style={{ color: '#ffffff', fontSize: '14px', margin: '2px 0 0' }}>
                    {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Botão salvar */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '2rem',
                width: '100%', padding: '14px',
                backgroundColor: '#00CFCF', color: '#111111',
                border: 'none', borderRadius: '8px',
                fontSize: '15px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'Inter, sans-serif',
              }}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}