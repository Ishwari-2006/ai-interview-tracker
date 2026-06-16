// Shared theme constants for all inner pages
export const T = {
  // Page wrapper
  page: { backgroundColor: '#f5f0e8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  
  // Content container
  container: { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' },
  
  // Typography
  pageTitle: { fontFamily: 'Playfair Display, serif', fontSize: '30px', fontWeight: '700', color: '#2c1a0e', marginBottom: '6px' },
  pageSub: { color: '#9b7e6e', fontSize: '14px', marginBottom: '32px' },
  sectionTitle: { fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '600', color: '#2c1a0e', marginBottom: '16px' },
  
  // Cards
  card: { backgroundColor: '#ffffff', border: '1px solid #ddd0bc', borderRadius: '16px', padding: '24px' },
  cardHover: { backgroundColor: '#ffffff', border: '1px solid #ddd0bc', borderRadius: '16px', padding: '24px', cursor: 'pointer' },
  
  // Form elements
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#5c3d2e', marginBottom: '6px' },
  input: { width: '100%', backgroundColor: '#f9f5ef', border: '1.5px solid #ddd0bc', color: '#2c1a0e', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' },
  select: { width: '100%', backgroundColor: '#f9f5ef', border: '1.5px solid #ddd0bc', color: '#2c1a0e', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' },
  textarea: { width: '100%', backgroundColor: '#f9f5ef', border: '1.5px solid #ddd0bc', color: '#2c1a0e', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', resize: 'vertical' },
  
  // Buttons
  btnPrimary: { backgroundColor: '#2c1a0e', color: '#f5f0e8', padding: '11px 22px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  btnSecondary: { backgroundColor: '#f5f0e8', color: '#2c1a0e', padding: '11px 22px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', border: '1.5px solid #ddd0bc', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  btnDanger: { backgroundColor: '#fdf0f0', color: '#8b2e2e', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', fontSize: '13px', border: '1px solid #f0d0d0', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  btnFull: { width: '100%', backgroundColor: '#2c1a0e', color: '#f5f0e8', padding: '13px', borderRadius: '10px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  
  // Alerts
  success: { backgroundColor: '#f0faf4', border: '1px solid #c0dfc8', color: '#2d6a4f', padding: '12px 16px', borderRadius: '10px', fontSize: '13px' },
  error: { backgroundColor: '#fdf0f0', border: '1px solid #f0d0d0', color: '#8b2e2e', padding: '12px 16px', borderRadius: '10px', fontSize: '13px' },
  warning: { backgroundColor: '#fdf8f0', border: '1px solid #f0ddb0', color: '#7a5c14', padding: '12px 16px', borderRadius: '10px', fontSize: '13px' },
  
  // Badges
  badge: (color) => {
    const colors = {
      blue: { backgroundColor: '#f0f4ff', color: '#2d4a8a', border: '1px solid #c0ccf0' },
      green: { backgroundColor: '#f0faf4', color: '#2d6a4f', border: '1px solid #c0dfc8' },
      red: { backgroundColor: '#fdf0f0', color: '#8b2e2e', border: '1px solid #f0d0d0' },
      yellow: { backgroundColor: '#fdf8f0', color: '#7a5c14', border: '1px solid #f0ddb0' },
      brown: { backgroundColor: '#fdf5ef', color: '#8b5e3c', border: '1px solid #e8d0b8' },
    };
    return { ...colors[color] || colors.brown, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', display: 'inline-block' };
  },
  
  // Divider
  divider: { borderTop: '1px solid #ddd0bc', margin: '20px 0' },
  
  // Stat card
  statCard: { backgroundColor: '#ffffff', border: '1px solid #ddd0bc', borderRadius: '16px', padding: '20px', textAlign: 'center' },
  statNum: { fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: '700', color: '#2c1a0e' },
  statLabel: { color: '#9b7e6e', fontSize: '12px', marginTop: '4px' },
  
  // Page header row
  pageHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
};