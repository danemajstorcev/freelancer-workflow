import { useState } from 'react';
import type { Client, ClientStatus } from '../../types';
import { uid, today, AVATAR_COLORS } from '../../utils/helpers';
import {
  Overlay, ModalBox, ModalHeader, ModalBody, ModalFooter,
  Field, Label, Input, Textarea, Select, FieldRow, Button, IconBtn,
} from '../UI/primitives';

interface Props {
  client?:  Client;
  onSave:   (c: Client) => void;
  onClose:  () => void;
}

const STATUSES: ClientStatus[] = ['Lead', 'Contacted', 'Negotiation', 'Closed'];

const blank = (): Omit<Client, 'id' | 'createdAt'> => ({
  name: '', company: '', email: '', phone: '',
  status: 'Lead', tags: [], value: 0, notes: '',
  avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
});

export default function ClientModal({ client, onSave, onClose }: Props) {
  const [form, setForm] = useState(client ?? { ...blank(), id: '', createdAt: '' });
  const [tagInput, setTagInput] = useState('');

  const set = (key: keyof Client, val: unknown) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const removeTag = (t: string) => set('tags', form.tags.filter((x) => x !== t));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      ...form,
      id:        client?.id ?? uid(),
      createdAt: client?.createdAt ?? today(),
    });
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{client ? 'Edit Client' : 'New Client'}</h2>
          <IconBtn onClick={onClose}>✕</IconBtn>
        </ModalHeader>

        <ModalBody>
          <FieldRow>
            <Field>
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Smith" />
            </Field>
            <Field>
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Acme Inc." />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@acme.com" />
            </Field>
            <Field>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555 0100" />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => set('status', e.target.value as ClientStatus)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field>
              <Label>Deal Value ($)</Label>
              <Input type="number" value={form.value} onChange={(e) => set('value', Number(e.target.value))} placeholder="0" />
            </Field>
          </FieldRow>

          <Field>
            <Label>Tags</Label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag, press Enter"
                style={{ flex: 1 }}
              />
              <Button variant="ghost" size="sm" onClick={addTag} type="button">Add</Button>
            </div>
            {form.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {form.tags.map((t) => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '99px', background: 'var(--bg-tag)' }}>
                    {t}
                    <button onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, lineHeight: 1, padding: 0 }}>✕</button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Any relevant context…" />
          </Field>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {client ? 'Save Changes' : 'Add Client'}
          </Button>
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
}
