import { TabName } from './constants';

// Terminal Cell
export interface TerminalCell {
  char: string;
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  underline?: boolean;
}

// Terminal Buffer - 2D grid of cells
export type TerminalBuffer = TerminalCell[][];

// Page Content
export interface PageContent {
  title: string;
  content: string;
}

// Project Info
export interface Project {
  id: string;
  name: string;
  contentPath: string;
}

// Navigation State
export interface NavigationState {
  activeTab: TabName;
  activeProject: string | null;
}

// Markdown Node Types
export type MarkdownNodeType = 
  | 'text'
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'link'
  | 'list'
  | 'listItem'
  | 'code'
  | 'codeBlock'
  | 'bold'
  | 'italic'
  | 'blockquote'
  | 'horizontalRule';

// Parsed Markdown Node
export interface MarkdownNode {
  type: MarkdownNodeType;
  content?: string;
  children?: MarkdownNode[];
  level?: number; // For headings
  src?: string; // For images
  alt?: string; // For images
  href?: string; // For links
  language?: string; // For code blocks
  ordered?: boolean; // For lists
}

// Render Options
export interface RenderOptions {
  width: number;
  startX?: number;
  startY?: number;
  color?: string;
  backgroundColor?: string;
}

// Time Display
export interface TimeDisplay {
  hours: string;
  minutes: string;
  seconds: string;
  formatted: string;
}

// Click Handler
export type CellClickHandler = (x: number, y: number) => void;

// Component Props
export interface TerminalProps {
  buffer: TerminalBuffer;
  onClick?: CellClickHandler;
}

export interface DockProps {
  activeTab: TabName;
  onTabClick: (tab: TabName) => void;
}

export interface PageProps {
  width: number;
  height: number;
  onNavigate?: (project: string) => void;
}

export interface ProjectsPageProps extends PageProps {
  activeProject: string | null;
  onProjectSelect: (projectId: string) => void;
}
