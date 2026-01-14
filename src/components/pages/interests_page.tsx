import React, { useState } from 'react';
import { BlogPost } from '../../types';
import { useJsonContent } from '../../hooks';
import { AsciiBox, AsciiDivider, AsciiSection, ASCII_CHARS } from '../ascii_box';
import './pages.scss';

interface Interest {
  emoji: string;
  name: string;
  description: string;
}

interface InterestsData {
  interests: Interest[];
  posts: BlogPost[];
}

export const InterestsPage: React.FC = () => {
  const { data, loading } = useJsonContent<InterestsData>('/content/interests.json');
  const [expanded_post, set_expanded_post] = useState<string | null>(null);

  const toggle_post = (post_id: string): void => {
    set_expanded_post(expanded_post === post_id ? null : post_id);
  };

  const format_date = (date_string: string): string => {
    const date = new Date(date_string);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading || !data) {
    return (
      <div className="page-content interests-page">
        <div className="loading">loading...</div>
      </div>
    );
  }

  return (
    <div className="page-content interests-page">
      <h1>Interests & Blog</h1>
      
      <AsciiDivider width={70} variant="double" />
      
      <AsciiSection title="Hobbies" width={70}>
        <p>Beyond coding, here are some things I'm passionate about:</p>
        
        <div className="interests-list">
          {data.interests.map((interest) => (
            <div key={interest.name} className="interest-item">
              <span className="interest-emoji">{interest.emoji}</span>
              <span className="interest-name highlight">{interest.name}</span>
              <span className="interest-desc muted"> {ASCII_CHARS.line_h} {interest.description}</span>
            </div>
          ))}
        </div>
      </AsciiSection>
      
      <AsciiSection title="Blog Posts" width={70}>
        <div className="blog-posts">
          {data.posts.map((post) => (
            <AsciiBox key={post.id} width={65}>
              <div 
                className="post-header"
                onClick={() => toggle_post(post.id)}
                style={{ cursor: 'pointer' }}
              >
                <span className="post-toggle">
                  {expanded_post === post.id ? '[-]' : '[+]'}
                </span>
                <span className="post-title">{post.title}</span>
                <span className="post-date muted">{format_date(post.date)}</span>
              </div>
              
              {expanded_post === post.id && (
                <div className="post-content">
                  <div className="post-body">
                    <p>{post.content}</p>
                  </div>
                  <div className="post-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </AsciiBox>
          ))}
        </div>
      </AsciiSection>
      
      <AsciiDivider width={70} />
    </div>
  );
};
