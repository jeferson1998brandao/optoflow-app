'use client';

import { useState } from 'react';
import { mockProfissional } from '@/lib/mock-data';
import { Save, Building, User, Phone, MapPin } from 'lucide-react';

export default function PerfilPage() {
  const [form, setForm] = useState({ ...mockProfissional });
  const [saved, setSaved] = useState(false);

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Perfil do Profissional</h1>
          <p className="page-subtitle">Estas informações aparecem na receita gerada</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} style={{ background: saved ? 'var(--color-success)' : undefined }}>
          <Save size={15} />
          {saved ? 'Salvo!' : 'Salvar alterações'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Personal info */}
        <div className="card card-padding">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <User size={18} color="var(--color-primary)" />
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Dados Pessoais</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Nome completo</label>
              <input className="input" value={form.nome} onChange={e => handleChange('nome', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Número do CRO</label>
              <input className="input" value={form.cro} onChange={e => handleChange('cro', e.target.value)} placeholder="Ex: CRO-SP 12345" />
            </div>
            <div className="input-group">
              <label className="input-label">Especialidade</label>
              <input className="input" value={form.especialidade ?? ''} onChange={e => handleChange('especialidade', e.target.value)} placeholder="Ex: Optometria Clínica" />
            </div>
            <div className="input-group">
              <label className="input-label">E-mail</label>
              <input className="input" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card card-padding">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Phone size={18} color="var(--color-primary)" />
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Contato</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Telefone / WhatsApp</label>
              <input className="input" value={form.telefone} onChange={e => handleChange('telefone', e.target.value)} placeholder="(11) 99999-0000" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card card-padding" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <MapPin size={18} color="var(--color-primary)" />
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Endereço do Consultório</h2>
          </div>
          <div className="form-grid">
            <div className="input-group col-span-2">
              <label className="input-label">Endereço</label>
              <input className="input" value={form.endereco} onChange={e => handleChange('endereco', e.target.value)} placeholder="Rua, número, complemento" />
            </div>
            <div className="input-group">
              <label className="input-label">Cidade</label>
              <input className="input" value={form.cidade} onChange={e => handleChange('cidade', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Estado</label>
              <select className="input" value={form.estado} onChange={e => handleChange('estado', e.target.value)}>
                {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preview card */}
        <div className="card card-padding" style={{ gridColumn: 'span 2', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Building size={18} color="var(--color-text-secondary)" />
            <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)' }}>Prévia do cabeçalho da receita</h2>
          </div>
          <div
            style={{
              background: 'var(--color-sidebar)',
              borderRadius: 10,
              padding: '18px 24px',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{form.nome || 'Nome do Profissional'}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                {form.cro} {form.especialidade ? `· ${form.especialidade}` : ''}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              <div>{form.endereco}</div>
              <div>{form.cidade}{form.estado ? ` — ${form.estado}` : ''}</div>
              <div>{form.telefone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
