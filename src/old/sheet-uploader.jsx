import React, { useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
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
        return navigate('/sheets');
      }
      
      if (response.status === 401) {
        return navigate('/login');
      }

      // Extract error message from response
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
        backgroundColor: 'rgb(38, 38, 36)',
        fontFamily: 'anthropicSans, "anthropicSans Fallback", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
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
        
        .spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.6s linear infinite;
        }
        
        .error-notice {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column' }}>
        {/* Error Notice */}
        {errorMessage && (
          <div 
            className="error-notice"
            style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '24px',
              color: '#fca5a5'
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                Upload Failed
              </div>
              <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#fca5a5' }}>
                {errorMessage}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Notice Section */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <div style={{
              backgroundColor: 'rgba(217, 119, 87, 0.08)',
              border: '1px solid rgba(217, 119, 87, 0.2)',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '600px',
              width: '100%'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} style={{ color: 'rgb(217, 119, 87)' }} />
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '15px', 
                  fontWeight: '600',
                  margin: 0 
                }}>
                  Important Notice
                </h2>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px',
                paddingLeft: '4px'
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '5px',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'rgb(217, 119, 87)',
                    marginTop: '6px'
                  }}></div>
                  <p style={{ 
                    color: '#d1d5db', 
                    fontSize: '13px', 
                    margin: 0,
                    lineHeight: '1.5',
                    fontWeight: '500'
                  }}>
                    Your sheet should not exceed <span style={{ color: 'white', fontWeight: '600' }}>three columns</span>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '5px',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'rgb(217, 119, 87)',
                    marginTop: '6px'
                  }}></div>
                  <p style={{ 
                    color: '#d1d5db', 
                    fontSize: '13px', 
                    margin: 0,
                    lineHeight: '1.5',
                    fontWeight: '500'
                  }}>
                    Your sheet <span style={{ color: 'rgb(217, 119, 87)', fontWeight: '600' }}>must include a Telephone column</span>
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  marginTop: '2px'
                }}>
                  <p style={{ 
                    color: '#fca5a5', 
                    fontSize: '12px', 
                    margin: 0,
                    lineHeight: '1.5',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    ⚠️ Ensure all phone numbers are excluded from the federal DNC list
                  </p>
                </div>
              </div>
            </div>
          </div>
        
          {/* Form Section */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Title Input */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="title" className="block text-white text-sm mb-2" style={{ fontWeight: 'bold' }}>
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
                style={{
                  borderColor: '#4b5563',
                  backgroundColor: 'transparent'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgb(217, 119, 87)';
                  e.target.style.boxShadow = '0 0 0 1px rgb(217, 119, 87)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4b5563';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder=""
              />
            </div>

            {/* Lead Sheet Upload */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="block text-white text-sm mb-2" style={{ fontWeight: 'bold' }}>
                Lead Sheet
              </label>
              <div
                className="relative rounded-lg text-center transition-colors"
                style={{
                  border: '2px dashed',
                  borderColor: dragActive ? 'rgb(217, 119, 87)' : '#4b5563',
                  backgroundColor: 'transparent',
                  padding: '3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
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
                  className="cursor-pointer"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <div 
                    className="bg-gray-700 rounded-lg mb-4"
                    style={{ 
                      width: '4rem', 
                      height: '4rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <FileText className="text-gray-400" style={{ width: '2rem', height: '2rem' }} />
                  </div>
                  <p className="text-gray-400 mb-1">
                    <span style={{ color: 'rgb(217, 119, 87)', cursor: 'pointer' }}>
                      Upload a file
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm">XLSX files up to 20MB</p>
                  {file && (
                    <p className="mt-3 text-green-400 text-sm">
                      Selected: {file.name}
                    </p>
                  )}
                </label>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2.5 text-white rounded-lg text-sm font-medium"
            style={{
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.target.style.backgroundColor = 'transparent';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2.5 text-white rounded-lg text-sm font-medium"
            style={{
              backgroundColor: isLoading ? 'rgba(217, 119, 87, 0.7)' : 'rgb(217, 119, 87)',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.8 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.backgroundColor = 'rgba(217, 119, 87, 0.9)';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.target.style.backgroundColor = 'rgb(217, 119, 87)';
            }}
          >
            {isLoading && <div className="spinner"></div>}
            {isLoading ? 'Uploading...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}