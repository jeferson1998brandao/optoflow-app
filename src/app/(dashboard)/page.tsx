import { mockAgendamentos, mockPacientes } from '@/lib/mock-data';
import { Users, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = mockAgendamentos.filter(a => a.data === hoje);
  const totalPacientes = mockPacientes.length;
  const pacientesAtivos = mockPacientes.filter(p => p.status === 'ativo').length;
  const pacientesRetorno = mockPacientes.filter(p => p.status === 'retorno').length;
  const consultasMes = mockAgendamentos.length;

  const statusLabel: Record<string, string> = {
    agendado: 'Agendado',
    confirmado: 'Confirmado',
    realizado: 'Realizado',
    cancelado: 'Cancelado',
  };

  const statusBadge: Record<string, string> = {
    agendado: 'badge-info',
    confirmado: 'badge-success',
    realizado: 'badge-gray',
    cancelado: 'badge-danger',
  };

  const tipoLabel: Record<string, string> = {
    consulta: 'Consulta',
    retorno: 'Retorno',
    adaptacao: 'Adaptação',
  };

  return (
    <div className="page-container animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Bom dia! 👋</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-value">{agendamentosHoje.length}</div>
            <div className="stat-label">Consultas hoje</div>
          </div>
          <div className="stat-icon" style={{ background: '#DBEAFE' }}>
            <Calendar size={22} color="#2563EB" />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-value">{totalPacientes}</div>
            <div className="stat-label">Total de pacientes</div>
          </div>
          <div className="stat-icon" style={{ background: '#DCFCE7' }}>
            <Users size={22} color="#16A34A" />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-value">{consultasMes}</div>
            <div className="stat-label">Consultas no mês</div>
          </div>
          <div className="stat-icon" style={{ background: '#FEF9C3' }}>
            <TrendingUp size={22} color="#CA8A04" />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-value" style={{ color: pacientesRetorno > 0 ? 'var(--color-warning)' : undefined }}>
              {pacientesRetorno}
            </div>
            <div className="stat-label">Precisam retornar</div>
          </div>
          <div className="stat-icon" style={{ background: '#FEF3C7' }}>
            <AlertCircle size={22} color="#D97706" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Agenda hoje */}
        <div className="card">
          <div className="card-padding" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Agenda de hoje</h2>
              <Link href="/agenda" className="btn btn-secondary btn-sm">Ver todos</Link>
            </div>
          </div>

          {agendamentosHoje.length === 0 ? (
            <div className="empty-state">
              <Calendar size={40} className="empty-state-icon" />
              <div className="empty-state-title">Nenhuma consulta hoje</div>
              <div className="empty-state-text">Sua agenda está livre para hoje.</div>
            </div>
          ) : (
            <div>
              {agendamentosHoje.map(ag => (
                <div
                  key={ag.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 24px',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      textAlign: 'center',
                      background: 'var(--color-primary-light)',
                      borderRadius: 10,
                      padding: '8px 4px',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>{ag.hora}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{ag.pacienteNome}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{tipoLabel[ag.tipo]}</div>
                  </div>
                  <span className={`badge ${statusBadge[ag.status]}`}>{statusLabel[ag.status]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pacientes que precisam retornar */}
        <div className="card">
          <div className="card-padding" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>⚠️ Retornos pendentes</h2>
              <Link href="/retencao" className="btn btn-secondary btn-sm">Ver todos</Link>
            </div>
          </div>
          <div>
            {mockPacientes.filter(p => p.status === 'retorno').map(p => (
              <div key={p.id} style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  className="avatar"
                  style={{
                    background: '#FEF3C7',
                    color: '#92400E',
                    width: 34,
                    height: 34,
                    fontSize: 13,
                  }}
                >
                  {p.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 1 }}>
                    Última consulta: {p.ultimaConsulta ? new Date(p.ultimaConsulta + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}
                  </div>
                </div>
                <Link href={`/pacientes/${p.id}`} className="btn btn-sm btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}>Ver</Link>
              </div>
            ))}
            {mockPacientes.filter(p => p.status === 'retorno').length === 0 && (
              <div className="empty-state" style={{ padding: '30px 20px' }}>
                <div className="empty-state-title">Nenhum pendente</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
