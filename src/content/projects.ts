import { Project } from '../types';

// Project definitions - add new projects here
export const PROJECTS: Project[] = [
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    contentPath: 'portfolio.md',
  },
  {
    id: 'cli-task-manager',
    name: 'CLI Task Manager',
    contentPath: 'cli-task-manager.md',
  },
  {
    id: 'api-framework',
    name: 'Web API Framework',
    contentPath: 'api-framework.md',
  },
];

// Get project by ID
export const getProjectById = (id: string): Project | undefined => {
  return PROJECTS.find(p => p.id === id);
};

// Get default project (first in list)
export const getDefaultProject = (): Project => {
  return PROJECTS[0];
};
