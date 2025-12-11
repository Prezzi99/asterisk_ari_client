import React from 'react';

export default function Header() {
  return (
    <div style={{ fontFamily: 'anthropicSans, "anthropicSans Fallback", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f5f5f0', minHeight: '100vh' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#f5f5f0',
        fontWeight: 900,
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1px',
          backgroundColor: 'rgb(217, 119, 87)',
          fontWeight: 900,
          padding: '3px 10px',
          borderRadius: '8px',
          color: 'white'
        }}>
          <span style={{
            color: 'white',
            fontSize: '11px',
            fontWeight: 900
          }}>
            Balance: $13.20
          </span>
          <button style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 900,
            textDecoration: 'underline',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            Top-Up
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}
        className="right-section">
          <button style={{
            background: 'white',
            border: 'none',
            color: 'rgb(194, 192, 182)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.2s',
            borderRadius: '20px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          aria-label="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px', strokeWidth: '2.5' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          <button style={{
            background: 'white',
            border: 'none',
            color: 'rgb(194, 192, 182)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1px',
            padding: '8px',
            transition: 'opacity 0.2s',
            borderRadius: '20px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          aria-label="User menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px', strokeWidth: '2.5' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '14px', height: '14px', strokeWidth: '2.5' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </header>

      <style>{`
        @media (max-width: 768px) {
          .right-section {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}