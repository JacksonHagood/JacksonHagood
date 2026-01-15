import { TerminalBuffer } from '../types';
import { TabName, TERMINAL_WIDTH, DOCK_HEIGHT, COLORS, BOX_CHARS, TABS, EMAIL } from '../constants';
import { createEmptyBuffer, writeText, drawHorizontalLine, setCell, createCell, padText } from './bufferUtils';

interface ClickableRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}

interface DockRenderResult {
  buffer: TerminalBuffer;
  clickableRegions: ClickableRegion[];
}

// Format current time
export const formatTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Render the dock at the bottom of the screen
export const renderDock = (
  activeTab: TabName,
  time: string
): DockRenderResult => {
  const buffer = createEmptyBuffer(TERMINAL_WIDTH, DOCK_HEIGHT);
  const clickableRegions: ClickableRegion[] = [];
  
  let result = buffer;
  
  // Draw top border of dock
  result = drawHorizontalLine(result, 0, 0, TERMINAL_WIDTH, BOX_CHARS.horizontal, COLORS.border);
  result = setCell(result, 0, 0, createCell(BOX_CHARS.teeRight, COLORS.border));
  result = setCell(result, TERMINAL_WIDTH - 1, 0, createCell(BOX_CHARS.teeLeft, COLORS.border));
  
  // Render tabs on the left
  let tabX = 2;
  TABS.forEach((tab) => {
    const isActive = tab === activeTab;
    const tabLabel = ` ${tab.toUpperCase()} `;
    
    // Draw tab with brackets
    const displayLabel = isActive ? `[${tabLabel}]` : ` ${tabLabel} `;
    const color = isActive ? COLORS.accent : COLORS.foreground;
    const bgColor = isActive ? COLORS.background : COLORS.background;
    
    result = writeText(result, displayLabel, tabX, 1, color, bgColor, isActive);
    
    clickableRegions.push({
      x: tabX,
      y: 1,
      width: displayLabel.length,
      height: 1,
      id: `tab-${tab}`,
    });
    
    tabX += displayLabel.length + 1;
  });
  
  // Render time and email on the right
  const rightInfo = `${EMAIL} │ ${time}`;
  const rightX = TERMINAL_WIDTH - rightInfo.length - 2;
  result = writeText(result, rightInfo, rightX, 1, COLORS.dim);
  
  // Bottom padding line (empty)
  result = writeText(result, padText('', TERMINAL_WIDTH), 0, 2, COLORS.foreground, COLORS.background);
  
  return { buffer: result, clickableRegions };
};

// Get tab from click position
export const getTabFromClick = (x: number, y: number, regions: ClickableRegion[]): TabName | null => {
  const region = regions.find(
    r => x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height && r.id.startsWith('tab-')
  );
  
  if (region) {
    return region.id.replace('tab-', '') as TabName;
  }
  
  return null;
};
