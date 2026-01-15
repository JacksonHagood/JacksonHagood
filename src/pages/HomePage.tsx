import { useState, useEffect, useCallback } from 'react';
import { TerminalBuffer } from '../types';
import { CONTENT_HEIGHT, TERMINAL_WIDTH } from '../constants';
import { createEmptyBuffer } from '../utils/bufferUtils';
import { renderMarkdown } from '../utils/markdownRenderer';

// Home page content as a constant (synced with home.md)
const homeContent = `# About Me

![jacksonhagood](/public/profile.png)

Hello! I'm **Jackson Hagood**, a software engineer passionate about building elegant solutions to complex problems.

## Background

I specialize in full-stack development with a focus on creating efficient, scalable applications. My journey in software engineering has taken me through various technologies and domains, from web applications to systems programming.

## Skills

- **Languages**: TypeScript, JavaScript, Python, C++, Rust
- **Frontend**: React, Vue.js, HTML/CSS, SASS
- **Backend**: Node.js, Express, Django, PostgreSQL
- **Tools**: Git, Docker, Linux, AWS

## Interests

When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and continuously learning about software architecture and best practices.

---

*Feel free to explore my projects and reach out if you'd like to connect!*
`;

interface HomePageResult {
  buffer: TerminalBuffer;
  totalHeight: number;
}

interface UseHomePageReturn {
  buffer: TerminalBuffer;
  scrollOffset: number;
  totalHeight: number;
  scrollUp: () => void;
  scrollDown: () => void;
  handleScroll: (delta: number) => void;
}

export const useHomePage = (): UseHomePageReturn => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [pageData, setPageData] = useState<HomePageResult>({
    buffer: createEmptyBuffer(TERMINAL_WIDTH, CONTENT_HEIGHT),
    totalHeight: 0,
  });

  useEffect(() => {
    const result = renderMarkdown(homeContent, TERMINAL_WIDTH, CONTENT_HEIGHT, scrollOffset);
    setPageData({
      buffer: result.buffer,
      totalHeight: result.totalHeight,
    });
  }, [scrollOffset]);

  const scrollUp = useCallback(() => {
    setScrollOffset(prev => Math.max(0, prev - 3));
  }, []);

  const scrollDown = useCallback(() => {
    setScrollOffset(prev => {
      const maxScroll = Math.max(0, pageData.totalHeight - CONTENT_HEIGHT);
      return Math.min(maxScroll, prev + 3);
    });
  }, [pageData.totalHeight]);

  const handleScroll = useCallback((delta: number) => {
    if (delta < 0) {
      scrollUp();
    } else {
      scrollDown();
    }
  }, [scrollUp, scrollDown]);

  return {
    buffer: pageData.buffer,
    scrollOffset,
    totalHeight: pageData.totalHeight,
    scrollUp,
    scrollDown,
    handleScroll,
  };
};
