import React, { ReactNode } from 'react';
import './ascii_box.scss';

// ascii box characters
const CHARS = {
  // single line
  corner_tl: '┌',
  corner_tr: '┐',
  corner_bl: '└',
  corner_br: '┘',
  line_h: '─',
  line_v: '│',
  tee_t: '┬',
  tee_b: '┴',
  tee_l: '├',
  tee_r: '┤',
  cross: '┼',
  // double line
  corner_tl_d: '╔',
  corner_tr_d: '╗',
  corner_bl_d: '╚',
  corner_br_d: '╝',
  line_h_d: '═',
  line_v_d: '║',
  tee_l_d: '╠',
  tee_r_d: '╣',
  // decorative
  arrow_r: '→',
  arrow_l: '←',
  bullet: '•',
};

interface AsciiBoxProps {
  children: ReactNode;
  title?: string;
  width?: number;
  variant?: 'single' | 'double';
  className?: string;
}

export const AsciiBox: React.FC<AsciiBoxProps> = ({
  children,
  title,
  width = 60,
  variant = 'single',
  className = '',
}) => {
  const chars = variant === 'double' 
    ? {
        tl: CHARS.corner_tl_d,
        tr: CHARS.corner_tr_d,
        bl: CHARS.corner_bl_d,
        br: CHARS.corner_br_d,
        h: CHARS.line_h_d,
        v: CHARS.line_v_d,
        tee_l: CHARS.tee_l_d,
        tee_r: CHARS.tee_r_d,
      }
    : {
        tl: CHARS.corner_tl,
        tr: CHARS.corner_tr,
        bl: CHARS.corner_bl,
        br: CHARS.corner_br,
        h: CHARS.line_h,
        v: CHARS.line_v,
        tee_l: CHARS.tee_l,
        tee_r: CHARS.tee_r,
      };

  const inner_width = width - 2;
  
  const render_top = (): string => {
    if (title) {
      const title_segment = ` ${title} `;
      const remaining = inner_width - title_segment.length;
      const left_pad = Math.floor(remaining / 2);
      const right_pad = remaining - left_pad;
      return chars.tl + chars.h.repeat(left_pad) + title_segment + chars.h.repeat(right_pad) + chars.tr;
    }
    return chars.tl + chars.h.repeat(inner_width) + chars.tr;
  };

  const render_bottom = (): string => {
    return chars.bl + chars.h.repeat(inner_width) + chars.br;
  };

  return (
    <div className={`ascii-box ${className}`}>
      <div className="ascii-box-border top">{render_top()}</div>
      <div className="ascii-box-body">
        <span className="ascii-box-edge">{chars.v}</span>
        <div className="ascii-box-content">{children}</div>
        <span className="ascii-box-edge">{chars.v}</span>
      </div>
      <div className="ascii-box-border bottom">{render_bottom()}</div>
    </div>
  );
};

interface AsciiDividerProps {
  width?: number;
  variant?: 'single' | 'double';
  className?: string;
}

export const AsciiDivider: React.FC<AsciiDividerProps> = ({
  width = 60,
  variant = 'single',
  className = '',
}) => {
  const char = variant === 'double' ? CHARS.line_h_d : CHARS.line_h;
  return <div className={`ascii-divider ${className}`}>{char.repeat(width)}</div>;
};

interface AsciiSectionProps {
  children: ReactNode;
  title: string;
  width?: number;
  className?: string;
}

export const AsciiSection: React.FC<AsciiSectionProps> = ({
  children,
  title,
  width = 60,
  className = '',
}) => {
  const inner_width = width - 2;
  const title_segment = `┤ ${title} ├`;
  const remaining = inner_width - title_segment.length;
  const line = CHARS.line_h.repeat(Math.floor(remaining / 2));
  
  return (
    <div className={`ascii-section ${className}`}>
      <div className="ascii-section-header">
        {line}{title_segment}{line}{remaining % 2 === 1 ? CHARS.line_h : ''}
      </div>
      <div className="ascii-section-content">{children}</div>
    </div>
  );
};

// export characters for use in other components
export const ASCII_CHARS = CHARS;
