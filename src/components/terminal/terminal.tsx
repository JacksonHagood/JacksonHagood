import React, { useState, useEffect, JSX }  from "react";

import { Cell, CellString, CellBuffer } from "../../types/cells";
import { Layout } from "../../types/layout";
import { CellSpan } from "../cell_span/cell_span";

import "./terminal.scss";
import { draw_header } from "../../text_processing/header";
import { draw_footer } from "../../text_processing/footer";
import { draw_body } from "../../text_processing/body";

const build_page = (header: CellBuffer, body: CellBuffer, footer: CellBuffer): CellBuffer => {
  var cell_buffer: CellBuffer = [];

  cell_buffer.push(...header);
  cell_buffer.push(...body);
  cell_buffer.push(...footer);

  return cell_buffer;
}

/**
 * Callback for page navigation
 * 
 * @param pages - Array of page names
 * @param set_page_index - Callback for updating with the new index
 * @param tag - Tag of next page
 * @param event - Event information (unused)
 */
const set_page_callback = (pages: string[], set_page_index: Function, tag: string, event: any) => {
  set_page_index(pages.indexOf(tag));
}

/**
 * Gets formatted time
 * 
 * @param time - Current time
 * @returns - String containing time as HH:MM:SS
 */
const get_time = (time: Date): string => {
  return `${time.getHours().toString().padStart(2, '0')}`
    + `:${time.getMinutes().toString().padStart(2, '0')}`
    + `:${time.getSeconds() .toString().padStart(2, '0')}`;
}

/**
 * Terminal react component
 * 
 * @param props - Props of component, containing the dimensions, pages, and layouts
 * @returns - JSX for the component
 */
export const Terminal = (props: {
  width: number,
  height: number,
  pages: string[],
  page_layouts: Layout[],
  email: string
}): JSX.Element => {
  const [page_index, set_page_index] = useState<number>(0);

  const [header, set_header] = useState<CellBuffer>(draw_header(props.pages, 0, set_page_callback.bind(null, props.pages, set_page_index), props.width));
  const [body, set_body] = useState<CellBuffer>(draw_body(props.page_layouts[0], props.width, props.height - 4));
  const [footer, set_footer] = useState<CellBuffer>(draw_footer(props.email, get_time(new Date()), props.width));

  // header and body update on page change
  useEffect(() => {
    set_header(draw_header(
      props.pages,
      page_index,
      set_page_callback.bind(null, props.pages, set_page_index),
      props.width
    ));

    set_body(draw_body(
      props.page_layouts[page_index],
      props.width,
      props.height - 4
    ));
  }, [page_index]);

  // footer updates each second for time
  setInterval(() => {
    set_footer(draw_footer(
      props.email,
      get_time(new Date()),
      props.width
    ));
  }, 1000);

  return (
    <div className = "Terminal">
      {header.map((cell_row: CellString) => (
        <div>
          {cell_row.map((cell: Cell) => (
            <CellSpan cell = {cell}/>
          ))}
        </div>
      ))}
      {body.map((cell_row: CellString) => (
        <div>
          {cell_row.map((cell: Cell) => (
            <CellSpan cell = {cell}/>
          ))}
        </div>
      ))}
      {footer.map((cell_row: CellString) => (
        <div>
          {cell_row.map((cell: Cell) => (
            <CellSpan cell = {cell}/>
          ))}
        </div>
      ))}
    </div>
  );
}
