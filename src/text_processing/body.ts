import { CellString, CellBuffer } from "../types/cells";
import { Layout } from "../types/layout";
import * as CHAR from "../constants/characters";
import * as TAG from "../constants/tags";
import { create_unary_cell_string } from "./cell_strings";
import { parse_markdown } from "./markdown";

/**
 * Draws the body of a page
 * 
 * │ Lorem ipsum dolor sit amet, consectetur adipiscing   │ Lorem │
 * │ elit, sed do eiusmod tempor incididunt ut labore     │       │
 * │                                                      │       │
 * 
 * @param pages - The page to be drawn
 * @param section_index - The section of content to render, if page has sections
 * @param set_section_callback - Callback for updating current section
 * @param width - The width of the page
 * @param min_height - The minimum height of the page
 * @returns - Cell buffer containing the footer
 */
export const draw_body = (
  page: Layout,
  section_index: number,
  set_section_callback: Function,
  width: number,
  min_height: number
): CellBuffer => {
  var cell_buffer: CellBuffer = [];

  var column_buffers: CellBuffer[] = [];

  var column_width = 0;
  var total_width = 0;

  // parse each column's content
  for (let index = 0; index < page.columns.length; index++) {
    // account for last column, ensuring width is filled with integer rounding
    column_width = index === page.columns.length - 1
      ? width - total_width - (3 * page.columns.length + 1)
      : Math.floor((page.columns[index].size / 100) * (width - (3 * page.columns.length + 1)));

    if (Array.isArray(page.columns[index].content)) {
      // handle content with sections
      column_buffers.push(parse_markdown(
        page.columns[index].content[section_index],
        set_section_callback,
        column_width
      ));
    } else {
      column_buffers.push(parse_markdown(
        page.columns[index].content,
        set_section_callback,
        column_width
      ));
    }

    total_width += column_width;
  }

  var remaining_buffer = true;
  var row_index = 0;

  // iterate while there is remaining column buffers
  while (remaining_buffer) {
    remaining_buffer = false;
    let row_string: CellString = [];

    row_string.push({ char: CHAR.L_V, tag: TAG.FRAME });

    for (let index = 0; index < column_buffers.length; index++) {
      row_string.push({ char: CHAR.S });

      if (row_index < column_buffers[index].length) {
        // if column has remaining content, add it to the current row
        row_string.push(...column_buffers[index][row_index]);

        remaining_buffer = true;
      } else {
        // otherwise, pad row
        row_string.push(...create_unary_cell_string({ char: CHAR.S }, column_buffers[index][0].length));
      }
      
      row_string.push({ char: CHAR.S });
      row_string.push(index === column_buffers.length - 1
        ? { char: CHAR.L_V, tag: TAG.FRAME }
        : { char: CHAR.S }
      );
    }

    cell_buffer.push(row_string);
    row_index++;
  }

  // ensure minimum height is reached
  while (cell_buffer.length < min_height) {
    let row_string: CellString = [];

    row_string.push({ char: CHAR.L_V, tag: TAG.FRAME });
    row_string.push(...create_unary_cell_string({ char: CHAR.S }, width - 2));
    row_string.push({ char: CHAR.L_V, tag: TAG.FRAME });

    cell_buffer.push(row_string);
  }

  return cell_buffer;
}
