import React, { useState, useEffect } from 'react';
import { FolderOpen, Users, ChevronDown, Menu } from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setIsMobile(true);
        setIsCollapsed(false);
      } else if (width >= 768 && width <= 1024) {
        setIsMobile(false);
        setIsCollapsed(true);
      } else {
        setIsMobile(false);
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <>
        {!isMobileMenuOpen && (
          <button 
            className="fixed top-4 left-4 z-50 p-2 rounded-lg text-white"
            style={{backgroundColor: 'rgb(31, 30, 29)'}}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div 
          className={`fixed top-0 left-0 h-screen w-64 z-50 transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{
            background: '#0a0a0b',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <style>{`
            .nav-button:hover {
              background: rgba(255, 255, 255, 0.04) !important;
            }
            .nav-button:active {
              background: rgba(255, 255, 255, 0.06) !important;
              transform: scale(0.98);
            }
            .campaign-button:hover {
              background: rgba(255, 68, 68, 0.12) !important;
              box-shadow: 0 0 20px rgba(255, 68, 68, 0.15);
            }
            .campaign-button:active {
              transform: scale(0.98);
            }
            .user-button:hover {
              background-color: rgba(255, 255, 255, 0.03);
            }
            .nav-button, .campaign-button {
              transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .nav-button {
              color: #71717a;
            }
            .nav-button:hover {
              color: #a1a1aa;
            }
            .zentro-logo {
              font-family: system-ui, -apple-system, sans-serif;
              font-weight: 800;
              letter-spacing: -0.03em;
              font-size: 1.5rem;
              cursor: pointer;
              color: #fafafa;
            }
            .nav-button, .campaign-button {
              cursor: pointer;
            }
            .nav-icon-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 36px;
              height: 36px;
              border-radius: 8px;
              background: rgba(255, 255, 255, 0.03);
              transition: all 0.15s;
            }
            .nav-button:hover .nav-icon-wrapper {
              background: rgba(255, 255, 255, 0.06);
            }
            .campaign-icon-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 36px;
              height: 36px;
              border-radius: 8px;
              background: rgba(255, 68, 68, 0.15);
              transition: all 0.15s;
            }
            .campaign-button:hover .campaign-icon-wrapper {
              background: rgba(255, 68, 68, 0.25);
            }
            .glassmorphism {
              background: rgba(255, 255, 255, 0.02);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.05);
            }
          `}</style>

          <div className="p-6 flex items-center justify-between">
            <span className="zentro-logo">zentro</span>
            <div 
              className="flex items-center justify-center cursor-pointer rounded-lg p-2 transition-all duration-200" 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{opacity: 0.5}}>
                <path d="M15 6L9 12L3 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <nav className="px-4 py-2">
            <button className="campaign-button w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left" style={{
              color: '#ff4444',
              background: 'rgba(255, 68, 68, 0.08)',
            }}>
              <div className="campaign-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="shrink-0" viewBox="0 0 16 16">
                  <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z"/>
                </svg>
              </div>
              <span className="font-semibold" style={{fontSize: '14px', letterSpacing: '-0.01em'}}>Campaign</span>
            </button>
          </nav>

          <nav className="flex-1 px-4 py-2 space-y-1">
            <button className="nav-button w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-left">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="shrink-0" viewBox="0 0 16 16">
                <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
                <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
              </svg>
              <span className="text-sm font-medium" style={{letterSpacing: '-0.01em'}}>Automated Attendants</span>
            </button>

            <button className="nav-button w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-left">
              <FolderOpen className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium" style={{letterSpacing: '-0.01em'}}>Lead Sheets</span>
            </button>

            <button className="nav-button w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-left">
              <Users className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium" style={{letterSpacing: '-0.01em'}}>Agents</span>
            </button>
          </nav>

          <div className="p-4">
            <button className="user-button w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors glassmorphism">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{
                background: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)',
                color: 'white'
              }}>
                IR
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-white" style={{letterSpacing: '-0.01em'}}>Ishmael Reid</div>
                <div className="text-xs" style={{color: '#71717a'}}>Free plan</div>
              </div>
              <ChevronDown className="w-4 h-4" style={{color: '#71717a'}} />
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div 
      className={`h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`} 
      style={{
        background: '#0a0a0b',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        minWidth: isCollapsed ? '4rem' : '16rem',
      }}
    >
      <style>{`
        .nav-button:hover {
          background: rgba(255, 255, 255, 0.04) !important;
        }
        .nav-button:active {
          background: rgba(255, 255, 255, 0.06) !important;
          transform: scale(0.98);
        }
        .campaign-button:hover {
          background: rgba(255, 68, 68, 0.12) !important;
          box-shadow: 0 0 20px rgba(255, 68, 68, 0.15);
        }
        .campaign-button:active {
          transform: scale(0.98);
        }
        .user-button:hover {
          background-color: rgba(255, 255, 255, 0.03);
        }
        .nav-button, .campaign-button {
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-button {
          color: #71717a;
        }
        .nav-button:hover {
          color: #a1a1aa;
        }
        .zentro-logo {
          font-family: system-ui, -apple-system, sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
          font-size: 1.5rem;
          cursor: pointer;
          color: #fafafa;
        }
        .sidebar-toggle {
          position: relative;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .sidebar-toggle:hover {
          background-color: rgba(255, 255, 255, 0.06);
        }
        .sidebar-icon-default {
          opacity: 1;
          transform: scale(1);
          transition: all 0.15s;
        }
        .sidebar-toggle:not(.collapsed):hover .sidebar-icon-default {
          opacity: 0;
          transform: scale(0.75);
        }
        .sidebar-icon-hover {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(0.75);
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sidebar-toggle:not(.collapsed):hover .sidebar-icon-hover {
          opacity: 1;
          transform: scale(1);
        }
        .nav-text {
          white-space: nowrap;
          overflow: hidden;
        }
        .nav-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.15s;
        }
        .nav-button:hover .nav-icon-wrapper {
          background: rgba(255, 255, 255, 0.06);
        }
        .campaign-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 68, 68, 0.15);
          transition: all 0.15s;
        }
        .campaign-button:hover .campaign-icon-wrapper {
          background: rgba(255, 68, 68, 0.25);
        }
        .glassmorphism {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
      
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
        <div 
          className={`sidebar-toggle ${isCollapsed ? 'collapsed' : ''}`} 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg" className="sidebar-icon-default shrink-0" style={{opacity: 0.5}}>
            <path d="M6.83496 3.99992C6.38353 4.00411 6.01421 4.0122 5.69824 4.03801C5.31232 4.06954 5.03904 4.12266 4.82227 4.20012L4.62207 4.28606C4.18264 4.50996 3.81498 4.85035 3.55859 5.26848L3.45605 5.45207C3.33013 5.69922 3.25006 6.01354 3.20801 6.52824C3.16533 7.05065 3.16504 7.71885 3.16504 8.66301V11.3271C3.16504 12.2712 3.16533 12.9394 3.20801 13.4618C3.25006 13.9766 3.33013 14.2909 3.45605 14.538L3.55859 14.7216C3.81498 15.1397 4.18266 15.4801 4.62207 15.704L4.82227 15.79C5.03904 15.8674 5.31234 15.9205 5.69824 15.9521C6.01398 15.9779 6.383 15.986 6.83398 15.9902L6.83496 3.99992ZM18.165 11.3271C18.165 12.2493 18.1653 12.9811 18.1172 13.5702C18.0745 14.0924 17.9916 14.5472 17.8125 14.9648L17.7295 15.1415C17.394 15.8 16.8834 16.3511 16.2568 16.7353L15.9814 16.8896C15.5157 17.1268 15.0069 17.2285 14.4102 17.2773C13.821 17.3254 13.0893 17.3251 12.167 17.3251H7.83301C6.91071 17.3251 6.17898 17.3254 5.58984 17.2773C5.06757 17.2346 4.61294 17.1508 4.19531 16.9716L4.01855 16.8896C3.36014 16.5541 2.80898 16.0434 2.4248 15.4169L2.27051 15.1415C2.03328 14.6758 1.93158 14.167 1.88281 13.5702C1.83468 12.9811 1.83496 12.2493 1.83496 11.3271V8.66301C1.83496 7.74072 1.83468 7.00898 1.88281 6.41985C1.93157 5.82309 2.03329 5.31432 2.27051 4.84856L2.4248 4.57317C2.80898 3.94666 3.36012 3.436 4.01855 3.10051L4.19531 3.0175C4.61285 2.83843 5.06771 2.75548 5.58984 2.71281C6.17898 2.66468 6.91071 2.66496 7.83301 2.66496H12.167C13.0893 2.66496 13.821 2.66468 14.4102 2.71281C15.0069 2.76157 15.5157 2.86329 15.9814 3.10051L16.2568 3.25481C16.8833 3.63898 17.394 4.19012 17.7295 4.84856L17.8125 5.02531C17.9916 5.44285 18.0745 5.89771 18.1172 6.41985C18.1653 7.00898 18.165 7.74072 18.165 8.66301V11.3271ZM8.16406 15.995H12.167C13.1112 15.995 13.7794 15.9947 14.3018 15.9521C14.8164 15.91 15.1308 15.8299 15.3779 15.704L15.5615 15.6015C15.9797 15.3451 16.32 14.9774 16.5439 14.538L16.6299 14.3378C16.7074 14.121 16.7605 13.8478 16.792 13.4618C16.8347 12.9394 16.835 12.2712 16.835 11.3271V8.66301C16.835 7.71885 16.8347 7.05065 16.792 6.52824C16.7605 6.14232 16.7073 5.86904 16.6299 5.65227L16.5439 5.45207C16.32 5.01264 15.9796 4.64498 15.5615 4.3886L15.3779 4.28606C15.1308 4.16013 14.8165 4.08006 14.3018 4.03801C13.7794 3.99533 13.1112 3.99504 12.167 3.99504H8.16406C8.16407 3.99667 8.16504 3.99829 8.16504 3.99992L8.16406 15.995Z"></path>
          </svg>
          <div className="sidebar-icon-hover">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{opacity: 0.5}}>
              <path d="M15 6L9 12L3 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        {!isCollapsed && <span className="zentro-logo ml-3">zentro</span>}
      </div>

      <nav className="px-4 py-2">
        <button className={`campaign-button w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isCollapsed ? 'justify-center' : ''}`} style={{
          color: '#ff4444',
          background: 'rgba(255, 68, 68, 0.08)',
        }}>
          <div className="campaign-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="shrink-0" viewBox="0 0 16 16">
              <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z"/>
            </svg>
          </div>
          {!isCollapsed && <span className="font-semibold nav-text" style={{fontSize: '14px', letterSpacing: '-0.01em'}}>Campaign</span>}
        </button>
      </nav>

      <nav className="flex-1 px-4 py-2 space-y-0.5">
        <button className={`nav-button w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="nav-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="shrink-0" viewBox="0 0 16 16">
              <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
              <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
            </svg>
          </div>
          {!isCollapsed && <span className="text-sm font-medium nav-text" style={{letterSpacing: '-0.01em'}}>Auto Attendants</span>}
        </button>

        <button className={`nav-button w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="nav-icon-wrapper">
            <FolderOpen className="w-[18px] h-[18px] shrink-0" />
          </div>
          {!isCollapsed && <span className="text-sm font-medium nav-text" style={{letterSpacing: '-0.01em'}}>Lead Sheets</span>}
        </button>

        <button className={`nav-button w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="nav-icon-wrapper">
            <Users className="w-[18px] h-[18px] shrink-0" />
          </div>
          {!isCollapsed && <span className="text-sm font-medium nav-text" style={{letterSpacing: '-0.01em'}}>Agents</span>}
        </button>
      </nav>

      <div className="p-4">
        <button className={`user-button w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors glassmorphism ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{
            background: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)',
            color: 'white'
          }}>
            IR
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-white" style={{letterSpacing: '-0.01em'}}>Ishmael Reid</div>
                <div className="text-xs" style={{color: '#71717a'}}>Free plan</div>
              </div>
              <ChevronDown className="w-4 h-4" style={{color: '#71717a'}} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}