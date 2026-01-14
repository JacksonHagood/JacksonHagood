import { useState, useCallback } from 'react';
import { WindowState, WindowId, WindowPosition } from '../types';

// window dimension constants in characters
const WINDOW_CHAR_WIDTH = 256;
const WINDOW_CHAR_HEIGHT = 64;
const CHAR_WIDTH = 8; // approximate width of monospace character at 14px font
const CHAR_HEIGHT = 16; // approximate line height for monospace font

interface WindowConfig {
  id: WindowId;
  title: string;
  icon: string;
  default_open?: boolean;
}

const WINDOW_CONFIGS: WindowConfig[] = [
  { id: 'home', title: 'About Me', icon: '🏠', default_open: true },
  { id: 'resume', title: 'Resume', icon: '📄', default_open: false },
  { id: 'projects', title: 'Projects', icon: '💻', default_open: false },
  { id: 'interests', title: 'Interests', icon: '🎮', default_open: false },
];

// calculate window size from character dimensions
const get_default_window_size = (): { width: number; height: number } => {
  return {
    width: WINDOW_CHAR_WIDTH * CHAR_WIDTH,
    height: WINDOW_CHAR_HEIGHT * CHAR_HEIGHT,
  };
};

const get_initial_position = (index: number): WindowPosition => ({
  x: 100 + index * 40,
  y: 80 + index * 40,
});

const create_initial_windows = (): Map<WindowId, WindowState> => {
  const windows = new Map<WindowId, WindowState>();
  const default_size = get_default_window_size();
  
  WINDOW_CONFIGS.forEach((config, index) => {
    windows.set(config.id, {
      id: config.id,
      title: config.title,
      icon: config.icon,
      isOpen: config.default_open ?? false,
      position: get_initial_position(index),
      size: default_size,
      zIndex: config.default_open ? 10 : 0,
    });
  });
  
  return windows;
};

export const useWindowManager = () => {
  const [windows, setWindows] = useState<Map<WindowId, WindowState>>(create_initial_windows);
  const [max_z_index, set_max_z_index] = useState(10);

  const open_window = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const new_windows = new Map(prev);
      const window = new_windows.get(id);
      
      if (window) {
        const new_z_index = max_z_index + 1;
        set_max_z_index(new_z_index);
        new_windows.set(id, { ...window, isOpen: true, zIndex: new_z_index });
      }
      
      return new_windows;
    });
  }, [max_z_index]);

  const close_window = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const new_windows = new Map(prev);
      const window = new_windows.get(id);
      
      if (window) {
        new_windows.set(id, { ...window, isOpen: false });
      }
      
      return new_windows;
    });
  }, []);

  const focus_window = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const new_windows = new Map(prev);
      const window = new_windows.get(id);
      
      if (window && window.isOpen) {
        const new_z_index = max_z_index + 1;
        set_max_z_index(new_z_index);
        new_windows.set(id, { ...window, zIndex: new_z_index });
      }
      
      return new_windows;
    });
  }, [max_z_index]);

  const update_window_position = useCallback((id: WindowId, position: WindowPosition) => {
    setWindows((prev) => {
      const new_windows = new Map(prev);
      const window = new_windows.get(id);
      
      if (window) {
        new_windows.set(id, { ...window, position });
      }
      
      return new_windows;
    });
  }, []);

  const get_window = useCallback((id: WindowId): WindowState | undefined => {
    return windows.get(id);
  }, [windows]);

  const get_open_windows = useCallback((): WindowState[] => {
    return Array.from(windows.values()).filter((w) => w.isOpen);
  }, [windows]);

  const get_all_windows = useCallback((): WindowState[] => {
    return Array.from(windows.values());
  }, [windows]);

  return {
    windows,
    open_window,
    close_window,
    focus_window,
    update_window_position,
    get_window,
    get_open_windows,
    get_all_windows,
  };
};
