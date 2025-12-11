import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle } from 'lucide-react';

export default function LeadUploadForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    
    // First digit is country code
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
    // Only allow letters (a-z, A-Z), dashes, and spaces
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
        // Success - navigate or show success message
        navigate('/agents');
        return;
      }

      if (response.status === 401) {
        return navigate('/login');
      }

      // Extract error message from response
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
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        backgroundColor: 'rgb(38, 38, 36)',
        fontFamily: 'anthropicSans, "anthropicSans Fallback", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        height: '100%',
        width: '100%'
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

      <div className="w-full max-w-800px" style={{ display: 'flex', flexDirection: 'column', maxWidth: '800px' }}>
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
                Error
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
                    Please provide <span style={{ color: 'white', fontWeight: '600' }}>the agent's full name and phone number</span>
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
                    Phone number should include <span style={{ color: 'rgb(217, 119, 87)', fontWeight: '600' }}>country code</span>
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
                    You may add up to three <span style={{ color: 'rgb(217, 119, 87)', fontWeight: '600' }}>three </span>
                    agents
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
                    ⚠️ Each agent must have a unique phone number
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1.5rem' }}>
            {/* Full Name Input */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="fullName" className="block text-white text-sm mb-2" style={{ fontWeight: 'bold' }}>
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={handleFullNameChange}
                className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
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

            {/* Phone Number Input */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="phoneNumber" className="block text-white text-sm mb-2" style={{ fontWeight: 'bold' }}>
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2.5 text-white rounded-lg transition-colors text-sm font-medium"
            style={{
              backgroundColor: 'transparent',
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
            className="px-6 py-2.5 text-white rounded-lg transition-colors text-sm font-medium"
            style={{
              backgroundColor: isLoading ? 'rgba(217, 119, 87, 0.7)' : 'rgb(217, 119, 87)',
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
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}