import React from 'react';
import { WindowId, WindowState } from '../../types';
import { useCurrentTime } from '../../hooks';
import './dock.scss';

interface DockItem {
  id: WindowId;
  icon: string;
  label: string;
}

interface DockProps {
  items: DockItem[];
  windows: Map<WindowId, WindowState>;
  on_item_click: (id: WindowId) => void;
}

export const Dock: React.FC<DockProps> = ({ items, windows, on_item_click }) => {
  const current_time = useCurrentTime();
  
  const is_window_open = (id: WindowId): boolean => {
    const window = windows.get(id);
    return window?.isOpen ?? false;
  };

  return (
    <nav className="dock">
      <div className="dock-left">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <div className="dock-divider" />}
            <button
              className={`dock-item ${is_window_open(item.id) ? 'active' : ''}`}
              onClick={() => on_item_click(item.id)}
              title={item.label}
            >
              <span className="dock-icon">{item.icon}</span>
              <span className="dock-label">{item.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
      
      <div className="dock-right">
        <span className="dock-time">{current_time}</span>
      </div>
    </nav>
  );
};
