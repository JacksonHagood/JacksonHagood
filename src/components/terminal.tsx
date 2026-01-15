import React from "react";
import { useState } from 'react';

import { Cell, CellString, CellBuffer } from "../types/cells"
import { CellSpan } from "./terminal/cell_span"

import { draw_header } from "../processing/header";
import { draw_footer } from "../processing/footer";
import { draw_body } from "../processing/body";

import { about_content } from "../constants/content/about"
import { resume_content } from "../constants/content/resume"
import { projects_content } from "../constants/content/projects"

export const Terminal = (props: {width: number, height: number}) => {
  const [page, set_page] = useState<string>(about_content);
  const [page_index, set_page_index] = useState<number>(0);

  const set_page_callback = (tag: string, event: any) => {
    switch (tag) {
      case "about":
        set_page(about_content);
        set_page_index(0);
        break;
      case "resume":
        set_page(resume_content);
        set_page_index(1);
        break;
      case "projects":
        set_page(projects_content);
        set_page_index(2);
        break;
    }
  }

  var cell_buffer = []
  cell_buffer.push(...draw_header(props.width));
  cell_buffer.push(...draw_body(page, props.width, props.height - 4));
  cell_buffer.push(...draw_footer(["about", "resume", "projects"], page_index, set_page_callback, "jagmachat@gmail.com", "HH:MM:SS", props.width));

  return (
    <div className = "Terminal">
      {cell_buffer.map((cell_row: CellString) => (
        <div>
          {cell_row.map((cell: Cell) => (
            <CellSpan cell = {cell}/>
          ))}
        </div>
      ))}
    </div>
  );
}