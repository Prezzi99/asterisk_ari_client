import React, { useState } from 'react';
import { FileText, AlertCircle, Upload, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function LeadUploadForm() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setFile(null);
    setErrorMessage('');
  };

  const handleSave = () => {
    const payload = new FormData();
    payload.append('title', title);
    payload.append('file', file);
    
    setIsLoading(true);
    setErrorMessage('');

    fetch('https://localhost:8080/sheets/upload', {
        method: 'POST',
        credentials: 'include',
        body: payload,
    })
    .then(async response => {
      setIsLoading(false);
      
      if (response.ok) {
        return navigate('/lists');
      }
      
      if (response.status === 401) {
        return navigate('/login');
      }

      const data = await response.json().catch(() => ({}));
      const message = data.message || data.error || 'File upload unsuccessful. Please try again.';
      setErrorMessage(message);
    })
    .catch(err => {
      setIsLoading(false);
      console.log(err);
      setErrorMessage('Network error. Please check your connection and try again.');
    });
  };
 
  return (
    <div 
      style={{ 
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        fontFamily: 'anthropicSans, "anthropicSans Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .spinner {
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.6s linear infinite;
        }
        
        .error-notice {
          animation: slideDown 0.3s ease-out;
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .action-button {
          transition: all 0.2s ease;
        }

        .action-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(217, 119, 87, 0.3);
        }

        .input-field {
          transition: all 0.2s ease;
        }

        .file-drop-zone {
          transition: all 0.3s ease;
        }

        .file-drop-zone:hover {
          border-color: rgb(217, 119, 87);
          background-color: rgba(217, 119, 87, 0.02);
        }
      `}</style>

      <div style={{ 
        width: '100%', 
        maxWidth: '800px', 
        maxHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        animation: 'fadeIn 0.6s ease-out',
        overflowY: 'auto',
        paddingRight: '8px',
      }}>
        {        /* Header */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center', flexShrink: 0 }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '1.75rem',
            fontWeight: '700',
            marginBottom: '0.375rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}>
            Upload Calling List
          </h1>
          <p style={{ 
            color: 'rgb(156, 163, 175)', 
            fontSize: '0.875rem',
            fontWeight: '400',
          }}>
            Add a new calling list to your workspace
          </p>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div 
            className="error-notice"
            style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '1.25rem',
              backdropFilter: 'blur(10px)',
              flexShrink: 0,
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#fca5a5' }}>
                Upload Failed
              </div>
              <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#fca5a5' }}>
                {errorMessage}
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div style={{
          backgroundColor: 'rgba(30, 30, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          padding: '1.5rem',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Notice Section */}
            <div style={{
              backgroundColor: 'rgba(217, 119, 87, 0.08)',
              border: '1px solid rgba(217, 119, 87, 0.25)',
              borderRadius: '12px',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(217, 119, 87, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AlertCircle size={18} style={{ color: 'rgb(217, 119, 87)' }} />
                </div>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '15px', 
                  fontWeight: '600',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}>
                  Upload Requirements
                </h2>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                paddingLeft: '6px'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '6px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'rgb(217, 119, 87)',
                    marginTop: '7px'
                  }}></div>
                  <p style={{ 
                    color: '#d1d5db', 
                    fontSize: '13.5px', 
                    margin: 0,
                    lineHeight: '1.6',
                    fontWeight: '500'
                  }}>
                    Maximum of <span style={{ color: 'white', fontWeight: '600' }}>three columns</span> in your spreadsheet
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '6px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'rgb(217, 119, 87)',
                    marginTop: '7px'
                  }}></div>
                  <p style={{ 
                    color: '#d1d5db', 
                    fontSize: '13.5px', 
                    margin: 0,
                    lineHeight: '1.6',
                    fontWeight: '500'
                  }}>
                    <span style={{ color: 'rgb(217, 119, 87)', fontWeight: '600' }}>Telephone column is required</span> for all sheets
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <span style={{ fontSize: '16px' }}>⚠️</span>
                  <p style={{ 
                    color: '#fca5a5', 
                    fontSize: '12.5px', 
                    margin: 0,
                    lineHeight: '1.5',
                    fontWeight: '600',
                  }}>
                    All phone numbers must be excluded from state and federal DNC lists
                  </p>
                </div>
              </div>
            </div>
          
            {/* Form Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Title Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="title" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '-0.01em',
                }}>
                  Sheet Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  style={{
                    width: '100%',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: 'white',
                    backgroundColor: 'rgba(40, 40, 40, 0.4)',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgb(217, 119, 87)';
                    e.target.style.backgroundColor = 'rgba(40, 40, 40, 0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(217, 119, 87, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.backgroundColor = 'rgba(40, 40, 40, 0.4)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter a descriptive name for your sheet"
                />
              </div>

              {/* Lead Sheet Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '-0.01em',
                }}>
                  Excel File
                </label>
                <div
                  className="file-drop-zone"
                  style={{
                    border: '2px dashed',
                    borderColor: dragActive ? 'rgb(217, 119, 87)' : 'rgba(255, 255, 255, 0.15)',
                    backgroundColor: dragActive ? 'rgba(217, 119, 87, 0.05)' : 'rgba(40, 40, 40, 0.3)',
                    borderRadius: '12px',
                    padding: '2.5rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="file-upload"
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <div 
                      style={{ 
                        width: '56px', 
                        height: '56px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(217, 119, 87, 0.15) 0%, rgba(217, 119, 87, 0.05) 100%)',
                        border: '1px solid rgba(217, 119, 87, 0.2)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      {file ? (
                        <Check style={{ width: '28px', height: '28px', color: 'rgb(217, 119, 87)' }} />
                      ) : (
                        <Upload style={{ width: '28px', height: '28px', color: 'rgb(217, 119, 87)' }} />
                      )}
                    </div>
                    
                    {file ? (
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ 
                          color: 'white',
                          fontSize: '15px',
                          fontWeight: '600',
                          marginBottom: '6px',
                        }}>
                          {file.name}
                        </p>
                        <p style={{ 
                          color: 'rgb(156, 163, 175)',
                          fontSize: '13px',
                        }}>
                          Click or drag to replace
                        </p>
                      </div>
                    ) : (
                      <>
                        <p style={{ 
                          color: 'white',
                          fontSize: '15px',
                          fontWeight: '500',
                          marginBottom: '6px',
                        }}>
                          <span style={{ 
                            color: 'rgb(217, 119, 87)', 
                            fontWeight: '600',
                          }}>
                            Click to upload
                          </span>{' '}
                          or drag and drop
                        </p>
                        <p style={{ 
                          color: 'rgb(156, 163, 175)',
                          fontSize: '13px',
                        }}>
                          XLSX or XLS files up to 20MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px', 
          marginTop: '1.25rem',
          flexShrink: 0,
        }}>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }
            }}
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="action-button"
            style={{
              padding: '12px 24px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '10px',
              background: isLoading 
                ? 'rgba(217, 119, 87, 0.7)' 
                : 'linear-gradient(135deg, rgb(217, 119, 87) 0%, rgb(195, 100, 70) 100%)',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.8 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minWidth: '140px',
              boxShadow: isLoading ? 'none' : '0 4px 12px rgba(217, 119, 87, 0.25)',
            }}
          >
            {isLoading && <div className="spinner"></div>}
            {isLoading ? 'Uploading...' : (
              <>
                <Check size={16} />
                Upload Sheet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}