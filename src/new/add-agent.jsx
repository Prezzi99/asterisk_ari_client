import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, User, Phone, X, Check } from 'lucide-react';

export default function LeadUploadForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    
    if (digits.length === 1) {
      return `+${digits}`;
    } else if (digits.length <= 4) {
      return `+${digits[0]} ${digits.slice(1)}`;
    } else if (digits.length <= 7) {
      return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    } else {
      return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneNumberChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleFullNameChange = (e) => {
    const filtered = e.target.value.replace(/[^a-zA-Z\- ]/g, '');
    setFullName(filtered);
  };

  const handleCancel = () => {
    setFullName('');
    setPhoneNumber('');
    setErrorMessage('');
  };

  const handleSave = () => {
    setIsLoading(true);
    setErrorMessage('');

    fetch('https://localhost:8080/agents/add', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        full_name: fullName, 
        phone_number: phoneNumber.replaceAll(/\D/g, '')
      })
    })
    .then(async response => {
      setIsLoading(false);

      if (response.ok) {
        navigate('/agents');
        return;
      }

      if (response.status === 401) {
        return navigate('/login');
      }

      const data = await response.json().catch(() => ({}));
      const message = data.message || data.error || 'Failed to add agent. Please try again.';
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
        {/* Header */}
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
            Add New Agent
          </h1>
          <p style={{ 
            color: 'rgb(156, 163, 175)', 
            fontSize: '0.875rem',
            fontWeight: '400',
          }}>
            Register a new agent to your team
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
                Error
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
                  Agent Requirements
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
                    Provide <span style={{ color: 'white', fontWeight: '600' }}>full name and phone number</span> for the agent
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
                    Phone number must include <span style={{ color: 'rgb(217, 119, 87)', fontWeight: '600' }}>country code</span>
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
                    Maximum of <span style={{ color: 'white', fontWeight: '600' }}>three agents</span> can be added
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
                    Each agent must have a unique phone number
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Full Name Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="fullName" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <User size={16} style={{ color: 'rgb(217, 119, 87)' }} />
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={handleFullNameChange}
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
                  placeholder="Enter agent's full name"
                />
              </div>

              {/* Phone Number Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="phoneNumber" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Phone size={16} style={{ color: 'rgb(217, 119, 87)' }} />
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
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
                  placeholder="+1 (555) 123-4567"
                />
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
            {isLoading ? 'Saving...' : (
              <>
                <Check size={16} />
                Add Agent
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}