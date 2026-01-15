import React, { useMemo } from 'react';
import { TerminalBuffer, TerminalCell as TerminalCellType, CellClickHandler } from '../types';

interface TerminalRendererProps {
  buffer: TerminalBuffer;
  onCellClick?: CellClickHandler;
  clickableRegions?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
  }>;
}

const isClickable = (
  x: number,
  y: number,
  regions: TerminalRendererProps['clickableRegions']
): string | null => {
  if (!regions) return null;
  
  const region = regions.find(
    r => x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height
  );
  
  return region?.id ?? null;
};

const TerminalCellComponent: React.FC<{
  cell: TerminalCellType;
  x: number;
  y: number;
  clickable: boolean;
  onClick?: () => void;
}> = React.memo(({ cell, clickable, onClick }) => {
  const style: React.CSSProperties = {
    color: cell.color,
    backgroundColor: cell.backgroundColor,
  };

  const classNames = [
    'terminal__cell',
    cell.bold && 'terminal__cell--bold',
    cell.underline && 'terminal__cell--underline',
    clickable && 'terminal__cell--clickable',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classNames}
      style={style}
      onClick={clickable ? onClick : undefined}
    >
      {cell.char}
    </span>
  );
});

TerminalCellComponent.displayName = 'TerminalCell';

const TerminalRow: React.FC<{
  row: TerminalCellType[];
  y: number;
  clickableRegions?: TerminalRendererProps['clickableRegions'];
  onCellClick?: CellClickHandler;
}> = React.memo(({ row, y, clickableRegions, onCellClick }) => {
  return (
    <div className="terminal__row">
      {row.map((cell, x) => {
        const clickableId = isClickable(x, y, clickableRegions);
        return (
          <TerminalCellComponent
            key={x}
            cell={cell}
            x={x}
            y={y}
            clickable={clickableId !== null}
            onClick={() => onCellClick?.(x, y)}
          />
        );
      })}
    </div>
  );
});

TerminalRow.displayName = 'TerminalRow';

const TerminalRenderer: React.FC<TerminalRendererProps> = ({
  buffer,
  onCellClick,
  clickableRegions,
}) => {
  const [scale, setScale] = React.useState(1);
  const terminalRef = React.useRef<HTMLDivElement>(null);

  // Calculate scale to fit terminal in viewport
  React.useEffect(() => {
    const calculateScale = () => {
      if (!terminalRef.current) return;
      
      // Get terminal natural dimensions (128 cols * 9px, 64 rows * 16px)
      const terminalWidth = buffer[0]?.length * 9 || 1152;
      const terminalHeight = buffer.length * 16 || 1024;
      
      // Get available viewport size with padding
      const availableWidth = window.innerWidth - 32;
      const availableHeight = window.innerHeight - 32;
      
      // Calculate scale to fit
      const scaleX = availableWidth / terminalWidth;
      const scaleY = availableHeight / terminalHeight;
      const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
      
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [buffer]);

  const rows = useMemo(
    () =>
      buffer.map((row, y) => (
        <TerminalRow
          key={y}
          row={row}
          y={y}
          clickableRegions={clickableRegions}
          onCellClick={onCellClick}
        />
      )),
    [buffer, clickableRegions, onCellClick]
  );

  return (
    <div className="terminal-container">
      <div 
        className="terminal" 
        ref={terminalRef}
        style={{ transform: `scale(${scale})` }}
      >
        {rows}
      </div>
    </div>
  );
};

export default React.memo(TerminalRenderer);
