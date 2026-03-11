'use client';

import { useState } from 'react';
import { mockAgendamentos } from '@/lib/mock-data';
import { Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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
    return mockAgendamentos
      .filter(a => a.data === d)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  const isToday = (d: Date) => formatDate(d) === formatDate(new Date());

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Agenda</h1>
          <p className="page-subtitle">Visão semanal dos agendamentos</p>
        </div>
        <button className="btn btn-primary">
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
    </div>
  );
}
