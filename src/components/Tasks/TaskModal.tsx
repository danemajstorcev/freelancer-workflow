import { useState } from "react";
import type { Task, TaskStatus, Priority } from "../../types";
import { uid, today } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";
import {
  Overlay,
  ModalBox,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Field,
  Label,
  Input,
  Textarea,
  Select,
  FieldRow,
  Button,
  IconBtn,
} from "../UI/primitives";

interface Props {
  task?: Task;
  defaultProjectId?: string;
  onSave: (t: Task) => void;
  onClose: () => void;
}

const TASK_STATUSES: TaskStatus[] = ["Todo", "In Progress", "Done"];
const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

export default function TaskModal({
  task,
  defaultProjectId,
  onSave,
  onClose,
}: Props) {
  const { state } = useApp();

  const [form, setForm] = useState({
    projectId:
      task?.projectId ?? defaultProjectId ?? state.projects[0]?.id ?? "",
    title: task?.title ?? "",
    notes: task?.notes ?? "",
    status: task?.status ?? ("Todo" as TaskStatus),
    priority: task?.priority ?? ("Medium" as Priority),
    dueDate: task?.dueDate ?? "",
  });

  const set = (key: keyof typeof form, val: unknown) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({
      ...form,
      id: task?.id ?? uid(),
      createdAt: task?.createdAt ?? today(),
    });
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{task ? "Edit Task" : "New Task"}</h2>
          <IconBtn onClick={onClose}>✕</IconBtn>
        </ModalHeader>

        <ModalBody>
          <Field>
            <Label>Project *</Label>
            <Select
              value={form.projectId}
              onChange={(e) => set("projectId", e.target.value)}
            >
              {state.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Task Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Write homepage copy"
            />
          </Field>

          <FieldRow>
            <Field>
              <Label>Status</Label>
              <Select
                value={form.status}
                onChange={(e) => set("status", e.target.value as TaskStatus)}
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onChange={(e) => set("priority", e.target.value as Priority)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
            </Field>
          </FieldRow>

          <Field>
            <Label>Due Date</Label>
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
            />
          </Field>

          <Field>
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any additional context…"
            />
          </Field>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!form.title.trim()}>
            {task ? "Save Changes" : "Add Task"}
          </Button>
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
}
