import React from 'react';
import './top_bar.scss';

interface TopBarProps {
  site_name: string;
  email: string;
}

export const TopBar: React.FC<TopBarProps> = ({ site_name, email }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-site-name">{site_name}</span>
      </div>
      
      <div className="topbar-right">
        <div className="topbar-email">
          <span className="email-icon">📧</span>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </div>
    </header>
  );
};
