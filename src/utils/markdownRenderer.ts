import { marked, Tokens } from 'marked';
import { TerminalBuffer } from '../types';
import { COLORS, BOX_CHARS } from '../constants';
import { 
  createEmptyBuffer, 
  writeText, 
  drawBox, 
  drawHorizontalLine,
  createCell,
  setCell,
  wordWrap 
} from './bufferUtils';

interface RenderState {
  buffer: TerminalBuffer;
  currentY: number;
  maxWidth: number;
  scrollOffset: number;
}

interface ClickableRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}

interface MarkdownRenderResult {
  buffer: TerminalBuffer;
  totalHeight: number;
  clickableRegions: ClickableRegion[];
}

// Strip HTML tags from text
const stripHtml = (text: string): string => {
  return text.replace(/<[^>]*>/g, '');
};

// Render an ASCII box around an image placeholder
const renderImageBox = (
  state: RenderState,
  alt: string,
  _src: string
): RenderState => {
  const boxWidth = Math.min(state.maxWidth - 4, 60);
  const boxHeight = 9;
  const startX = 2;
  
  let buffer = state.buffer;
  const y = state.currentY;
  
  // Ensure buffer is large enough
  while (buffer.length <= y + boxHeight + 2) {
    buffer = [...buffer, ...createEmptyBuffer(state.maxWidth, 1)];
  }
  
  // Draw the box border with bright accent color
  buffer = drawBox(buffer, startX, y, boxWidth, boxHeight, COLORS.accent);
  
  // Draw [IMAGE] label at top  
  const labelText = '[ IMAGE ]';
  const labelX = startX + Math.floor((boxWidth - labelText.length) / 2);
  buffer = writeText(buffer, labelText, labelX, y + 1, COLORS.accent);
  
  // Draw image icon in center
  const iconX = startX + Math.floor(boxWidth / 2) - 4;
  const iconY = y + 3;
  buffer = writeText(buffer, '┌──────┐', iconX, iconY, COLORS.foreground);
  buffer = writeText(buffer, '│ ▒▒▒▒ │', iconX, iconY + 1, COLORS.foreground);
  buffer = writeText(buffer, '│ ▒▒▒▒ │', iconX, iconY + 2, COLORS.foreground);
  buffer = writeText(buffer, '└──────┘', iconX, iconY + 3, COLORS.foreground);
  
  // Write alt text below icon
  const altText = alt || 'Image';
  const truncatedAlt = altText.length > boxWidth - 4 ? altText.slice(0, boxWidth - 7) + '...' : altText;
  const altX = startX + Math.floor((boxWidth - truncatedAlt.length) / 2);
  buffer = writeText(buffer, truncatedAlt, altX, y + boxHeight - 2, COLORS.accent, COLORS.background, true);
  
  return {
    ...state,
    buffer,
    currentY: y + boxHeight + 1,
  };
};

// Render a heading
const renderHeading = (
  state: RenderState,
  text: string,
  level: number
): RenderState => {
  let buffer = state.buffer;
  let y = state.currentY;
  
  // Ensure buffer is large enough
  while (buffer.length <= y + 2) {
    buffer = [...buffer, ...createEmptyBuffer(state.maxWidth, 1)];
  }
  
  const cleanText = stripHtml(text);
  const prefix = level === 1 ? '═══ ' : level === 2 ? '─── ' : '• ';
  const suffix = level === 1 ? ' ═══' : level === 2 ? ' ───' : '';
  const fullText = `${prefix}${cleanText}${suffix}`;
  
  const color = level === 1 ? COLORS.accent : level === 2 ? COLORS.foreground : COLORS.dim;
  const bold = level <= 2;
  
  // Add blank line before headings (except at top)
  if (y > 0) {
    y += 1;
  }
  
  buffer = writeText(buffer, fullText, 2, y, color, COLORS.background, bold);
  
  // Add underline for h1
  if (level === 1) {
    y += 1;
    while (buffer.length <= y) {
      buffer = [...buffer, ...createEmptyBuffer(state.maxWidth, 1)];
    }
    buffer = drawHorizontalLine(buffer, 2, y, Math.min(fullText.length, state.maxWidth - 4), BOX_CHARS.horizontal, COLORS.border);
  }
  
  return {
    ...state,
    buffer,
    currentY: y + 2,
  };
};

// Render a paragraph
const renderParagraph = (
  state: RenderState,
  text: string
): RenderState => {
  let buffer = state.buffer;
  let y = state.currentY;
  
  const cleanText = stripHtml(text);
  const lines = wordWrap(cleanText, state.maxWidth - 4);
  
  // Ensure buffer is large enough
  while (buffer.length <= y + lines.length + 1) {
    buffer = [...buffer, ...createEmptyBuffer(state.maxWidth, 1)];
  }
  
  lines.forEach((line, index) => {
    buffer = writeText(buffer, line, 2, y + index, COLORS.foreground);
  });
  
  return {
    ...state,
    buffer,
    currentY: y + lines.length + 1,
  };
};

// Render a list
const renderList = (
  state: RenderState,
  items: Tokens.ListItem[],
  ordered: boolean
): RenderState => {
  let buffer = state.buffer;
  let y = state.currentY;
  
  items.forEach((item, index) => {
    const bullet = ordered ? `${index + 1}. ` : '• ';
    const text = stripHtml(item.text);
    const lines = wordWrap(text, state.maxWidth - 6 - bullet.length);
    
    // Ensure buffer is large enough
    while (buffer.length <= y + lines.length) {
      buffer = [...buffer, ...createEmptyBuffer(state.maxWidth, 1)];
    }
    
    lines.forEach((line, lineIndex) => {
      if (lineIndex === 0) {
        buffer = writeText(buffer, bullet, 4, y, COLORS.accent);
        buffer = writeText(buffer, line, 4 + bullet.length, y, COLORS.foreground);
      } else {
        buffer = writeText(buffer, line, 4 + bullet.length, y, COLORS.foreground);
      }
      y += 1;
    });
  });
  
  return {
    ...state,
    buffer,
    currentY: y + 1,
  };
};

// Render a code block
const renderCodeBlock = (
  state: RenderState,
  code: string,
  _language?: string
): RenderState => {
  let buffer = state.buffer;
  let y = state.currentY;
  
  const lines = code.split('\n');
  const boxWidth = Math.min(state.maxWidth - 4, 80);
  const boxHeight = lines.length + 2;
  
  // Ensure buffer is large enough
  while (buffer.length <= y + boxHeight + 2) {
    buffer = [...buffer, ...createEmptyBuffer(state.maxWidth, 1)];
  }
  
  // Draw code box
  buffer = drawBox(buffer, 2, y, boxWidth, boxHeight, COLORS.dim);
  
  // Write code lines
  lines.forEach((line, index) => {
    const truncatedLine = line.length > boxWidth - 4 ? line.slice(0, boxWidth - 7) + '...' : line;
    buffer = writeText(buffer, truncatedLine, 4, y + 1 + index, COLORS.warning);
  });
  
  return {
    ...state,
    buffer,
    currentY: y + boxHeight + 1,
  };
};

// Render a horizontal rule
const renderHorizontalRule = (state: RenderState): RenderState => {
  let buffer = state.buffer;
  let y = state.currentY;
  
  // Ensure buffer is large enough
  while (buffer.length <= y + 2) {
    buffer = [...buffer, ...createEmptyBuffer(state.maxWidth, 1)];
  }
  
  y += 1;
  buffer = drawHorizontalLine(buffer, 2, y, state.maxWidth - 4, BOX_CHARS.horizontal, COLORS.border);
  
  return {
    ...state,
    buffer,
    currentY: y + 2,
  };
};

// Render a blockquote
const renderBlockquote = (
  state: RenderState,
  text: string
): RenderState => {
  let buffer = state.buffer;
  let y = state.currentY;
  
  const cleanText = stripHtml(text);
  const lines = wordWrap(cleanText, state.maxWidth - 8);
  
  // Ensure buffer is large enough
  while (buffer.length <= y + lines.length + 1) {
    buffer = [...buffer, ...createEmptyBuffer(state.maxWidth, 1)];
  }
  
  lines.forEach((line, index) => {
    buffer = setCell(buffer, 2, y + index, createCell('│', COLORS.accent));
    buffer = writeText(buffer, line, 4, y + index, COLORS.dim);
  });
  
  return {
    ...state,
    buffer,
    currentY: y + lines.length + 1,
  };
};

// Render a table
const renderTable = (
  state: RenderState,
  header: Tokens.TableCell[],
  rows: Tokens.TableCell[][]
): RenderState => {
  let buffer = state.buffer;
  let y = state.currentY;
  
  // Calculate column widths
  const colCount = header.length;
  const colWidth = Math.floor((state.maxWidth - 4 - (colCount + 1)) / colCount);
  
  // Ensure buffer is large enough
  const tableHeight = rows.length + 3;
  while (buffer.length <= y + tableHeight + 2) {
    buffer = [...buffer, ...createEmptyBuffer(state.maxWidth, 1)];
  }
  
  // Draw top border
  let topBorder = BOX_CHARS.topLeft;
  for (let i = 0; i < colCount; i++) {
    topBorder += BOX_CHARS.horizontal.repeat(colWidth);
    topBorder += i < colCount - 1 ? BOX_CHARS.teeDown : BOX_CHARS.topRight;
  }
  buffer = writeText(buffer, topBorder, 2, y, COLORS.border);
  y += 1;
  
  // Draw header
  let headerRow = BOX_CHARS.vertical;
  header.forEach((cell, i) => {
    const text = stripHtml(cell.text);
    const paddedText = text.length > colWidth - 2 
      ? text.slice(0, colWidth - 2) 
      : text + ' '.repeat(colWidth - text.length);
    headerRow += paddedText + BOX_CHARS.vertical;
  });
  buffer = writeText(buffer, headerRow, 2, y, COLORS.accent, COLORS.background, true);
  y += 1;
  
  // Draw header separator
  let sepBorder = BOX_CHARS.teeRight;
  for (let i = 0; i < colCount; i++) {
    sepBorder += BOX_CHARS.horizontal.repeat(colWidth);
    sepBorder += i < colCount - 1 ? BOX_CHARS.cross : BOX_CHARS.teeLeft;
  }
  buffer = writeText(buffer, sepBorder, 2, y, COLORS.border);
  y += 1;
  
  // Draw rows
  rows.forEach((row) => {
    let dataRow = BOX_CHARS.vertical;
    row.forEach((cell) => {
      const text = stripHtml(cell.text);
      const paddedText = text.length > colWidth - 2 
        ? text.slice(0, colWidth - 2) 
        : text + ' '.repeat(colWidth - text.length);
      dataRow += paddedText + BOX_CHARS.vertical;
    });
    buffer = writeText(buffer, dataRow, 2, y, COLORS.foreground);
    y += 1;
  });
  
  // Draw bottom border
  let bottomBorder = BOX_CHARS.bottomLeft;
  for (let i = 0; i < colCount; i++) {
    bottomBorder += BOX_CHARS.horizontal.repeat(colWidth);
    bottomBorder += i < colCount - 1 ? BOX_CHARS.teeUp : BOX_CHARS.bottomRight;
  }
  buffer = writeText(buffer, bottomBorder, 2, y, COLORS.border);
  
  return {
    ...state,
    buffer,
    currentY: y + 2,
  };
};

// Main markdown renderer
export const renderMarkdown = (
  markdown: string,
  width: number,
  height: number,
  scrollOffset: number = 0
): MarkdownRenderResult => {
  const tokens = marked.lexer(markdown);
  const clickableRegions: ClickableRegion[] = [];
  
  let state: RenderState = {
    buffer: createEmptyBuffer(width, height * 2), // Extra space for scrolling
    currentY: 1,
    maxWidth: width,
    scrollOffset,
  };
  
  tokens.forEach((token) => {
    switch (token.type) {
      case 'heading':
        state = renderHeading(state, token.text, token.depth);
        break;
        
      case 'paragraph':
        // Check for images in paragraph
        if (token.tokens) {
          const imageToken = token.tokens.find(t => t.type === 'image') as Tokens.Image | undefined;
          if (imageToken) {
            state = renderImageBox(state, imageToken.text, imageToken.href);
          } else {
            state = renderParagraph(state, token.text);
          }
        } else {
          state = renderParagraph(state, token.text);
        }
        break;
        
      case 'list':
        state = renderList(state, token.items, token.ordered);
        break;
        
      case 'code':
        state = renderCodeBlock(state, token.text, token.lang);
        break;
        
      case 'hr':
        state = renderHorizontalRule(state);
        break;
        
      case 'blockquote':
        state = renderBlockquote(state, token.text);
        break;
        
      case 'table':
        state = renderTable(state, token.header, token.rows);
        break;
        
      case 'space':
        state = { ...state, currentY: state.currentY + 1 };
        break;
    }
  });
  
  // Trim buffer to actual content and apply scroll offset
  const totalHeight = state.currentY;
  const visibleBuffer = state.buffer
    .slice(scrollOffset, scrollOffset + height)
    .map(row => row.slice(0, width));
  
  // Pad if needed
  while (visibleBuffer.length < height) {
    visibleBuffer.push(createEmptyBuffer(width, 1)[0]);
  }
  
  return {
    buffer: visibleBuffer,
    totalHeight,
    clickableRegions,
  };
};

// Render markdown from a file path (async)
export const loadAndRenderMarkdown = async (
  contentPath: string,
  width: number,
  height: number,
  scrollOffset: number = 0
): Promise<MarkdownRenderResult> => {
  try {
    const response = await fetch(contentPath);
    const markdown = await response.text();
    return renderMarkdown(markdown, width, height, scrollOffset);
  } catch (error) {
    const errorMessage = `Error loading content: ${contentPath}`;
    return renderMarkdown(`# Error\n\n${errorMessage}`, width, height, scrollOffset);
  }
};
