'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  AlertCircle,
  Settings,
  Eye,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pacientes', icon: Users, label: 'Pacientes' },
  { href: '/agenda', icon: Calendar, label: 'Agenda' },
  { href: '/receitas', icon: FileText, label: 'Receitas' },
  { href: '/retencao', icon: AlertCircle, label: 'Retenção' },
  { href: '/perfil', icon: Settings, label: 'Perfil' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Usuário');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const nome = user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário';
        setUserName(nome);
        setUserEmail(user.email || '');
      }
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--color-sidebar)',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '28px 24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: 'var(--color-sidebar-active)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Eye size={20} color="white" />
          </div>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.02em',
              }}
            >
              Optoflow
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-sidebar-text)', marginTop: 1 }}>
              Sistema Óptico
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px 10px' }}>
          Menu
        </div>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                color: isActive ? 'white' : 'var(--color-sidebar-text)',
                background: isActive ? 'var(--color-sidebar-active)' : 'transparent',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '16px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 8,
            marginBottom: 4,
          }}
        >
          <div
            className="avatar"
            style={{
              background: 'rgba(20, 184, 166, 0.2)',
              color: 'var(--color-sidebar-active)',
              width: 34,
              height: 34,
              fontSize: 13,
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-sidebar-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 8,
            color: '#6B7280',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            width: '100%',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#EF4444';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#6B7280';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
