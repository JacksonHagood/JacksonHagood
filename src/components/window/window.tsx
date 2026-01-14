import React, { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { WindowState, WindowId, WindowPosition } from '../../types';
import './window.scss';

// window dimension constants in characters
const WINDOW_CHAR_WIDTH = 256;
const WINDOW_CHAR_HEIGHT = 64;

interface WindowProps {
  window_state: WindowState;
  is_focused: boolean;
  on_close: (id: WindowId) => void;
  on_focus: (id: WindowId) => void;
  on_move: (id: WindowId, position: WindowPosition) => void;
  children: ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  window_state,
  is_focused,
  on_close,
  on_focus,
  on_move,
  children,
}) => {
  const { id, title, position, size, zIndex } = window_state;
  const [is_dragging, set_is_dragging] = useState(false);
  const [drag_offset, set_drag_offset] = useState<WindowPosition>({ x: 0, y: 0 });
  const window_ref = useRef<HTMLDivElement>(null);
  const content_ref = useRef<HTMLDivElement>(null);

  const handle_mouse_down = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.control-button')) return;
      
      on_focus(id as WindowId);
      set_is_dragging(true);
      set_drag_offset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [id, position, on_focus]
  );

  const handle_mouse_move = useCallback(
    (e: MouseEvent) => {
      if (!is_dragging) return;
      
      const new_x = Math.max(0, e.clientX - drag_offset.x);
      const new_y = Math.max(40, e.clientY - drag_offset.y);
      
      on_move(id as WindowId, { x: new_x, y: new_y });
    },
    [is_dragging, drag_offset, id, on_move]
  );

  const handle_mouse_up = useCallback(() => {
    set_is_dragging(false);
  }, []);

  useEffect(() => {
    if (is_dragging) {
      document.addEventListener('mousemove', handle_mouse_move);
      document.addEventListener('mouseup', handle_mouse_up);
      
      return () => {
        document.removeEventListener('mousemove', handle_mouse_move);
        document.removeEventListener('mouseup', handle_mouse_up);
      };
    }
  }, [is_dragging, handle_mouse_move, handle_mouse_up]);

  // keyboard navigation for scrolling when window is focused
  useEffect(() => {
    if (!is_focused) return;
    
    const scroll_amount = 40;
    
    const handle_key_down = (e: KeyboardEvent) => {
      if (!content_ref.current) return;
      
      switch (e.key) {
        case 'ArrowUp':
          content_ref.current.scrollTop -= scroll_amount;
          e.preventDefault();
          break;
        case 'ArrowDown':
          content_ref.current.scrollTop += scroll_amount;
          e.preventDefault();
          break;
        case 'PageUp':
          content_ref.current.scrollTop -= content_ref.current.clientHeight;
          e.preventDefault();
          break;
        case 'PageDown':
          content_ref.current.scrollTop += content_ref.current.clientHeight;
          e.preventDefault();
          break;
        case 'Home':
          content_ref.current.scrollTop = 0;
          e.preventDefault();
          break;
        case 'End':
          content_ref.current.scrollTop = content_ref.current.scrollHeight;
          e.preventDefault();
          break;
      }
    };
    
    document.addEventListener('keydown', handle_key_down);
    return () => document.removeEventListener('keydown', handle_key_down);
  }, [is_focused]);

  const handle_window_click = useCallback(() => {
    on_focus(id as WindowId);
  }, [id, on_focus]);

  const handle_close = useCallback(() => {
    on_close(id as WindowId);
  }, [id, on_close]);

  // scroll handler for mouse wheel
  const handle_wheel = useCallback((e: React.WheelEvent) => {
    if (content_ref.current) {
      content_ref.current.scrollTop += e.deltaY;
    }
  }, []);

  // generate ascii horizontal line - fill remaining width
  const generate_horizontal_line = (): string => {
    // subtract 2 for the corner characters
    return '─'.repeat(Math.max(0, WINDOW_CHAR_WIDTH - 2));
  };

  // generate ascii vertical lines for the frame
  const generate_vertical_lines = (): string[] => {
    // subtract 2 for top and bottom border rows
    return Array(WINDOW_CHAR_HEIGHT - 2).fill('│');
  };

  return (
    <div
      ref={window_ref}
      className={`window ${is_focused ? 'focused' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      onClick={handle_window_click}
      onWheel={handle_wheel}
    >
      <div className="titlebar" onMouseDown={handle_mouse_down}>
        <div className="titlebar-left">
          <span className="titlebar-title">{title}</span>
        </div>
        <div className="titlebar-controls">
          <button className="control-button close" onClick={handle_close} title="Close">
            ×
          </button>
        </div>
      </div>
      
      <div className="window-content">
        <div className="content-frame">
          <div className="frame-top">
            <span className="frame-corner">┌</span>
            <span className="frame-horizontal">{generate_horizontal_line()}</span>
            <span className="frame-corner">┐</span>
          </div>
          
          <div className="frame-body">
            <div className="frame-vertical">
              {generate_vertical_lines().map((char, i) => (
                <span key={i}>{char}</span>
              ))}
            </div>
            
            <div className="frame-content" ref={content_ref}>
              {children}
            </div>
            
            <div className="frame-vertical">
              {generate_vertical_lines().map((char, i) => (
                <span key={i}>{char}</span>
              ))}
            </div>
          </div>
          
          <div className="frame-bottom">
            <span className="frame-corner">└</span>
            <span className="frame-horizontal">{generate_horizontal_line()}</span>
            <span className="frame-corner">┘</span>
          </div>
        </div>
      </div>
    </div>
  );
};
