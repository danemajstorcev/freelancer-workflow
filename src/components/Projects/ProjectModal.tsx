import { useState } from 'react';
import type { Project, ProjectStatus, Priority } from '../../types';
import { uid, today } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import {
  Overlay, ModalBox, ModalHeader, ModalBody, ModalFooter,
  Field, Label, Input, Textarea, Select, FieldRow, Button, IconBtn,
} from '../UI/primitives';

interface Props {
  project?:         Project;
  defaultClientId?: string;
  onSave:           (p: Project) => void;
  onClose:          () => void;
}

const PROJECT_STATUSES: ProjectStatus[] = ['Not Started', 'In Progress', 'Review', 'Completed', 'On Hold'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];

export default function ProjectModal({ project, defaultClientId, onSave, onClose }: Props) {
  const { state } = useApp();

  const [form, setForm] = useState<Omit<Project, 'id' | 'createdAt'>>({
    clientId:    project?.clientId    ?? defaultClientId ?? (state.clients[0]?.id ?? ''),
    name:        project?.name        ?? '',
    description: project?.description ?? '',
    status:      project?.status      ?? 'Not Started',
    priority:    project?.priority    ?? 'Medium',
    budget:      project?.budget      ?? 0,
    deadline:    project?.deadline    ?? '',
    tags:        project?.tags        ?? [],
  });

  const set = (key: keyof typeof form, val: unknown) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({ ...form, id: project?.id ?? uid(), createdAt: project?.createdAt ?? today() });
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{project ? 'Edit Project' : 'New Project'}</h2>
          <IconBtn onClick={onClose}>✕</IconBtn>
        </ModalHeader>

        <ModalBody>
          <Field>
            <Label>Client *</Label>
            <Select value={form.clientId} onChange={(e) => set('clientId', e.target.value)}>
              {state.clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Project Name *</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Brand Redesign" />
          </Field>

          <Field>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What does this project involve?" />
          </Field>

          <FieldRow>
            <Field>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => set('status', e.target.value as ProjectStatus)}>
                {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field>
              <Label>Priority</Label>
              <Select value={form.priority} onChange={(e) => set('priority', e.target.value as Priority)}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </Select>
            </Field>
          </FieldRow>

          <FieldRow>
            <Field>
              <Label>Budget ($)</Label>
              <Input type="number" value={form.budget} onChange={(e) => set('budget', Number(e.target.value))} />
            </Field>
            <Field>
              <Label>Deadline</Label>
              <Input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
            </Field>
          </FieldRow>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.clientId}>
            {project ? 'Save Changes' : 'Add Project'}
          </Button>
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
}
