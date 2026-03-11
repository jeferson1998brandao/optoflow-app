import { mockPacientes } from '@/lib/mock-data';
import { AlertCircle, Mail, Phone } from 'lucide-react';

export default function RetencaoPage() {
  const hoje = new Date();
  const onzeMonths = 335; // 11 months in days

  function daysSinceConsulta(dateStr?: string) {
    if (!dateStr) return Infinity;
    const diff = hoje.getTime() - new Date(dateStr + 'T00:00:00').getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  const pendentes = mockPacientes
    .map(p => ({ ...p, diasSemConsulta: daysSinceConsulta(p.ultimaConsulta) }))
    .filter(p => p.diasSemConsulta >= onzeMonths)
    .sort((a, b) => b.diasSemConsulta - a.diasSemConsulta);

  function urgencyBadge(dias: number) {
    if (dias >= 730) return { label: 'Crítico (+2 anos)', cls: 'badge-danger' };
    if (dias >= 365) return { label: 'Urgente (+1 ano)', cls: 'badge-warning' };
    return { label: 'Retorno pendente', cls: 'badge-info' };
  }

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Retenção de Pacientes</h1>
          <p className="page-subtitle">Pacientes que estão há mais de 11 meses sem retornar</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary">
            <Mail size={15} />
            Enviar e-mail para todos
          </button>
        </div>
      </div>

      {/* Summary card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card card-padding" style={{ borderLeft: '3px solid var(--color-warning)' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{pendentes.length}</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>Pacientes para reativar</div>
        </div>
        <div className="card card-padding" style={{ borderLeft: '3px solid var(--color-danger)' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{pendentes.filter(p => p.diasSemConsulta >= 730).length}</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>Críticos (+2 anos)</div>
        </div>
        <div className="card card-padding" style={{ borderLeft: '3px solid var(--color-info)' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{mockPacientes.filter(p => p.status === 'ativo').length}</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>Pacientes ativos</div>
        </div>
      </div>

      {pendentes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <AlertCircle size={40} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.3 }} />
            <div className="empty-state-title">Nenhum paciente pendente</div>
            <div className="empty-state-text">Todos os seus pacientes estão em dia com os retornos. 🎉</div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Última consulta</th>
                  <th>Dias sem retorno</th>
                  <th>Situação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pendentes.map(p => {
                  const { label, cls } = urgencyBadge(p.diasSemConsulta);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            className="avatar"
                            style={{ background: '#FEF3C7', color: '#92400E', width: 34, height: 34, fontSize: 13 }}
                          >
                            {p.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 14 }}>{p.nome}</div>
                            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {p.ultimaConsulta
                          ? new Date(p.ultimaConsulta + 'T00:00:00').toLocaleDateString('pt-BR')
                          : <span style={{ color: 'var(--color-text-secondary)' }}>Nunca</span>}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          {p.diasSemConsulta === Infinity ? '—' : `${p.diasSemConsulta} dias`}
                        </span>
                      </td>
                      <td><span className={`badge ${cls}`}>{label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-sm btn-secondary" title="Enviar e-mail">
                            <Mail size={14} />
                          </button>
                          <button className="btn btn-sm btn-secondary" title="Ligar">
                            <Phone size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
