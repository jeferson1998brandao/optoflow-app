'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D1117 0%, #161B22 50%, #0D1117 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed',
        top: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(20, 184, 166, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeIn 0.4s ease forwards' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(20, 184, 166, 0.3)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
            Optoflow
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 6 }}>
            Sistema para Optometristas
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(22, 27, 34, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          padding: 36,
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 6 }}>
            Bem-vindo de volta
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
            Entre na sua conta para continuar
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 20,
              fontSize: 13,
              color: '#FCA5A5',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#9CA3AF' }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{
                  padding: '12px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 10,
                  fontSize: 14,
                  color: 'white',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(20, 184, 166, 0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#9CA3AF' }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    padding: '12px 44px 12px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 10,
                    fontSize: 14,
                    color: 'white',
                    outline: 'none',
                    fontFamily: 'inherit',
                    width: '100%',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(20, 184, 166, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6B7280',
                    padding: 4,
                    display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '13px 20px',
                background: loading
                  ? 'rgba(20, 184, 166, 0.5)'
                  : 'linear-gradient(135deg, #14B8A6, #0D9488)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                marginTop: 4,
                boxShadow: loading ? 'none' : '0 4px 14px rgba(20, 184, 166, 0.3)',
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn size={17} />
                  Entrar
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6B7280' }}>
            Não tem uma conta?{' '}
            <Link href="/cadastro" style={{ color: '#14B8A6', fontWeight: 500, textDecoration: 'none' }}>
              Criar conta
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#374151' }}>
          © 2025 Optoflow · Todos os direitos reservados
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: #4B5563; }
      `}</style>
    </div>
  );
}
