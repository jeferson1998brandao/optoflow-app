'use client';

import { useState } from 'react';
import { mockPacientes } from '@/lib/mock-data';
import { Search, Plus, Eye, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PacientesPage() {
  const [search, setSearch] = useState('');

  const filtered = mockPacientes.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    (p.cpf && p.cpf.includes(search)) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusLabel: Record<string, string> = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    retorno: 'Retorno pendente',
  };

  const statusBadge: Record<string, string> = {
    ativo: 'badge-success',
    inativo: 'badge-gray',
    retorno: 'badge-warning',
  };

  const avatarColors = [
    { bg: '#DBEAFE', color: '#1E40AF' },
    { bg: '#DCFCE7', color: '#166534' },
    { bg: '#FEF3C7', color: '#92400E' },
    { bg: '#FCE7F3', color: '#9D174D' },
    { bg: '#EDE9FE', color: '#5B21B6' },
    { bg: '#CCFBF1', color: '#134E4A' },
  ];

  function calcAge(dataNasc: string) {
    const diff = Date.now() - new Date(dataNasc + 'T00:00:00').getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pacientes</h1>
          <p className="page-subtitle">{mockPacientes.length} pacientes cadastrados</p>
        </div>
        <Link href="/pacientes/novo" className="btn btn-primary">
          <Plus size={16} />
          Novo paciente
        </Link>
      </div>

      {/* Search */}
      <div className="card card-padding" style={{ marginBottom: 20 }}>
        <div className="search-box" style={{ maxWidth: 400 }}>
          <Search size={16} className="search-icon" />
          <input
            className="input"
            placeholder="Buscar por nome, CPF ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 38 }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Idade</th>
                <th>Telefone</th>
                <th>Última Consulta</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const color = avatarColors[i % avatarColors.length];
                const initials = p.nome.split(' ').map(n => n[0]).slice(0, 2).join('');
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          className="avatar"
                          style={{ background: color.bg, color: color.color }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{p.nome}</div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{calcAge(p.dataNascimento)} anos</td>
                    <td>{p.telefone}</td>
                    <td>
                      {p.ultimaConsulta
                        ? new Date(p.ultimaConsulta + 'T00:00:00').toLocaleDateString('pt-BR')
                        : <span style={{ color: 'var(--color-text-secondary)' }}>—</span>}
                    </td>
                    <td>
                      <span className={`badge ${statusBadge[p.status]}`}>{statusLabel[p.status]}</span>
                    </td>
                    <td>
                      <Link
                        href={`/pacientes/${p.id}`}
                        className="btn btn-sm btn-secondary btn-icon"
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Eye size={15} />
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-state">
              <Search size={36} className="empty-state-icon" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              <div className="empty-state-title">Nenhum paciente encontrado</div>
              <div className="empty-state-text">Tente buscar por outro nome ou CPF</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
