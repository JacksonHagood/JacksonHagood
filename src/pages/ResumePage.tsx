import { useState, useEffect, useCallback } from 'react';
import { TerminalBuffer } from '../types';
import { CONTENT_HEIGHT, TERMINAL_WIDTH, COLORS, BOX_CHARS } from '../constants';
import { createEmptyBuffer, writeText, drawBox, drawHorizontalLine } from '../utils/bufferUtils';
import { renderMarkdown } from '../utils/markdownRenderer';

// Resume content
const resumeContent = `# Resume

## Jackson Hagood
**Software Engineer**

jagmachat@gmail.com

---

## Experience

### Software Engineer
*Company Name* | 2022 - Present

- Developed and maintained full-stack web applications
- Collaborated with cross-functional teams to deliver high-quality software
- Implemented CI/CD pipelines and automated testing

### Junior Developer
*Previous Company* | 2020 - 2022

- Built responsive web interfaces using React and TypeScript
- Participated in code reviews and agile development processes
- Contributed to database design and API development

---

## Education

### Bachelor of Science in Computer Science
*University Name* | 2016 - 2020

- Relevant coursework: Data Structures, Algorithms, Software Engineering
- GPA: 3.8/4.0

---

## Technical Skills

| Category | Technologies |
|----------|-------------|
| Languages | TypeScript, JavaScript, Python, C++ |
| Frontend | React, Vue.js, HTML5, CSS3, SASS |
| Backend | Node.js, Express, Django, REST APIs |
| Databases | PostgreSQL, MongoDB, Redis |
| Tools | Git, Docker, AWS, Linux |

---

## Certifications

- AWS Certified Developer
- Professional Scrum Master I
`;

interface ResumePageResult {
  buffer: TerminalBuffer;
  totalHeight: number;
  downloadRegion: { x: number; y: number; width: number; height: number };
}

interface UseResumePageReturn {
  buffer: TerminalBuffer;
  scrollOffset: number;
  totalHeight: number;
  scrollUp: () => void;
  scrollDown: () => void;
  handleScroll: (delta: number) => void;
  handleClick: (x: number, y: number) => void;
  downloadRegion: { x: number; y: number; width: number; height: number };
}

export const useResumePage = (): UseResumePageReturn => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [pageData, setPageData] = useState<ResumePageResult>({
    buffer: createEmptyBuffer(TERMINAL_WIDTH, CONTENT_HEIGHT),
    totalHeight: 0,
    downloadRegion: { x: 0, y: 0, width: 0, height: 0 },
  });

  useEffect(() => {
    // Render the markdown content with space at top for download button
    const contentStartY = 4;
    const availableHeight = CONTENT_HEIGHT - contentStartY;
    
    const result = renderMarkdown(resumeContent, TERMINAL_WIDTH, availableHeight, scrollOffset);
    
    // Create full buffer with download button
    let buffer = createEmptyBuffer(TERMINAL_WIDTH, CONTENT_HEIGHT);
    
    // Draw download button box
    const buttonText = ' [ DOWNLOAD PDF ] ';
    const buttonX = TERMINAL_WIDTH - buttonText.length - 4;
    const buttonY = 1;
    
    buffer = drawBox(buffer, buttonX - 1, buttonY - 1, buttonText.length + 2, 3, COLORS.accent);
    buffer = writeText(buffer, buttonText, buttonX, buttonY, COLORS.accent, COLORS.background, true);
    
    // Draw separator
    buffer = drawHorizontalLine(buffer, 0, contentStartY - 1, TERMINAL_WIDTH, BOX_CHARS.horizontal, COLORS.border);
    
    // Merge content into buffer
    result.buffer.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (y + contentStartY < CONTENT_HEIGHT) {
          buffer[y + contentStartY][x] = cell;
        }
      });
    });
    
    setPageData({
      buffer,
      totalHeight: result.totalHeight + contentStartY,
      downloadRegion: {
        x: buttonX - 1,
        y: buttonY - 1,
        width: buttonText.length + 2,
        height: 3,
      },
    });
  }, [scrollOffset]);

  const scrollUp = useCallback(() => {
    setScrollOffset(prev => Math.max(0, prev - 3));
  }, []);

  const scrollDown = useCallback(() => {
    setScrollOffset(prev => 
      Math.min(Math.max(0, pageData.totalHeight - CONTENT_HEIGHT), prev + 3)
    );
  }, [pageData.totalHeight]);

  const handleScroll = useCallback((delta: number) => {
    if (delta < 0) {
      scrollUp();
    } else {
      scrollDown();
    }
  }, [scrollUp, scrollDown]);

  const handleClick = useCallback((x: number, y: number) => {
    const { downloadRegion } = pageData;
    if (
      x >= downloadRegion.x &&
      x < downloadRegion.x + downloadRegion.width &&
      y >= downloadRegion.y &&
      y < downloadRegion.y + downloadRegion.height
    ) {
      // Trigger PDF download
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Jackson_Hagood_Resume.pdf';
      link.click();
    }
  }, [pageData]);

  return {
    buffer: pageData.buffer,
    scrollOffset,
    totalHeight: pageData.totalHeight,
    scrollUp,
    scrollDown,
    handleScroll,
    handleClick,
    downloadRegion: pageData.downloadRegion,
  };
};
