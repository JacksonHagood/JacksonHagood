import React from "react";
import ReactDOM from "react-dom/client";

import "./style/global.scss"
import { Terminal } from "./components/terminal"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
<React.StrictMode>
  <div className="Body">
    <Terminal width = {128} height = {32}/>
  </div>
</React.StrictMode>
);
