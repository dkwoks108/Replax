import React from 'react';

export default function Footer() {
  return (
    <footer style={{ padding: 16, borderTop: '1px solid #eaeaea', marginTop: 48 }}>
      <div style={{ maxWidth: 1024, margin: '0 auto', textAlign: 'center' }}>
        <small>© {new Date().getFullYear()} Replax</small>
      </div>
    </footer>
  );
}