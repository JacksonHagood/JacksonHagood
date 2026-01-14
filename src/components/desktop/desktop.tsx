import React, { ReactNode } from 'react';
import './desktop.scss';

interface DesktopProps {
  background_image?: string;
  children: ReactNode;
}

export const Desktop: React.FC<DesktopProps> = ({ background_image, children }) => {
  const style: React.CSSProperties = background_image
    ? { backgroundImage: `url(${background_image})` }
    : {};

  return (
    <div 
      className={`desktop ${background_image ? 'has-background' : ''}`}
      style={style}
    >
      <div className="desktop-content">
        {children}
      </div>
    </div>
  );
};
