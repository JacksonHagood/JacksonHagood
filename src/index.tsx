import React from "react";
import ReactDOM from "react-dom/client";

import "./style/global.scss";
import { Terminal } from "./components/terminal/terminal";

import { layout as about_layout } from "./constants/layouts/about";
import { layout as resume_layout } from "./constants/layouts/resume";
import { layout as projects_layout } from "./constants/layouts/projects";
import { layout as links_layout } from "./constants/layouts/links";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <div className="Body">
      <Terminal
        width = {128}
        height = {32}
        pages = {["about", "resume", "projects", "links"]}
        page_layouts = {[about_layout, resume_layout, projects_layout, links_layout]}
        email = "jagmachat@gmail.com"
      />
    </div>
  </React.StrictMode>
);
