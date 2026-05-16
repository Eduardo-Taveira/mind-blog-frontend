interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeleteModal({ onConfirm, onCancel, isLoading }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px', padding: '1.75rem',
        maxWidth: '400px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem', margin: '0 0 8px' }}>
          Excluir Artigo
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} disabled={isLoading}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: '14px',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isLoading}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px',
              backgroundColor: '#ef4444', border: 'none',
              color: '#ffffff', fontSize: '14px', fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              fontFamily: 'Inter, sans-serif',
            }}>
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}