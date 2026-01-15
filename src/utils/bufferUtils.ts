import { TerminalBuffer, TerminalCell } from '../types';
import { TERMINAL_WIDTH, TERMINAL_HEIGHT, COLORS, BOX_CHARS } from '../constants';

// Create an empty terminal buffer
export const createEmptyBuffer = (
  width: number = TERMINAL_WIDTH,
  height: number = TERMINAL_HEIGHT
): TerminalBuffer => {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      char: ' ',
      color: COLORS.foreground,
      backgroundColor: COLORS.background,
    }))
  );
};

// Create an empty cell
export const createCell = (
  char: string = ' ',
  color: string = COLORS.foreground,
  backgroundColor: string = COLORS.background,
  bold: boolean = false,
  underline: boolean = false
): TerminalCell => ({
  char: char.charAt(0) || ' ',
  color,
  backgroundColor,
  bold,
  underline,
});

// Set a single cell in the buffer
export const setCell = (
  buffer: TerminalBuffer,
  x: number,
  y: number,
  cell: TerminalCell
): TerminalBuffer => {
  if (y >= 0 && y < buffer.length && x >= 0 && x < buffer[0].length) {
    const newBuffer = buffer.map((row, rowIndex) =>
      rowIndex === y
        ? row.map((c, colIndex) => (colIndex === x ? { ...cell } : c))
        : row
    );
    return newBuffer;
  }
  return buffer;
};

// Write text to buffer at position
export const writeText = (
  buffer: TerminalBuffer,
  text: string,
  startX: number,
  startY: number,
  color: string = COLORS.foreground,
  backgroundColor: string = COLORS.background,
  bold: boolean = false,
  underline: boolean = false
): TerminalBuffer => {
  let result = buffer;
  const chars = Array.from(text);
  
  chars.forEach((char, index) => {
    const x = startX + index;
    if (x >= 0 && x < buffer[0].length && startY >= 0 && startY < buffer.length) {
      result = setCell(result, x, startY, createCell(char, color, backgroundColor, bold, underline));
    }
  });
  
  return result;
};

// Draw a horizontal line
export const drawHorizontalLine = (
  buffer: TerminalBuffer,
  startX: number,
  y: number,
  length: number,
  char: string = BOX_CHARS.horizontal,
  color: string = COLORS.border
): TerminalBuffer => {
  let result = buffer;
  
  for (let i = 0; i < length; i++) {
    result = setCell(result, startX + i, y, createCell(char, color));
  }
  
  return result;
};

// Draw a vertical line
export const drawVerticalLine = (
  buffer: TerminalBuffer,
  x: number,
  startY: number,
  length: number,
  char: string = BOX_CHARS.vertical,
  color: string = COLORS.border
): TerminalBuffer => {
  let result = buffer;
  
  for (let i = 0; i < length; i++) {
    result = setCell(result, x, startY + i, createCell(char, color));
  }
  
  return result;
};

// Draw a box (border only)
export const drawBox = (
  buffer: TerminalBuffer,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string = COLORS.border
): TerminalBuffer => {
  let result = buffer;
  
  // Corners
  result = setCell(result, x, y, createCell(BOX_CHARS.topLeft, color));
  result = setCell(result, x + width - 1, y, createCell(BOX_CHARS.topRight, color));
  result = setCell(result, x, y + height - 1, createCell(BOX_CHARS.bottomLeft, color));
  result = setCell(result, x + width - 1, y + height - 1, createCell(BOX_CHARS.bottomRight, color));
  
  // Horizontal lines
  result = drawHorizontalLine(result, x + 1, y, width - 2, BOX_CHARS.horizontal, color);
  result = drawHorizontalLine(result, x + 1, y + height - 1, width - 2, BOX_CHARS.horizontal, color);
  
  // Vertical lines
  result = drawVerticalLine(result, x, y + 1, height - 2, BOX_CHARS.vertical, color);
  result = drawVerticalLine(result, x + width - 1, y + 1, height - 2, BOX_CHARS.vertical, color);
  
  return result;
};

// Fill a rectangular area
export const fillRect = (
  buffer: TerminalBuffer,
  x: number,
  y: number,
  width: number,
  height: number,
  char: string = ' ',
  color: string = COLORS.foreground,
  backgroundColor: string = COLORS.background
): TerminalBuffer => {
  let result = buffer;
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      result = setCell(result, x + col, y + row, createCell(char, color, backgroundColor));
    }
  }
  
  return result;
};

// Word wrap text to fit within a width
export const wordWrap = (text: string, maxWidth: number): string[] => {
  const lines: string[] = [];
  const paragraphs = text.split('\n');
  
  paragraphs.forEach(paragraph => {
    if (paragraph.length === 0) {
      lines.push('');
      return;
    }
    
    const words = paragraph.split(' ');
    let currentLine = '';
    
    words.forEach(word => {
      if (currentLine.length === 0) {
        currentLine = word;
      } else if (currentLine.length + 1 + word.length <= maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  });
  
  return lines;
};

// Write wrapped text to buffer
export const writeWrappedText = (
  buffer: TerminalBuffer,
  text: string,
  startX: number,
  startY: number,
  maxWidth: number,
  color: string = COLORS.foreground,
  backgroundColor: string = COLORS.background
): { buffer: TerminalBuffer; linesUsed: number } => {
  const lines = wordWrap(text, maxWidth);
  let result = buffer;
  
  lines.forEach((line, index) => {
    if (startY + index < buffer.length) {
      result = writeText(result, line, startX, startY + index, color, backgroundColor);
    }
  });
  
  return { buffer: result, linesUsed: lines.length };
};

// Center text within a width
export const centerText = (text: string, width: number): string => {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(padding) + text;
};

// Pad text to a specific width
export const padText = (text: string, width: number, align: 'left' | 'right' | 'center' = 'left'): string => {
  if (text.length >= width) return text.slice(0, width);
  
  const padding = width - text.length;
  
  switch (align) {
    case 'right':
      return ' '.repeat(padding) + text;
    case 'center':
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
    default:
      return text + ' '.repeat(padding);
  }
};

// Merge two buffers (overlay src onto dest)
export const mergeBuffers = (
  dest: TerminalBuffer,
  src: TerminalBuffer,
  offsetX: number = 0,
  offsetY: number = 0
): TerminalBuffer => {
  let result = dest;
  
  src.forEach((row, y) => {
    row.forEach((cell, x) => {
      const destX = x + offsetX;
      const destY = y + offsetY;
      if (destY >= 0 && destY < dest.length && destX >= 0 && destX < dest[0].length) {
        result = setCell(result, destX, destY, cell);
      }
    });
  });
  
  return result;
};
