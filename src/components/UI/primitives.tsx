import styled, { css } from "styled-components";

interface ButtonProps {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md";
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  @media (max-width: 600px) {
    align-items: flex-end;
    padding: 0;
  }
  gap: 6px;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radiusSm};
  border: none;
  transition: all 0.15s ease;
  white-space: nowrap;
  font-family: inherit;

  ${({ size = "md" }) =>
    size === "sm"
      ? css`
          font-size: 0.78rem;
          padding: 6px 12px;
        `
      : css`
          font-size: 0.875rem;
          padding: 9px 16px;
        `}

  ${({ variant = "primary", theme }) => {
    if (variant === "primary")
      return css`
        background: ${theme.accent};
        color: #fff;
        &:hover {
          background: ${theme.accentHover};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        &:active {
          transform: none;
        }
      `;
    if (variant === "ghost")
      return css`
        background: ${theme.bgHover};
        color: ${theme.text};
        &:hover {
          background: ${theme.border};
        }
      `;
    if (variant === "danger")
      return css`
        background: ${theme.dangerLight};
        color: ${theme.danger};
        &:hover {
          background: ${theme.danger};
          color: #fff;
        }
      `;
  }}
`;

interface BadgeProps {
  color?: string;
  bg?: string;
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  @media (max-width: 600px) {
    align-items: flex-end;
    padding: 0;
  }
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 99px;
  color: ${({ color, theme }) => color ?? theme.accent};
  background: ${({ bg, theme }) => bg ?? theme.accentLight};
`;

export function clientStatusColor(
  status: string,
  theme: any,
): { color: string; bg: string } {
  const map: Record<string, { color: string; bg: string }> = {
    Lead: { color: theme.info, bg: theme.infoLight },
    Contacted: { color: theme.warning, bg: theme.warningLight },
    Negotiation: { color: theme.accent, bg: theme.accentLight },
    Closed: { color: theme.success, bg: theme.successLight },
  };
  return map[status] ?? { color: theme.textSub, bg: theme.bgTag };
}

export function projectStatusColor(
  status: string,
  theme: any,
): { color: string; bg: string } {
  const map: Record<string, { color: string; bg: string }> = {
    "Not Started": { color: theme.textSub, bg: theme.bgTag },
    "In Progress": { color: theme.info, bg: theme.infoLight },
    Review: { color: theme.warning, bg: theme.warningLight },
    Completed: { color: theme.success, bg: theme.successLight },
    "On Hold": { color: theme.danger, bg: theme.dangerLight },
  };
  return map[status] ?? { color: theme.textSub, bg: theme.bgTag };
}

export function priorityColor(
  priority: string,
  theme: any,
): { color: string; bg: string } {
  const map: Record<string, { color: string; bg: string }> = {
    Low: { color: theme.success, bg: theme.successLight },
    Medium: { color: theme.warning, bg: theme.warningLight },
    High: { color: theme.danger, bg: theme.dangerLight },
  };
  return map[priority] ?? { color: theme.textSub, bg: theme.bgTag };
}

interface AvatarProps {
  bg: string;
  size?: number;
}

export const Avatar = styled.div<AvatarProps>`
  width: ${({ size = 36 }) => size}px;
  height: ${({ size = 36 }) => size}px;
  border-radius: 50%;
  background: ${({ bg }) => bg};
  color: #fff;
  font-weight: 700;
  font-size: ${({ size = 36 }) => size * 0.38}px;
  display: flex;
  align-items: center;
  @media (max-width: 600px) {
    align-items: flex-end;
    padding: 0;
  }
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.02em;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  @media (max-width: 600px) {
    align-items: flex-end;
    padding: 0;
  }
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.15s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }
`;

export const ModalBox = styled.div`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radiusLg};
  box-shadow: ${({ theme }) => theme.shadowLg};
  width: 100%;
  max-width: 540px;
  @media (max-width: 600px) {
    max-width: 100%;
    max-height: 92vh;
    margin-top: auto;
    border-radius: 16px 16px 0 0;
  }
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 600px) {
    align-items: flex-end;
    padding: 0;
  }
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  h2 {
    font-size: 1rem;
    font-weight: 700;
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textSub};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const Input = styled.input`
  background: ${({ theme }) => theme.bgInput};
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radiusSm};
  color: ${({ theme }) => theme.text};
  padding: 9px 12px;
  font-size: 0.875rem;
  transition: border-color 0.15s;
  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
  }
`;

export const Textarea = styled.textarea`
  background: ${({ theme }) => theme.bgInput};
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radiusSm};
  color: ${({ theme }) => theme.text};
  padding: 9px 12px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
  }
`;

export const Select = styled.select`
  background: ${({ theme }) => theme.bgInput};
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radiusSm};
  color: ${({ theme }) => theme.text};
  padding: 9px 12px;
  font-size: 0.875rem;
  appearance: none;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
  }
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
  gap: 0.75rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 600px) {
    align-items: flex-end;
    padding: 0;
  }
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  color: ${({ theme }) => theme.textMuted};
  text-align: center;

  .icon {
    font-size: 2.5rem;
    opacity: 0.4;
  }
  .title {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${({ theme }) => theme.textSub};
  }
  .sub {
    font-size: 0.78rem;
    max-width: 240px;
    line-height: 1.6;
  }
`;

export const IconBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textMuted};
  display: flex;
  align-items: center;
  @media (max-width: 600px) {
    align-items: flex-end;
    padding: 0;
  }
  justify-content: center;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radiusSm};
  transition:
    color 0.15s,
    background 0.15s;
  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.bgHover};
  }
`;
