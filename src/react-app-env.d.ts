/// <reference types="react-scripts" />

// Allow importing raw markdown files
declare module '*.md?raw' {
  const content: string;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}
