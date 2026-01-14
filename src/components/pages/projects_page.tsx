import React, { useState } from 'react';
import { ProjectCategory, Project } from '../../types';
import { useJsonContent } from '../../hooks';
import { AsciiBox, AsciiDivider, ASCII_CHARS } from '../ascii_box';
import './pages.scss';

interface ProjectsData {
  categories: ProjectCategory[];
}

export const ProjectsPage: React.FC = () => {
  const { data, loading } = useJsonContent<ProjectsData>('/content/projects.json');
  const [active_tab, set_active_tab] = useState<string>('');

  // set default tab when data loads
  React.useEffect(() => {
    if (data?.categories && data.categories.length > 0 && !active_tab) {
      set_active_tab(data.categories[0].id);
    }
  }, [data, active_tab]);

  if (loading || !data) {
    return (
      <div className="page-content projects-page">
        <div className="loading">loading...</div>
      </div>
    );
  }

  const categories = data.categories;
  const active_category = categories.find((cat) => cat.id === active_tab);

  const render_tabs = (): React.ReactNode => {
    return (
      <div className="projects-tabs">
        <span className="tab-border-top">
          {ASCII_CHARS.corner_tl + categories.map((cat) => 
            ASCII_CHARS.line_h.repeat(cat.name.length + 4)
          ).join(ASCII_CHARS.tee_t) + ASCII_CHARS.corner_tr}
        </span>
        <div className="tab-row">
          <span className="tab-edge">{ASCII_CHARS.line_v}</span>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <button
                className={`tab-button ${active_tab === category.id ? 'active' : ''}`}
                onClick={() => set_active_tab(category.id)}
              >
                {` ${category.name} `}
              </button>
              <span className="tab-edge">{ASCII_CHARS.line_v}</span>
            </React.Fragment>
          ))}
        </div>
        <span className="tab-border-bottom">
          {active_tab === categories[0].id ? ASCII_CHARS.corner_br : ASCII_CHARS.tee_b}
          {categories.map((cat, i) => {
            const width = cat.name.length + 4;
            if (cat.id === active_tab) {
              return ' '.repeat(width);
            }
            return ASCII_CHARS.line_h.repeat(width) + (i < categories.length - 1 ? ASCII_CHARS.tee_b : '');
          }).join('')}
          {active_tab === categories[categories.length - 1].id ? ASCII_CHARS.corner_bl : ASCII_CHARS.tee_b}
        </span>
      </div>
    );
  };

  const render_project = (project: Project): React.ReactNode => {
    return (
      <AsciiBox key={project.id} title={project.title} width={70}>
        <p className="project-description">{project.description}</p>
        
        <div className="project-tech">
          <span className="muted">tech: </span>
          {project.technologies.map((tech, i) => (
            <span key={tech} className="tech-tag">
              {tech}{i < project.technologies.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        
        <div className="project-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              {ASCII_CHARS.arrow_r} GitHub
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              {ASCII_CHARS.arrow_r} Demo
            </a>
          )}
        </div>
      </AsciiBox>
    );
  };

  return (
    <div className="page-content projects-page">
      <h1>Projects</h1>
      
      {render_tabs()}
      
      <div className="projects-content">
        {active_category?.projects.map(render_project)}
      </div>
      
      <AsciiDivider width={70} />
    </div>
  );
};
