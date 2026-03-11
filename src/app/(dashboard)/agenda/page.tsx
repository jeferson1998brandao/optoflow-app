'use client';

import { useState } from 'react';
import { mockAgendamentos, mockPacientes } from '@/lib/mock-data';
import { Plus, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { Agendamento } from '@/lib/types';

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}

export default function AgendaPage() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1); // Monday
    return d;
  });

  const [showModal, setShowModal] = useState(false);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(mockAgendamentos);
  const [form, setForm] = useState({
    pacienteId: '',
    data: formatDate(new Date()),
    hora: '09:00',
    tipo: 'consulta' as 'consulta' | 'retorno' | 'adaptacao',
    status: 'agendado' as 'agendado' | 'confirmado' | 'realizado' | 'cancelado',
    observacoes: '',
  });

  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(startDate, i));

  const statusBadge: Record<string, string> = {
    agendado: 'badge-info',
    confirmado: 'badge-success',
    realizado: 'badge-gray',
    cancelado: 'badge-danger',
  };

  const statusLabel: Record<string, string> = {
    agendado: 'Agendado',
    confirmado: 'Confirmado',
    realizado: 'Realizado',
    cancelado: 'Cancelado',
  };

  const tipoColors: Record<string, string> = {
    consulta: '#DBEAFE',
    retorno: '#FEF3C7',
    adaptacao: '#DCFCE7',
  };

  const tipoTextColors: Record<string, string> = {
    consulta: '#1E40AF',
    retorno: '#92400E',
    adaptacao: '#166534',
  };

  const tipoLabel: Record<string, string> = {
    consulta: 'Consulta',
    retorno: 'Retorno',
    adaptacao: 'Adaptação',
  };

  function agendamentoForDay(date: Date): Agendamento[] {
    const d = formatDate(date);
    return agendamentos
      .filter(a => a.data === d)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  const isToday = (d: Date) => formatDate(d) === formatDate(new Date());

  function handleSalvar() {
    if (!form.pacienteId || !form.data || !form.hora) return;
    const paciente = mockPacientes.find(p => p.id === form.pacienteId);
    if (!paciente) return;

    const novo: Agendamento = {
      id: `ag-${Date.now()}`,
      pacienteId: form.pacienteId,
      pacienteNome: paciente.nome,
      data: form.data,
      hora: form.hora,
      tipo: form.tipo,
      status: form.status,
      observacoes: form.observacoes,
    };

    setAgendamentos(prev => [...prev, novo]);
    setShowModal(false);
    setForm({
      pacienteId: '',
      data: formatDate(new Date()),
      hora: '09:00',
      tipo: 'consulta',
      status: 'agendado',
      observacoes: '',
    });
  }

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Agenda</h1>
          <p className="page-subtitle">Visão semanal dos agendamentos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Novo agendamento
        </button>
      </div>

      {/* Week navigation */}
      <div className="card card-padding" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setStartDate(d => addDays(d, -7))}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ fontWeight: 600, fontSize: 15 }}>
          {startDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} —{' '}
          {addDays(startDate, 5).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setStartDate(d => addDays(d, 7))}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Week grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {weekDays.map(day => {
          const ags = agendamentoForDay(day);
          const today = isToday(day);
          return (
            <div key={day.toISOString()} className="card" style={{ minHeight: 180 }}>
              {/* Day header */}
              <div
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--color-border)',
                  background: today ? 'var(--color-primary)' : undefined,
                  borderRadius: today ? '12px 12px 0 0' : undefined,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: today ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)', letterSpacing: '0.06em' }}>
                  {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: today ? 'white' : 'var(--color-text)', lineHeight: 1.2 }}>
                  {day.getDate()}
                </div>
              </div>

              {/* Appointments */}
              <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ags.length === 0 ? (
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'center', padding: '16px 4px', opacity: 0.6 }}>
                    Livre
                  </div>
                ) : (
                  ags.map(ag => (
                    <div
                      key={ag.id}
                      style={{
                        background: tipoColors[ag.tipo],
                        borderRadius: 6,
                        padding: '7px 10px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                        <Clock size={11} color={tipoTextColors[ag.tipo]} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: tipoTextColors[ag.tipo] }}>{ag.hora}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#1E293B', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ag.pacienteNome.split(' ')[0]}
                      </div>
                      <div style={{ fontSize: 10, color: tipoTextColors[ag.tipo], marginTop: 2 }}>
                        {tipoLabel[ag.tipo]}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
        {Object.entries(tipoLabel).map(([tipo, label]) => (
          <div key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: tipoColors[tipo] }} />
            {label}
          </div>
        ))}
      </div>

      {/* Modal Novo Agendamento */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28, position: 'relative' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Novo Agendamento</h2>
              <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Paciente */}
              <div className="form-group">
                <label className="form-label">Paciente *</label>
                <select
                  className="form-input"
                  value={form.pacienteId}
                  onChange={e => setForm(f => ({ ...f, pacienteId: e.target.value }))}
                >
                  <option value="">Selecione o paciente</option>
                  {mockPacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>

              {/* Data e Hora */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Data *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.data}
                    onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hora *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={form.hora}
                    onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                  />
                </div>
              </div>

              {/* Tipo */}
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select
                  className="form-input"
                  value={form.tipo}
                  onChange={e => setForm(f => ({ ...f, tipo: e.target.value as typeof form.tipo }))}
                >
                  <option value="consulta">Consulta</option>
                  <option value="retorno">Retorno</option>
                  <option value="adaptacao">Adaptação de Lentes</option>
                </select>
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as typeof form.status }))}
                >
                  <option value="agendado">Agendado</option>
                  <option value="confirmado">Confirmado</option>
                </select>
              </div>

              {/* Observações */}
              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Observações opcionais..."
                  value={form.observacoes}
                  onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSalvar}
                disabled={!form.pacienteId || !form.data || !form.hora}
              >
                <Plus size={16} />
                Salvar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
