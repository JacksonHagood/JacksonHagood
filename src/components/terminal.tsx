import React, { useState, useEffect }  from "react";

import { Cell, CellString, CellBuffer } from "../types/cells";
import { Layout } from "../types/layout";
import { CellSpan } from "./cell_span"

import { draw_header } from "../processing/header";
import { draw_footer } from "../processing/footer";
import { draw_body } from "../processing/body";

// navigation callback
const set_page_callback = (pages: string[], set_page_index: Function, tag: string, event: any) => {
  set_page_index(pages.indexOf(tag));
}

/**
 * Terminal react component
 * 
 * @param props - Props of component, containing the terminal dimensions
 * @returns 
 */
export const Terminal = (props: {
  width: number,
  height: number,
  pages: string[],
  page_layouts: Layout[],
}) => {
  const [page_index, set_page_index] = useState<number>(0);

  const [cell_buffer, set_cell_buffer] = useState<CellBuffer>(create_cell_buffer(
    props.width,
    props.height,
    props.pages,
    0,
    set_page_callback.bind(null, props.pages, set_page_index),
    props.page_layouts[0]
  ));

  // TODO: optimize to only redraw portions when needed
  useEffect(() => {
    set_cell_buffer(create_cell_buffer(
      props.width,
      props.height,
      props.pages,
      page_index,
      set_page_callback.bind(null, props.pages, set_page_index),
      props.page_layouts[page_index]
    ));
  }, [page_index]);

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

/**
 * Creates complete cell buffer for terminal
 * 
 * @param width - The width of the page
 * @param height - The height of the page
 * @param pages - The page options
 * @param active_index - The index of the active page
 * @param set_page_callback - Callback to change the active page
 * @param page - The layout of t he current page
 * @returns - Cell buffer containing the header, body, and footer
 */
export const create_cell_buffer = (
  width: number,
  height: number,
  pages: string[],
  active_index: number,
  set_page_callback: Function,
  page: Layout
): CellBuffer => {
  var cell_buffer: CellBuffer = []

  cell_buffer.push(...draw_header(pages, active_index, set_page_callback, width));
  cell_buffer.push(...draw_body(page, width, height - 4));
  cell_buffer.push(...draw_footer("jagmachat@gmail.com", "HH:MM:SS", width));

  return cell_buffer;
}
