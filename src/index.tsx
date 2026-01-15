import React from "react";
import ReactDOM from "react-dom/client";

import "./style/global.scss"

import { Terminal } from "./components/terminal/terminal"
import { parse_markdown } from "./processing/markdown_parser"
import { Cell, CellBuffer } from "./types/cells"
import {content} from "./constants/content/about"

const ex = parse_markdown(content, 50);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <div>
      <header>
        {/* TODO */}
      </header>

      <main>
        {/* TODO */}
        <p>Hello World</p>
        <Terminal cell_buffer = {ex}/>
      </main>

      <footer>
        {/* TODO */}
      </footer>
    </div>
  </React.StrictMode>
);
