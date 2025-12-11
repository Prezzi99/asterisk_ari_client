import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, Trash2, Check, X } from 'lucide-react';

export default function Sheets() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchSheets = async () => {
      const response = await fetch('https://localhost:8080/sheets', { credentials: 'include' });

      if (response.status == 401) {
        return navigate('/login')
      }
      
      (response.ok) ? setUsers(await response.json()) : setUsers([]);
    }

    fetchSheets()
  }, []);

  const sendDeleteRequest = (ids) => {
    if (ids.length === 1) {
      fetch(`https://localhost:8080/sheets/${ids[0]}`, { method: 'DELETE', credentials: 'include'});
    }
    else {
      fetch('https://localhost:8080/sheets', { 
        method: 'DELETE', 
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sheet_ids: ids })
      })
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(users.map(u => u.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === users.length);
  };

  const handleDeleteSelected = () => {
    const toDelete = users.filter(user => selectedRows.has(user.id));
    setDeletedUsers(toDelete);
    setUsers(users.filter(user => !selectedRows.has(user.id)));
    setPendingDelete(true);
  };

  const handleConfirmDelete = () => {
    setSelectedRows(new Set());
    setSelectAll(false);
    setPendingDelete(false);

    const sheets = [];
    deletedUsers.forEach((sheet) => sheets.push(sheet));

    sendDeleteRequest(sheets.map((sheet) => sheet.id));

    setDeletedUsers([]);
  };

  const handleOpen = (id) => {
    navigate('/list/open', { state: { sheet_id: id } });
  };

  const handleCancel = () => {
    if (pendingDelete) {
      setUsers([...users, ...deletedUsers].sort((a, b) => a.id - b.id));
      setDeletedUsers([]);
      setSelectedRows(new Set());
      setSelectAll(false);
      setPendingDelete(false);
    } else {
      setEditingId(null);
      setEditedData({});
    }
  };

  const handleSave = () => {
    if (pendingDelete) {
      handleConfirmDelete();
    } else {
      setUsers(users.map(user => 
        user.id === editingId 
          ? { ...user, title: editedData.title }
          : user
      ));
      setEditingId(null);
      setEditedData({});
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      width: '100%', 
      minHeight: '100vh', 
      padding: isMobile ? '1.5rem' : '3rem',
      fontFamily: 'anthropicSans, "anthropicSans Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        animation: 'fadeIn 0.6s ease-out',
      }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .table-row {
            transition: all 0.2s ease;
          }
          .table-row:hover {
            background-color: rgba(217, 119, 87, 0.05) !important;
            transform: translateX(4px);
          }
          .action-button {
            transition: all 0.2s ease;
          }
          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(217, 119, 87, 0.3);
          }
          .checkbox-custom {
            transition: all 0.2s ease;
          }
          .checkbox-custom:hover {
            border-color: rgb(217, 119, 87) !important;
            transform: scale(1.1);
          }
        `}</style>

        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '3rem',
          flexWrap: 'wrap', 
          gap: '1.5rem'
        }}>
          <div style={{ flex: '1 1 300px', minWidth: '0', marginTop: isMobile ? '50px' : '0'}}>
            <h1 style={{ 
              color: 'white', 
              fontSize: isMobile ? '2rem' : '2.5rem',
              fontWeight: '700',
              marginBottom: '0.75rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}>
              Calling Lists
            </h1>
            <p style={{ 
              color: 'rgb(156, 163, 175)', 
              fontSize: '1rem',
              fontWeight: '400',
            }}>
              Manage your calling lists with ease
            </p>
          </div>
          <Link to="/lists/upload" style={{ textDecoration: 'none' }}>
            <button
              className="action-button"
              style={{
                background: 'linear-gradient(135deg, rgb(217, 119, 87) 0%, rgb(195, 100, 70) 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(217, 119, 87, 0.25)',
              }}
            >
              <Plus size={18} />
              Add Calling List
            </button>
          </Link>
        </div>

        {/* Delete Banner */}
        {pendingDelete && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'slideDown 0.3s ease-out',
          }}>
            <Trash2 size={20} color="rgb(239, 68, 68)" />
            <span style={{ color: 'white', fontSize: '0.875rem', flex: 1 }}>
              {deletedUsers.length} sheet{deletedUsers.length !== 1 ? 's' : ''} will be deleted
            </span>
          </div>
        )}

        {/* Table Card */}
        <div style={{ 
          backgroundColor: 'rgba(30, 30, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(20, 20, 20, 0.4)' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', width: '60px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="checkbox-custom"
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectAll ? 'rgb(217, 119, 87)' : 'transparent',
                      appearance: 'none',
                      width: '18px',
                      height: '18px',
                      border: selectAll ? '2px solid rgb(217, 119, 87)' : '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      position: 'relative',
                      outline: 'none',
                    }} 
                  />
                  <style>{`
                    input[type="checkbox"]:checked::after {
                      content: '✓';
                      position: absolute;
                      color: white;
                      font-size: 14px;
                      font-weight: bold;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    }
                  `}</style>
                </th>
                <th style={{ 
                  padding: '1rem 1.5rem', 
                  textAlign: 'left', 
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  position: 'relative'
                }}>
                  {selectedRows.size > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        onClick={handleDeleteSelected}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          color: 'rgb(239, 68, 68)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Trash2 size={14} />
                        Delete Selected
                      </button>
                      <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                        {selectedRows.size} selected
                      </span>
                    </div>
                  ) : (
                    'Title'
                  )}
                </th>
                <th style={{ 
                  padding: '1rem 1.5rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  // display: isMobile ? 'none' : 'table-cell'
                  display: 'table-cell'
                }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr 
                  key={index} 
                  className="table-row"
                  style={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundColor: 'transparent'
                  }}
                >
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.has(user.id)}
                      onChange={() => handleSelectRow(user.id)}
                      className="checkbox-custom"
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: selectedRows.has(user.id) ? 'rgb(217, 119, 87)' : 'transparent',
                        appearance: 'none',
                        width: '18px',
                        height: '18px',
                        border: selectedRows.has(user.id) ? '2px solid rgb(217, 119, 87)' : '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        position: 'relative',
                        outline: 'none',
                      }} 
                    />
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9375rem', color: 'white', fontWeight: '500' }}>
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={editedData.title}
                        style={{
                          backgroundColor: 'rgba(40, 40, 40, 0.8)',
                          color: 'white',
                          border: '2px solid rgba(217, 119, 87, 0.5)',
                          borderRadius: '8px',
                          padding: '0.625rem',
                          fontSize: '0.9375rem',
                          width: '100%',
                          outline: 'none',
                        }}
                      />
                    ) : (
                      <div 
                        // onClick={() => handleFieldClick(user.id)}
                        style={{ 
                          cursor: isMobile ? 'pointer' : 'default',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {user.title}
                      </div>
                    )}
                  </td>
                  <td style={{ 
                    padding: '1.25rem 1.5rem',
                    textAlign: 'right',
                    // display: isMobile ? 'none' : 'table-cell'
                    display: 'table-cell'
                  }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpen(user.id)
                      }}
                      style={{
                        color: 'rgb(217, 119, 87)',
                        backgroundColor: 'rgba(217, 119, 87, 0.1)',
                        border: '1px solid rgba(217, 119, 87, 0.3)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        {(editingId !== null || pendingDelete) && (
          <div style={{ 
            marginTop: '1.5rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            animation: 'slideDown 0.3s ease-out',
          }}>
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: isMobile ? '100%' : '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="action-button"
              style={{
                background: 'linear-gradient(135deg, rgb(217, 119, 87) 0%, rgb(195, 100, 70) 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: isMobile ? '100%' : '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(217, 119, 87, 0.25)',
              }}
            >
              <Check size={16} />
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}