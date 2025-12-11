import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

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
    setDeletedUsers([]);
  };

  const handleFieldClick = (id) => {
    navigate('/', /*{ state: { sheet_id: id } }*/);
  };

  const handleCancel = () => {
    if (pendingDelete) {
      // Restore deleted users
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
    <div style={{ backgroundColor: 'rgb(38, 38, 36)', width: '100%', minHeight: '100vh', padding: '2rem', fontFamily: 'anthropicSans, "anthropicSans Fallback", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', top: '20%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: '1 1 300px', minWidth: '0' }}>
            <h1 style={{ color: 'white', fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Sheets
            </h1>
            <p style={{ color: 'rgb(156, 163, 175)', fontSize: '0.875rem' }}>
              Your calling lists
            </p>
          </div>
          <Link to="/sheets/upload">
            <button
              style={{
                backgroundColor: 'rgb(217, 119, 87)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flex: isMobile ? '1 0 100%' : '0 1 auto',
                minWidth: 'fit-content',
              }}
            >
              Add sheet
            </button>
          </Link>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: 'transparent', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid rgb(55, 65, 81)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'transparent' }}>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={handleSelectAll}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectAll ? 'rgb(217, 119, 87)' : 'transparent',
                      appearance: 'none',
                      width: '16px',
                      height: '16px',
                      border: selectAll ? '2px solid rgb(217, 119, 87)' : '2px solid rgb(75, 85, 99)',
                      borderRadius: '3px',
                      position: 'relative',
                      outline: 'none',
                    }} 
                  />
                  <style>{`
                    input[type="checkbox"]:checked::after {
                      content: '✓';
                      position: absolute;
                      color: white;
                      font-size: 12px;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    }
                  `}</style>
                </th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'relative' }}>
                  {selectedRows.size > 0 ? (
                    <button
                      onClick={handleDeleteSelected}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'rgb(239, 68, 68)',
                        border: '1px solid rgb(239, 68, 68)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        position: 'absolute',
                        top: '50%',
                        left: '1.5rem',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      Delete all
                    </button>
                  ) : (
                    'Title'
                  )}
                </th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', display: isMobile ? 'none' : 'table-cell' }}>
                  <span style={{ visibility: 'hidden' }}>Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} style={{ borderTop: '1px solid rgb(55, 65, 81)', backgroundColor: 'transparent' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.has(user.id)}
                      onChange={() => handleSelectRow(user.id)}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: selectedRows.has(user.id) ? 'rgb(217, 119, 87)' : 'transparent',
                        appearance: 'none',
                        width: '16px',
                        height: '16px',
                        border: selectedRows.has(user.id) ? '2px solid rgb(217, 119, 87)' : '2px solid rgb(75, 85, 99)',
                        borderRadius: '3px',
                        position: 'relative',
                        outline: 'none',
                      }} 
                    />
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={editedData.title}
                        style={{
                          backgroundColor: 'rgb(55, 65, 81)',
                          color: 'white',
                          border: '1px solid rgb(75, 85, 99)',
                          borderRadius: '0.25rem',
                          padding: '0.5rem',
                          fontSize: '0.875rem',
                          width: '100%',
                        }}
                      />
                    ) : (
                      <div 
                        onClick={() => handleFieldClick(user.id)}
                        style={{ cursor: isMobile ? 'pointer' : 'default' }}
                      >
                        {user.title}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: isMobile ? 'none' : 'table-cell' }}>
                    <a
                      href="#"
                      style={{
                        color: 'rgb(217, 119, 87)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textDecoration: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleFieldClick(user.id)
                      }}
                    >
                      Open
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        {(editingId !== null || pendingDelete) && (
          <div style={{ 
            marginTop: '1rem', 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid rgb(75, 85, 99)',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: isMobile ? '100%' : 'auto',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: 'rgb(217, 119, 87)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: isMobile ? '100%' : 'auto',
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}