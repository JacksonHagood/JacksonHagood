import { CellString, CellBuffer } from "../types/cells";
import { Layout } from "../types/layout";
import * as CHAR from "../constants/characters";
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
 * @param width - The width of the page
 * @param height - The height of the page
 * @returns - Cell buffer containing the footer
 */
export const draw_body = (page: Layout, width: number, height: number): CellBuffer => {
  var cell_buffer: CellBuffer = [];

  var column_buffers: CellBuffer[] = [];

  var column_width = 0;
  var total_width = 0;

  // parse each column's content
  for (var index = 0; index < page.columns.length; index++) {
    // account for last column, ensuring width is filled with integer rounding
    column_width = index === page.columns.length - 1
      ? width - total_width - (3 * page.columns.length + 1)
      : Math.floor((page.columns[index].size / 100) * (width - (3 * page.columns.length + 1)));

    column_buffers.push(parse_markdown(page.columns[index].content, column_width));

    total_width += column_width;
  }

  var row_index = 0;

  while (row_index < height) {
    var row_string: CellString = [];

    row_string.push({ char: CHAR.L_V });

    for (const column_buffer of column_buffers) {
      row_string.push({ char: CHAR.S });

      if (row_index < column_buffer.length) {
        // if column has remaining content, add it to the current row
        row_string.push(...column_buffer[row_index]);
      } else {
        // otherwise, pad row
        row_string.push(...create_unary_cell_string({ char: CHAR.S }, column_buffer[0].length));
      }
      
      row_string.push({ char: CHAR.S });
      row_string.push({ char: CHAR.L_V });
    }

    cell_buffer.push(row_string);
    row_index++;
  }

  return cell_buffer;
}
