'use client';

import { useState } from 'react';
import { mockPacientes, mockProntuarios } from '@/lib/mock-data';
import { ArrowLeft, Plus, FileText, Printer, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { Prontuario } from '@/lib/types';

interface Params {
  params: Promise<{ id: string }>;
}

export default function PacienteDetailPage({ params }: Params) {
  const { id } = use(params);
  const paciente = mockPacientes.find(p => p.id === id);
  const prontuarios = mockProntuarios.filter(p => p.pacienteId === id);
  const [expandedId, setExpandedId] = useState<string | null>(prontuarios[0]?.id ?? null);
  const [tab, setTab] = useState<'prontuario' | 'anamnese'>('prontuario');

  if (!paciente) {
    return (
      <div className="page-container">
        <p>Paciente não encontrado.</p>
        <Link href="/dashboard/pacientes" className="btn btn-secondary" style={{ marginTop: 12 }}>Voltar</Link>
      </div>
    );
  }

  function calcAge(dataNasc: string) {
    const diff = Date.now() - new Date(dataNasc + 'T00:00:00').getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  function formatGrau(val?: number) {
    if (val === undefined || val === null) return '—';
    return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
  }

  const ProntuarioCard = ({ pr }: { pr: Prontuario }) => {
    const isOpen = expandedId === pr.id;
    return (
      <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
        <button
          onClick={() => setExpandedId(isOpen ? null : pr.id)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderBottom: isOpen ? '1px solid var(--color-border)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileText size={18} color="var(--color-primary)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                Consulta — {new Date(pr.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
          {isOpen ? <ChevronUp size={18} color="var(--color-text-secondary)" /> : <ChevronDown size={18} color="var(--color-text-secondary)" />}
        </button>

        {isOpen && (
          <div style={{ padding: '20px' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F1F5F9', borderRadius: 8, padding: 4 }}>
              {(['prontuario', 'anamnese'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    background: tab === t ? 'white' : 'transparent',
                    color: tab === t ? 'var(--color-text)' : 'var(--color-text-secondary)',
                    boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  {t === 'prontuario' ? 'Prontuário Óptico' : 'Anamnese'}
                </button>
              ))}
            </div>

            {tab === 'prontuario' && (
              <>
                {/* Graus */}
                <div style={{ overflowX: 'auto', marginBottom: 20 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Olho</th>
                        <th>Esférico</th>
                        <th>Cilíndrico</th>
                        <th>Eixo</th>
                        <th>Adição</th>
                        <th>DNP</th>
                        <th>Acuidade</th>
                        <th>P.I.O.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>OD</strong></td>
                        <td>{formatGrau(pr.odEsferico)}</td>
                        <td>{formatGrau(pr.odCilindrico)}</td>
                        <td>{pr.odEixo ? `${pr.odEixo}°` : '—'}</td>
                        <td>{pr.odAdicao ? `+${pr.odAdicao.toFixed(2)}` : '—'}</td>
                        <td>{pr.dnpOD ? `${pr.dnpOD}mm` : (pr.dnp ? `${pr.dnp}mm` : '—')}</td>
                        <td>{pr.acuidadeOD || '—'}</td>
                        <td>{pr.pressaoOD ? `${pr.pressaoOD} mmHg` : '—'}</td>
                      </tr>
                      <tr>
                        <td><strong>OE</strong></td>
                        <td>{formatGrau(pr.oeEsferico)}</td>
                        <td>{formatGrau(pr.oeCilindrico)}</td>
                        <td>{pr.oeEixo ? `${pr.oeEixo}°` : '—'}</td>
                        <td>{pr.oeAdicao ? `+${pr.oeAdicao.toFixed(2)}` : '—'}</td>
                        <td>{pr.dnpOE ? `${pr.dnpOE}mm` : (pr.dnp ? `${pr.dnp}mm` : '—')}</td>
                        <td>{pr.acuidadeOE || '—'}</td>
                        <td>{pr.pressaoOE ? `${pr.pressaoOE} mmHg` : '—'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {pr.observacoes && (
                  <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '14px 16px', fontSize: 14 }}>
                    <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Observações</div>
                    <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>{pr.observacoes}</p>
                  </div>
                )}

                {/* Ações */}
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <Link
                    href={`/receitas?pacienteId=${paciente.id}&prontuarioId=${pr.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <FileText size={14} />
                    Gerar Receita PDF
                  </Link>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                    <Printer size={14} />
                    Imprimir
                  </button>
                </div>
              </>
            )}

            {tab === 'anamnese' && pr.anamnese && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Usa óculos atualmente?', value: pr.anamnese.usaOculos ? `Sim — há ${pr.anamnese.tempoUso || 'tempo indeterminado'}` : 'Não' },
                  { label: 'Histórico familiar de problemas oculares?', value: pr.anamnese.historicoFamiliar ? 'Sim' : 'Não' },
                  { label: 'Diabetes?', value: pr.anamnese.diabetes ? 'Sim' : 'Não' },
                  { label: 'Hipertensão?', value: pr.anamnese.hipertensao ? 'Sim' : 'Não' },
                  { label: 'Medicamentos em uso', value: pr.anamnese.medicamentos || 'Nenhum' },
                  { label: 'Queixa principal', value: pr.anamnese.queixaPrincipal || '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: 16, paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ width: 220, fontSize: 13, color: 'var(--color-text-secondary)', flexShrink: 0 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'anamnese' && !pr.anamnese && (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-secondary)', fontSize: 14 }}>
                Anamnese não registrada nesta consulta.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-container animate-fadeIn">
      {/* Back */}
      <Link href="/pacientes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={16} />
        Voltar para pacientes
      </Link>

      {/* Ficha do paciente */}
      <div className="card card-padding" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              className="avatar"
              style={{ width: 56, height: 56, fontSize: 20, background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              {paciente.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h1 className="page-title" style={{ fontSize: 20 }}>{paciente.nome}</h1>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4, display: 'flex', gap: 16 }}>
                <span>{calcAge(paciente.dataNascimento)} anos</span>
                <span>·</span>
                <span>{paciente.telefone}</span>
                <span>·</span>
                <span>{paciente.email}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href={`/agenda?paciente=${paciente.id}`} className="btn btn-secondary btn-sm">Agendar consulta</Link>
          </div>
        </div>
      </div>

      {/* Prontuários */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Histórico de Consultas</h2>
        <button className="btn btn-primary btn-sm">
          <Plus size={14} />
          Nova consulta
        </button>
      </div>

      {prontuarios.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
            <div className="empty-state-title">Nenhuma consulta registrada</div>
            <div className="empty-state-text">Clique em &quot;Nova consulta&quot; para iniciar.</div>
          </div>
        </div>
      ) : (
        prontuarios.map(pr => <ProntuarioCard key={pr.id} pr={pr} />)
      )}
    </div>
  );
}
