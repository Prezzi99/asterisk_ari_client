import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const login = () => {
    const email = document.querySelector('#Email').value;
    const password = document.querySelector('#Password').value;

    setIsLoading(true);
    setShowError(false);

    fetch('https://localhost:8080/auth/login', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({email, password})
    }).then(response => {
      setIsLoading(false);
      if (response.ok) return navigate('/');
      
      setShowError(true);
    }).catch(() => {
      setIsLoading(false);
      setShowError(true);
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

      <div className="w-full max-w-4xl" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Error Notice */}
        {showError && (
          <div 
            className="error-notice"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#fca5a5'
            }}
          >
            <AlertCircle size={18} />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              Wrong email or password
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Form Section */}
          <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', flex: '1', minWidth: '300px', gap: '1.5rem' }}>
            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="Email" className="block text-white text-sm mb-2" style={{ fontWeight: 'bold' }}>
                Email
              </label>
              <input
                id="Email"
                type="text"
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

            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="Password" className="block text-white text-sm mb-2" style={{ fontWeight: 'bold' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="Password"
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
                  style={{
                    borderColor: '#4b5563',
                    backgroundColor: 'transparent',
                    paddingRight: '45px'
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(217, 119, 87)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={login}
            disabled={isLoading}
            className="px-6 py-2.5 text-white rounded-lg transition-colors text-sm font-medium"
            style={{
              backgroundColor: isLoading ? 'rgba(217, 119, 87, 0.7)' : 'rgb(217, 119, 87)',
              width: '100%',
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
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}