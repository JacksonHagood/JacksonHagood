import { useState, useEffect } from 'react';
import { marked } from 'marked';

// configure marked for terminal-style output
marked.setOptions({
  gfm: true,
  breaks: true,
});

interface UseMarkdownContentResult {
  content: string;
  loading: boolean;
  error: string | null;
}

// hook to fetch and parse markdown content
export const useMarkdownContent = (path: string): UseMarkdownContentResult => {
  const [content, set_content] = useState<string>('');
  const [loading, set_loading] = useState<boolean>(true);
  const [error, set_error] = useState<string | null>(null);

  useEffect(() => {
    const fetch_content = async (): Promise<void> => {
      try {
        set_loading(true);
        set_error(null);
        
        const response = await fetch(path);
        
        if (!response.ok) {
          throw new Error(`failed to load content: ${response.status}`);
        }
        
        const text = await response.text();
        const html = await marked.parse(text);
        
        set_content(html);
      } catch (err) {
        set_error(err instanceof Error ? err.message : 'unknown error');
      } finally {
        set_loading(false);
      }
    };

    fetch_content();
  }, [path]);

  return { content, loading, error };
};

interface UseTextContentResult {
  content: string;
  loading: boolean;
  error: string | null;
}

// hook to fetch plain text content (for ascii art)
export const useTextContent = (path: string): UseTextContentResult => {
  const [content, set_content] = useState<string>('');
  const [loading, set_loading] = useState<boolean>(true);
  const [error, set_error] = useState<string | null>(null);

  useEffect(() => {
    const fetch_content = async (): Promise<void> => {
      try {
        set_loading(true);
        set_error(null);
        
        const response = await fetch(path);
        
        if (!response.ok) {
          throw new Error(`failed to load content: ${response.status}`);
        }
        
        const text = await response.text();
        set_content(text);
      } catch (err) {
        set_error(err instanceof Error ? err.message : 'unknown error');
      } finally {
        set_loading(false);
      }
    };

    fetch_content();
  }, [path]);

  return { content, loading, error };
};

interface UseJsonContentResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// hook to fetch json content
export const useJsonContent = <T,>(path: string): UseJsonContentResult<T> => {
  const [data, set_data] = useState<T | null>(null);
  const [loading, set_loading] = useState<boolean>(true);
  const [error, set_error] = useState<string | null>(null);

  useEffect(() => {
    const fetch_content = async (): Promise<void> => {
      try {
        set_loading(true);
        set_error(null);
        
        const response = await fetch(path);
        
        if (!response.ok) {
          throw new Error(`failed to load content: ${response.status}`);
        }
        
        const json = await response.json();
        set_data(json);
      } catch (err) {
        set_error(err instanceof Error ? err.message : 'unknown error');
      } finally {
        set_loading(false);
      }
    };

    fetch_content();
  }, [path]);

  return { data, loading, error };
};
