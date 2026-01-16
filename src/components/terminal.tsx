import React from "react";
import { useState } from 'react';

import { Cell, CellString } from "../types/cells";
import { Layout } from "../types/layout";
import { CellSpan } from "./terminal/cell_span"

import { draw_header } from "../processing/header";
import { draw_footer } from "../processing/footer";
import { draw_body } from "../processing/body";

import { layout as about_layout } from "../constants/content/about"
import { layout as resume_layout } from "../constants/content/resume"
import { layout as projects_layout } from "../constants/content/projects"

export const Terminal = (props: {width: number, height: number}) => {
  const [page, set_page] = useState<Layout>(about_layout);
  const [page_index, set_page_index] = useState<number>(0);

  const set_page_callback = (tag: string, event: any) => {
    switch (tag) {
      case "about":
        set_page(about_layout);
        set_page_index(0);
        break;
      case "resume":
        set_page(resume_layout);
        set_page_index(1);
        break;
      case "projects":
        set_page(projects_layout);
        set_page_index(2);
        break;
    }
  }

  var cell_buffer = []
  cell_buffer.push(...draw_header(["about", "resume", "projects"], page_index, set_page_callback, props.width));
  cell_buffer.push(...draw_body(page, props.width, props.height - 4));
  cell_buffer.push(...draw_footer("jagmachat@gmail.com", "HH:MM:SS", props.width));

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