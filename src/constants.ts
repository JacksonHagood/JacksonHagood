// Terminal Dimensions
export const TERMINAL_WIDTH = 128;
export const TERMINAL_HEIGHT = 64;
export const DOCK_HEIGHT = 3;
export const CONTENT_HEIGHT = TERMINAL_HEIGHT - DOCK_HEIGHT;

// Projects Submenu
export const PROJECTS_MENU_WIDTH = 30;
export const PROJECTS_CONTENT_WIDTH = TERMINAL_WIDTH - PROJECTS_MENU_WIDTH - 1;

// Colors (Hex with Alpha - #RRGGBBAA)
export const COLORS = {
  background: '#0d0d0dff',
  foreground: '#e0e0e0ff',
  accent: '#4fc3f7ff',
  accentDim: '#4fc3f780',
  border: '#3a3a3aff',
  selection: '#1e88e5ff',
  highlight: '#2e7d32ff',
  dim: '#757575ff',
  error: '#ef5350ff',
  warning: '#ffb74dff',
} as const;

// ASCII Box Characters
export const BOX_CHARS = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
  teeRight: '├',
  teeLeft: '┤',
  teeDown: '┬',
  teeUp: '┴',
  cross: '┼',
} as const;

// Tab Names
export const TABS = ['home', 'resume', 'projects'] as const;
export type TabName = typeof TABS[number];

// Contact Info
export const EMAIL = 'jagmachat@gmail.com';
export const NAME = 'Jackson Hagood';
