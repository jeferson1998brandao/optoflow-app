'use client';

import { mockPacientes, mockProntuarios, mockProfissional } from '@/lib/mock-data';
import { useState } from 'react';
import { FileText, Download, Printer } from 'lucide-react';
import { Paciente, Prontuario } from '@/lib/types';

function formatGrau(val?: number) {
  if (val === undefined || val === null) return '—';
  return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
}

function PrescricaoPDF({ paciente, prontuario }: { paciente: Paciente; prontuario: Prontuario }) {
  return (
    <div
      id="receita-print"
      style={{
        background: 'white',
        borderRadius: 12,
        border: '1px solid var(--color-border)',
        maxWidth: 640,
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--color-sidebar)',
          color: 'white',
          padding: '24px 32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{mockProfissional.nome}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{mockProfissional.cro} · {mockProfissional.especialidade}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            <div>{mockProfissional.endereco}</div>
            <div>{mockProfissional.cidade} — {mockProfissional.estado}</div>
            <div>{mockProfissional.telefone}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '28px 32px' }}>
        {/* Patient */}
        <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '2px solid #F1F5F9' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Dados do Paciente</div>
          <div style={{ display: 'flex', gap: 40 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Nome</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{paciente.nome}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Data</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                {new Date(prontuario.data + 'T00:00:00').toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Prescription table */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Prescrição</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E2E8F0', fontWeight: 600 }}>Olho</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', border: '1px solid #E2E8F0', fontWeight: 600 }}>Esférico</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', border: '1px solid #E2E8F0', fontWeight: 600 }}>Cilíndrico</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', border: '1px solid #E2E8F0', fontWeight: 600 }}>Eixo</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', border: '1px solid #E2E8F0', fontWeight: 600 }}>Adição</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', border: '1px solid #E2E8F0', fontWeight: 600 }}>DNP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', fontWeight: 700 }}>OD</td>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>{formatGrau(prontuario.odEsferico)}</td>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>{formatGrau(prontuario.odCilindrico)}</td>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>{prontuario.odEixo ? `${prontuario.odEixo}°` : '—'}</td>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>{prontuario.odAdicao ? `+${prontuario.odAdicao.toFixed(2)}` : '—'}</td>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>{prontuario.dnpOD ? `${prontuario.dnpOD}mm` : '—'}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', fontWeight: 700 }}>OE</td>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>{formatGrau(prontuario.oeEsferico)}</td>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>{formatGrau(prontuario.oeCilindrico)}</td>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>{prontuario.oeEixo ? `${prontuario.oeEixo}°` : '—'}</td>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>{prontuario.oeAdicao ? `+${prontuario.oeAdicao.toFixed(2)}` : '—'}</td>
                <td style={{ padding: '10px 12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>{prontuario.dnpOE ? `${prontuario.dnpOE}mm` : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature */}
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <div style={{ width: 200, margin: '0 auto', borderTop: '1px solid var(--color-text)', paddingTop: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{mockProfissional.nome}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{mockProfissional.cro}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceitasPage() {
  const [selectedPacienteId, setSelectedPacienteId] = useState(mockPacientes[0].id);
  const prontuariosForPaciente = mockProntuarios.filter(p => p.pacienteId === selectedPacienteId);
  const [selectedProntuarioId, setSelectedProntuarioId] = useState(prontuariosForPaciente[0]?.id ?? '');

  const paciente = mockPacientes.find(p => p.id === selectedPacienteId)!;
  const prontuario = mockProntuarios.find(p => p.id === selectedProntuarioId);

  function handlePacienteChange(pid: string) {
    setSelectedPacienteId(pid);
    const prs = mockProntuarios.filter(p => p.pacienteId === pid);
    setSelectedProntuarioId(prs[0]?.id ?? '');
  }

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Receitas</h1>
          <p className="page-subtitle">Gere e imprima receitas para seus pacientes</p>
        </div>
      </div>

      {/* Selectors */}
      <div className="card card-padding" style={{ marginBottom: 24 }}>
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label">Paciente</label>
            <select
              className="input"
              value={selectedPacienteId}
              onChange={e => handlePacienteChange(e.target.value)}
            >
              {mockPacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Consulta</label>
            <select
              className="input"
              value={selectedProntuarioId}
              onChange={e => setSelectedProntuarioId(e.target.value)}
            >
              {prontuariosForPaciente.map(pr => (
                <option key={pr.id} value={pr.id}>
                  {new Date(pr.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                </option>
              ))}
              {prontuariosForPaciente.length === 0 && (
                <option disabled>Nenhuma consulta registrada</option>
              )}
            </select>
          </div>
        </div>

        {prontuario && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-primary" onClick={() => window.print()}>
              <Printer size={15} />
              Imprimir Receita
            </button>
            <button className="btn btn-secondary">
              <Download size={15} />
              Salvar PDF
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      {prontuario ? (
        <>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText size={14} />
            Prévia da receita
          </div>
          <PrescricaoPDF paciente={paciente} prontuario={prontuario} />
        </>
      ) : (
        <div className="card">
          <div className="empty-state">
            <FileText size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
            <div className="empty-state-title">Nenhum prontuário disponível</div>
            <div className="empty-state-text">Registre uma consulta para este paciente primeiro.</div>
          </div>
        </div>
      )}
    </div>
  );
}
