import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TabName, TERMINAL_WIDTH, TERMINAL_HEIGHT, CONTENT_HEIGHT, TABS } from './constants';
import { TerminalBuffer } from './types';
import { createEmptyBuffer, mergeBuffers } from './utils/bufferUtils';
import { renderDock, formatTime, getTabFromClick } from './utils/dockUtils';
import { useHomePage } from './pages/HomePage';
import { useResumePage } from './pages/ResumePage';
import { useProjectsPage } from './pages/ProjectsPage';
import TerminalRenderer from './components/TerminalRenderer';
import './styles/main.scss';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [currentTime, setCurrentTime] = useState(formatTime());

  // Initialize page hooks
  const homePage = useHomePage();
  const resumePage = useResumePage();
  const projectsPage = useProjectsPage();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get current page buffer and handlers based on active tab
  const getCurrentPage = useCallback(() => {
    switch (activeTab) {
      case 'home':
        return homePage;
      case 'resume':
        return resumePage;
      case 'projects':
        return projectsPage;
      default:
        return homePage;
    }
  }, [activeTab, homePage, resumePage, projectsPage]);

  // Render dock and get clickable regions
  const dockResult = useMemo(() => {
    return renderDock(activeTab, currentTime);
  }, [activeTab, currentTime]);

  // Build the complete terminal buffer
  const terminalBuffer = useMemo((): TerminalBuffer => {
    // Start with empty buffer
    let buffer = createEmptyBuffer(TERMINAL_WIDTH, TERMINAL_HEIGHT);

    // Get current page content
    const currentPage = getCurrentPage();
    
    // Merge page content into buffer
    buffer = mergeBuffers(buffer, currentPage.buffer, 0, 0);

    // Merge dock at bottom
    buffer = mergeBuffers(buffer, dockResult.buffer, 0, CONTENT_HEIGHT);

    return buffer;
  }, [getCurrentPage, dockResult]);

  // Build dock clickable regions with offset applied
  const dockClickableRegions = useMemo(() => {
    return dockResult.clickableRegions.map(region => ({
      ...region,
      y: region.y + CONTENT_HEIGHT,
    }));
  }, [dockResult]);

  // Build clickable regions combining dock and page regions
  const clickableRegions = useMemo(() => {
    const pageRegions: Array<{ x: number; y: number; width: number; height: number; id: string }> = [];

    // Add resume download region if on resume page
    if (activeTab === 'resume') {
      pageRegions.push({
        ...resumePage.downloadRegion,
        id: 'download-resume',
      });
    }

    // Add project menu regions if on projects page
    if (activeTab === 'projects') {
      // Add clickable regions for the project menu
      for (let y = 3; y < CONTENT_HEIGHT; y++) {
        pageRegions.push({
          x: 0,
          y,
          width: 30,
          height: 1,
          id: `project-menu-${y}`,
        });
      }
    }

    return [...dockClickableRegions, ...pageRegions];
  }, [activeTab, dockClickableRegions, resumePage.downloadRegion]);

  // Handle cell click
  const handleCellClick = useCallback((x: number, y: number) => {
    // Check if click is in dock area
    if (y >= CONTENT_HEIGHT) {
      const tab = getTabFromClick(x, y - CONTENT_HEIGHT, dockClickableRegions.map(r => ({
        ...r,
        y: r.y - CONTENT_HEIGHT,
      })));
      if (tab) {
        setActiveTab(tab);
        return;
      }
    }

    // Handle page-specific clicks
    const currentPage = getCurrentPage();
    if ('handleClick' in currentPage && typeof currentPage.handleClick === 'function') {
      currentPage.handleClick(x, y);
    }
  }, [dockClickableRegions, getCurrentPage]);

  // Handle scroll events
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const currentPage = getCurrentPage();
    if ('handleScroll' in currentPage && typeof currentPage.handleScroll === 'function') {
      currentPage.handleScroll(event.deltaY);
    }
  }, [getCurrentPage]);

  // Add wheel event listener
  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => handleWheel(e);
    window.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => window.removeEventListener('wheel', handleWheelEvent);
  }, [handleWheel]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentPage = getCurrentPage();
      
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if ('scrollUp' in currentPage) {
            currentPage.scrollUp();
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if ('scrollDown' in currentPage) {
            currentPage.scrollDown();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          // Tab navigation
          const currentIndex = TABS.indexOf(activeTab);
          if (event.key === 'ArrowLeft' && currentIndex > 0) {
            setActiveTab(TABS[currentIndex - 1]);
          } else if (event.key === 'ArrowRight' && currentIndex < TABS.length - 1) {
            setActiveTab(TABS[currentIndex + 1]);
          }
          break;
        case '1':
        case '2':
        case '3':
          // Number keys for tab selection
          const tabIndex = parseInt(event.key) - 1;
          if (tabIndex >= 0 && tabIndex < TABS.length) {
            setActiveTab(TABS[tabIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, getCurrentPage]);

  return (
    <TerminalRenderer
      buffer={terminalBuffer}
      onCellClick={handleCellClick}
      clickableRegions={clickableRegions}
    />
  );
};

export default App;
