import React from 'react';
import { useMarkdownContent, useTextContent } from '../../hooks';
import { AsciiDivider } from '../ascii_box';
import './pages.scss';

export const HomePage: React.FC = () => {
  const { content: ascii_banner, loading: banner_loading } = useTextContent('/ascii/name_banner.txt');
  const { content: markdown_content, loading: content_loading } = useMarkdownContent('/content/home.md');

  if (banner_loading || content_loading) {
    return (
      <div className="page-content home-page">
        <div className="loading">loading...</div>
      </div>
    );
  }

  return (
    <div className="page-content home-page">
      <pre className="ascii-banner">{ascii_banner}</pre>
      
      <AsciiDivider width={80} variant="double" />
      
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: markdown_content }}
      />
      
      <AsciiDivider width={80} />
    </div>
  );
};
