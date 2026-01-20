import React, { useState, useEffect, JSX, useCallback }  from "react";

import { Cell, CellString, CellBuffer } from "../../types/cells";
import { Layout } from "../../types/layout";
import { CellSpan } from "../cell_span/cell_span";

import "./terminal.scss";
import { draw_header } from "../../text_processing/header";
import { draw_footer } from "../../text_processing/footer";
import { draw_body } from "../../text_processing/body";

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

const set_section_callback = (set_section_index: Function, tag: string, event: any) => {
  set_section_index(Number(tag));
}

/**
 * Gets formatted time
 * 
 * @param time - Current time
  const node_ref = useRef(null);
 * @returns - String containing time as HH:MM:SS
 */
const get_time = (time: Date): string => {
  return `${time.getHours().toString().padStart(2, '0')}`
    + `:${time.getMinutes().toString().padStart(2, '0')}`
    + `:${time.getSeconds().toString().padStart(2, '0')}`;
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
  // TODO: optimize use effects

  const [page_index, set_page_index] = useState<number>(0); // index of current page
  const [section_index, set_section_index] = useState<number>(0); // index of current section (if page has sections)
  const [start_row, set_start_row] = useState<number>(0); // index of first row in page to show

  const [header, set_header] = useState<CellBuffer>(draw_header(
    props.pages,
    0,
    set_page_callback.bind(null, props.pages, set_page_index),
    props.width
  )); // header buffer

  const [body, set_body] = useState<CellBuffer>(draw_body(
    props.page_layouts[0],
    section_index,
    set_section_callback.bind(null, set_section_index),
    props.width,
    props.height - 6
  )); // body buffer

  const [footer, set_footer] = useState<CellBuffer>(draw_footer(
    props.email,
    get_time(new Date()),
    props.width
  )); // footer buffer

  // listener for arrow keys
  const handle_key_down = useCallback((event: any) => {
    if (event.key === "ArrowUp") {
      set_start_row(start_row === 0 ? 0 : start_row - 1);
    } else if (event.key === "ArrowDown") {
      set_start_row(start_row >= body.length - props.height - 7 ? start_row : start_row + 1);
    }
  }, [start_row, body, props.height]);

  // listener for scrolling
  const handle_scroll = useCallback((event: any) => {
    if (event.deltaY < 0) {
      set_start_row(start_row === 0 ? 0 : start_row - 1);
    } else if (event.deltaY > 0) {
      set_start_row(start_row >= body.length - props.height - 7 ? start_row : start_row + 1);
    }
  }, [start_row, body, props.height]);

  // add listeners for arrow keys and scrolling
  useEffect(() => {
    document.addEventListener("keydown", handle_key_down);
    document.addEventListener("wheel", handle_scroll);

    return () => {
      document.removeEventListener("keydown", handle_key_down);
      document.removeEventListener("wheel", handle_scroll);
    }
  }, [handle_key_down, handle_scroll]);

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
      0,
      set_section_callback.bind(null, set_section_index),
      props.width,
      props.height - 6
    ));

    set_start_row(0);
    set_section_index(0);
  }, [page_index, props.width, props.height, props.pages, props.page_layouts]);

  // body update on section change
  useEffect(() => {
    set_body(draw_body(
      props.page_layouts[page_index],
      section_index,
      set_section_callback.bind(null, set_section_index),
      props.width,
      props.height - 6
    ));
  }, [section_index, page_index, props.width, props.height, props.page_layouts])

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
      {body.slice(start_row, start_row + props.height - 6).map((cell_row: CellString) => (
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
