import { useState, useEffect, useCallback } from 'react';
import { TerminalBuffer, Project } from '../types';
import { 
  CONTENT_HEIGHT, 
  TERMINAL_WIDTH, 
  COLORS, 
  PROJECTS_MENU_WIDTH,
  PROJECTS_CONTENT_WIDTH 
} from '../constants';
import { 
  createEmptyBuffer, 
  writeText, 
  setCell,
  createCell 
} from '../utils/bufferUtils';
import { renderMarkdown } from '../utils/markdownRenderer';
import { PROJECTS, getDefaultProject } from '../content/projects';

// Project content stored as object for easy access
const projectContents: Record<string, string> = {
  'portfolio': `# Portfolio Website

A terminal-style personal portfolio built with React and TypeScript.

## Overview

This project showcases a unique approach to web design by rendering the entire interface as a grid of monospace characters, mimicking a traditional terminal experience.

## Features

- **ASCII Rendering**: All UI elements drawn with ASCII characters
- **Markdown Content**: Easy content management through markdown files
- **Responsive Design**: Scales to fit different screen sizes
- **Interactive Navigation**: Click-based terminal navigation

## Technologies Used

- React 18 with TypeScript
- SASS for styling
- Custom ASCII rendering engine
- Markdown parsing and rendering

## Implementation Details

The website uses a custom buffer-based rendering system where each character cell can be individually styled with colors and attributes.

---

*Built with lots of ASCII characters*
`,
  'cli-task-manager': `# CLI Task Manager

A command-line task management application built with Python.

## Overview

A powerful yet simple task manager that runs entirely in the terminal. Features include task prioritization, due dates, tags, and persistent storage.

## Features

- **Task Management**: Create, update, delete, and list tasks
- **Priority Levels**: High, medium, and low priority sorting
- **Due Dates**: Set and track deadlines
- **Tags**: Organize tasks with custom tags
- **Search**: Find tasks by keyword or tag
- **Export**: Export tasks to JSON or CSV

## Usage

\`\`\`bash
# Add a new task
task add "Complete project documentation" --priority high

# List all tasks
task list

# Mark task as complete
task done 1
\`\`\`

## Technologies

- Python 3.10+
- Click (CLI framework)
- SQLite for storage
- Rich for terminal formatting

---

*Making productivity terminal-friendly*
`,
  'api-framework': `# Web API Framework

A lightweight, fast web API framework built from scratch.

## Overview

This project is a custom HTTP framework designed for building RESTful APIs with minimal overhead and maximum flexibility.

## Features

- **Routing**: Declarative route definitions with parameter extraction
- **Middleware**: Composable middleware pipeline
- **Validation**: Built-in request validation
- **Documentation**: Auto-generated OpenAPI specs
- **Performance**: Optimized for high-throughput scenarios

## Example

\`\`\`typescript
import { Router, json, cors } from './framework';

const app = new Router();

app.use(json());
app.use(cors());

app.get('/users/:id', async (ctx) => {
  const user = await getUser(ctx.params.id);
  return ctx.json(user);
});

app.listen(3000);
\`\`\`

## Architecture

The framework follows a modular architecture:

- **Core**: Request/Response handling
- **Router**: URL matching and parameter extraction
- **Middleware**: Request/Response transformation
- **Validators**: Input validation and sanitization

---

*Building APIs the right way*
`,
};

interface ProjectMenuItem {
  project: Project;
  y: number;
  isSelected: boolean;
}

interface ProjectsPageResult {
  buffer: TerminalBuffer;
  totalHeight: number;
  menuItems: ProjectMenuItem[];
}

interface UseProjectsPageReturn {
  buffer: TerminalBuffer;
  scrollOffset: number;
  totalHeight: number;
  activeProjectId: string;
  scrollUp: () => void;
  scrollDown: () => void;
  handleScroll: (delta: number) => void;
  handleClick: (x: number, y: number) => void;
}

// Render the sidebar menu
const renderProjectMenu = (
  buffer: TerminalBuffer,
  activeProjectId: string
): { buffer: TerminalBuffer; menuItems: ProjectMenuItem[] } => {
  let result = buffer;
  const menuItems: ProjectMenuItem[] = [];
  
  // Draw menu header
  result = writeText(result, '┌' + '─'.repeat(PROJECTS_MENU_WIDTH - 2) + '┐', 0, 0, COLORS.border);
  result = writeText(result, '│ PROJECTS', 0, 1, COLORS.border);
  result = writeText(result, ' '.repeat(PROJECTS_MENU_WIDTH - 12) + '│', 11, 1, COLORS.border);
  result = writeText(result, '├' + '─'.repeat(PROJECTS_MENU_WIDTH - 2) + '┤', 0, 2, COLORS.border);
  
  // Draw menu items
  let menuY = 3;
  PROJECTS.forEach((project, index) => {
    const isSelected = project.id === activeProjectId;
    const prefix = isSelected ? '│▶ ' : '│  ';
    const projectName = project.name.length > PROJECTS_MENU_WIDTH - 6 
      ? project.name.slice(0, PROJECTS_MENU_WIDTH - 9) + '...'
      : project.name;
    const padding = ' '.repeat(Math.max(0, PROJECTS_MENU_WIDTH - 4 - projectName.length));
    
    const color = isSelected ? COLORS.accent : COLORS.foreground;
    const bgColor = isSelected ? COLORS.background : COLORS.background;
    
    result = writeText(result, prefix, 0, menuY, COLORS.border);
    result = writeText(result, projectName, 3, menuY, color, bgColor, isSelected);
    result = writeText(result, padding + '│', 3 + projectName.length, menuY, COLORS.border);
    
    menuItems.push({
      project,
      y: menuY,
      isSelected,
    });
    
    menuY += 1;
  });
  
  // Draw menu footer
  result = writeText(result, '└' + '─'.repeat(PROJECTS_MENU_WIDTH - 2) + '┘', 0, menuY, COLORS.border);
  
  // Fill rest of menu column with vertical line
  for (let y = menuY + 1; y < CONTENT_HEIGHT; y++) {
    result = setCell(result, PROJECTS_MENU_WIDTH - 1, y, createCell('│', COLORS.border));
  }
  
  return { buffer: result, menuItems };
};

export const useProjectsPage = (initialProjectId?: string): UseProjectsPageReturn => {
  const [activeProjectId, setActiveProjectId] = useState(
    initialProjectId || getDefaultProject().id
  );
  const [scrollOffset, setScrollOffset] = useState(0);
  const [pageData, setPageData] = useState<ProjectsPageResult>({
    buffer: createEmptyBuffer(TERMINAL_WIDTH, CONTENT_HEIGHT),
    totalHeight: 0,
    menuItems: [],
  });

  useEffect(() => {
    // Create base buffer
    let buffer = createEmptyBuffer(TERMINAL_WIDTH, CONTENT_HEIGHT);
    
    // Render sidebar menu
    const { buffer: menuBuffer, menuItems } = renderProjectMenu(buffer, activeProjectId);
    buffer = menuBuffer;
    
    // Get project content
    const content = projectContents[activeProjectId] || '# Project Not Found\n\nNo content available.';
    
    // Render project content
    const contentResult = renderMarkdown(
      content, 
      PROJECTS_CONTENT_WIDTH, 
      CONTENT_HEIGHT, 
      scrollOffset
    );
    
    // Merge content into main buffer (offset by menu width)
    contentResult.buffer.forEach((row, y) => {
      row.forEach((cell, x) => {
        const destX = x + PROJECTS_MENU_WIDTH + 1;
        if (destX < TERMINAL_WIDTH && y < CONTENT_HEIGHT) {
          buffer[y][destX] = cell;
        }
      });
    });
    
    setPageData({
      buffer,
      totalHeight: contentResult.totalHeight,
      menuItems,
    });
  }, [activeProjectId, scrollOffset]);

  const scrollUp = useCallback(() => {
    setScrollOffset(prev => Math.max(0, prev - 3));
  }, []);

  const scrollDown = useCallback(() => {
    setScrollOffset(prev => 
      Math.min(Math.max(0, pageData.totalHeight - CONTENT_HEIGHT), prev + 3)
    );
  }, [pageData.totalHeight]);

  const handleScroll = useCallback((delta: number) => {
    if (delta < 0) {
      scrollUp();
    } else {
      scrollDown();
    }
  }, [scrollUp, scrollDown]);

  const handleClick = useCallback((x: number, y: number) => {
    // Check if click is in menu area
    if (x < PROJECTS_MENU_WIDTH) {
      const menuItem = pageData.menuItems.find(item => item.y === y);
      if (menuItem) {
        setActiveProjectId(menuItem.project.id);
        setScrollOffset(0); // Reset scroll when changing projects
      }
    }
  }, [pageData.menuItems]);

  return {
    buffer: pageData.buffer,
    scrollOffset,
    totalHeight: pageData.totalHeight,
    activeProjectId,
    scrollUp,
    scrollDown,
    handleScroll,
    handleClick,
  };
};
