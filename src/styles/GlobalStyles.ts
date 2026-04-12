import { createGlobalStyle } from 'styled-components';
import type { AppTheme } from './theme';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { font-size: 16px; -webkit-font-smoothing: antialiased; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    transition: background 0.25s ease, color 0.25s ease;
    min-height: 100vh;
  }

  button { cursor: pointer; font-family: inherit; }
  input, textarea, select { font-family: inherit; }
  a { text-decoration: none; color: inherit; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 99px;
  }

  /* Drag ghost */
  [draggable=true] { cursor: grab; }
  [draggable=true]:active { cursor: grabbing; }
`;
