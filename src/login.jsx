import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, AlertCircle, LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const api_url = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const login = () => {
    const email = document.querySelector('#Email').value;
    const password = document.querySelector('#Password').value;

    setIsLoading(true);
    setShowError(false);

    fetch(`${api_url}/auth/login`, {
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
        maxWidth: '480px',
        maxHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        animation: 'fadeIn 0.6s ease-out',
        overflowY: 'auto',
        paddingRight: '8px',
      }}>
        {/* Welcome Section */}
        <div style={{ 
          marginBottom: '2rem', 
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.5rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(217, 119, 87, 0.2) 0%, rgba(217, 119, 87, 0.05) 100%)',
            border: '1px solid rgba(217, 119, 87, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <LogIn size={32} style={{ color: 'rgb(217, 119, 87)' }} />
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}>
            Welcome Back
          </h1>
          <p style={{ 
            color: 'rgb(156, 163, 175)', 
            fontSize: '0.9375rem',
            fontWeight: '400',
          }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Error Notice */}
        {showError && (
          <div 
            className="error-notice"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(10px)',
              flexShrink: 0,
            }}
          >
            <AlertCircle size={18} style={{ color: '#ef4444' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#fca5a5' }}>
              Wrong email or password
            </span>
          </div>
        )}

        {/* Main Card */}
        <div style={{
          backgroundColor: 'rgba(30, 30, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          padding: '2rem',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label htmlFor="Email" style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Mail size={16} style={{ color: 'rgb(217, 119, 87)' }} />
                Email Address
              </label>
              <input
                id="Email"
                type="email"
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
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label htmlFor="Password" style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Lock size={16} style={{ color: 'rgb(217, 119, 87)' }} />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="Password"
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  style={{
                    width: '100%',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    paddingRight: '48px',
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
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(156, 163, 175, 0.8)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s',
                    borderRadius: '6px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'rgb(217, 119, 87)';
                    e.currentTarget.style.backgroundColor = 'rgba(217, 119, 87, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(156, 163, 175, 0.8)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ 
          marginTop: '1.5rem',
          flexShrink: 0,
        }}>
          <button
            onClick={login}
            disabled={isLoading}
            className="action-button"
            style={{
              width: '100%',
              padding: '14px 24px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              borderRadius: '12px',
              background: isLoading 
                ? 'rgba(217, 119, 87, 0.7)' 
                : 'linear-gradient(135deg, rgb(217, 119, 87) 0%, rgb(195, 100, 70) 100%)',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.8 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: isLoading ? 'none' : '0 4px 12px rgba(217, 119, 87, 0.25)',
            }}
          >
            {isLoading && <div className="spinner"></div>}
            {isLoading ? 'Signing in...' : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </div>

        {/* Footer Text */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <p style={{
            color: 'rgba(156, 163, 175, 0.7)',
            fontSize: '0.8125rem',
            lineHeight: '1.5',
          }}>
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}