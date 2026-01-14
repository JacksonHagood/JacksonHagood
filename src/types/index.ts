// window management types
export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  icon: string;
}

export type WindowId = 'home' | 'resume' | 'projects' | 'interests';

// project types
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  projects: Project[];
}

// interest/blog types
export interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

// dock icon type
export interface DockIcon {
  id: WindowId;
  label: string;
  icon: string;
}

// top bar info
export interface TopBarInfo {
  site_name: string;
  email: string;
}
