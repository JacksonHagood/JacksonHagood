import React from 'react';
import { WindowId } from './types';
import { useWindowManager } from './hooks';
import {
  Desktop,
  TopBar,
  Dock,
  Window,
  HomePage,
  ResumePage,
  ProjectsPage,
  InterestsPage,
} from './components';
import './styles/global.scss';

// configuration
const CONFIG = {
  site_name: 'Jackson Hagood',
  email: 'your.email@example.com', // TODO: update with your email
  background_image: undefined as string | undefined, // TODO: add background image path
};

// dock items configuration
const DOCK_ITEMS: Array<{ id: WindowId; icon: string; label: string }> = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'resume', icon: '📄', label: 'Resume' },
  { id: 'projects', icon: '💻', label: 'Projects' },
  { id: 'interests', icon: '🎮', label: 'Interests' },
];

// map window ids to their content components
const WINDOW_CONTENT: Record<WindowId, React.ReactNode> = {
  home: <HomePage />,
  resume: <ResumePage />,
  projects: <ProjectsPage />,
  interests: <InterestsPage />,
};

const App: React.FC = () => {
  const {
    windows,
    open_window,
    close_window,
    focus_window,
    update_window_position,
    get_open_windows,
  } = useWindowManager();

  const handle_dock_item_click = (id: WindowId): void => {
    const window = windows.get(id);
    if (window?.isOpen) {
      focus_window(id);
    } else {
      open_window(id);
    }
  };

  const open_windows = get_open_windows();
  
  // find the window with the highest z-index (the focused one)
  const get_focused_window_id = (): WindowId | null => {
    if (open_windows.length === 0) return null;
    return open_windows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).id as WindowId;
  };
  
  const focused_window_id = get_focused_window_id();

  return (
    <>
      <TopBar site_name={CONFIG.site_name} email={CONFIG.email} />
      
      <Desktop background_image={CONFIG.background_image}>
        {open_windows.map((window_state) => (
          <Window
            key={window_state.id}
            window_state={window_state}
            is_focused={window_state.id === focused_window_id}
            on_close={close_window}
            on_focus={focus_window}
            on_move={update_window_position}
          >
            {WINDOW_CONTENT[window_state.id as WindowId]}
          </Window>
        ))}
      </Desktop>
      
      <Dock
        items={DOCK_ITEMS}
        windows={windows}
        on_item_click={handle_dock_item_click}
      />
    </>
  );
};

export default App;
