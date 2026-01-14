import React from 'react';
import { useMarkdownContent } from '../../hooks';
import { AsciiBox, AsciiDivider } from '../ascii_box';
import './pages.scss';

// path to resume pdf
const RESUME_PDF_PATH = '/resume.pdf';

export const ResumePage: React.FC = () => {
  const { content: markdown_content, loading } = useMarkdownContent('/content/resume.md');

  const handle_download = (): void => {
    const link = document.createElement('a');
    link.href = RESUME_PDF_PATH;
    link.download = 'Jackson_Hagood_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="page-content resume-page">
        <div className="loading">loading...</div>
      </div>
    );
  }

  return (
    <div className="page-content resume-page">
      <h1>Resume</h1>
      
      <AsciiDivider width={80} variant="double" />
      
      <AsciiBox title="Resume" width={80}>
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: markdown_content }}
        />
      </AsciiBox>
      
      <AsciiDivider width={80} />
      
      <div className="section">
        <button 
          className="download-button"
          onClick={handle_download}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};
