import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';

export default function TeamMembersTable() {
  const [sheet, setSheet] = useState([]);
  const [columns, setColumns] = useState([])
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const highlightedRowRef = useRef(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setIsMobile(true);
      } else if (width >= 768 && width <= 1024) {
        setIsMobile(false);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();
  }, []);

  async function fetchSheet(id) {
    const response = await fetch(`https://localhost:8080/sheets/${id}`, { credentials: 'include' });

    if (response.status == 401) {
      return navigate('/login')
    }

    const sheet = await response.json();
    if (response.ok) {
      setSheet(sheet);
      setColumns(Object.keys(sheet[0]));
    }
  }
 
  fetchSheet(location.state?.sheet_id);

  return (
    <div className="w-full p-4 md:p-8 flex flex-col relative" style={{ 
      backgroundColor: '#0a0a0b', 
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', 
      height: '100vh',
    }}>
      {/* Dialing Indicator */}
      {/* Table */}
      {
        sheet.length ? 
        <div style={{ 
          backgroundColor: 'rgba(30, 30, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          maxHeight: '100%',
          marginTop: isMobile ? '60px' : '0'
        }}>
          <style>{`
            .table-row-campaign {
              transition: all 0.2s ease;
            }
            .table-row-campaign:hover {
              background-color: rgba(255, 68, 68, 0.05) !important;
              transform: translateX(4px);
            }
          `}</style>
          <div className="overflow-x-auto" style={{ maxHeight: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(20, 20, 20, 0.4)' }}>
                  <th style={{ 
                    padding: '1rem 1.5rem', 
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>#</th>
                  {
                    columns.map((column) => {
                      return (
                        <th key={column} style={{ 
                          padding: '1rem 1.5rem', 
                          textAlign: 'left',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                        }}>{column}</th>
                      );
                    })
                  }
                </tr>
              </thead>
              <tbody>
                {sheet.map((member, idx) => {
                  return (
                    <tr 
                      key={idx} 
                      className="table-row-campaign"
                      style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        // backgroundColor: isHighlighted ? 'rgba(255, 68, 68, 0.08)' : 'transparent'
                        backgroundColor: 'transparent'
                      }}
                    >
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem'}}>{idx}</div>
                      </td>
                      {
                        columns.map((column) => {
                          return (
                            <td key={column} style={{ padding: '1.25rem 1.5rem' }}>
                              <div style={{color: 'white', fontWeight: '500', fontSize: '0.9375rem'}}>{member[column]}</div>
                            </td>
                          )
                        })
                      }
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div> : null
      }
    </div>
  );
}