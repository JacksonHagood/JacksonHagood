import { CellString, CellBuffer } from "../types/cells";
import * as CHAR from "../constants/characters";
import { string_to_cell_string, create_unary_cell_string } from "./cell_strings";
import { parse_markdown } from "./markdown";

/**
 * Draws the body of a page
 * 
 * │ Lorem ipsum dolor sit amet, consectetur adipiscing elit sed  │
 * │ eiusmod tempor incididunt ut labore et dolore magna aliqua.  │
 * │                                                              │
 * 
 * @param pages - The page to be drawn
 * @param width - The width of the page
 * @param height - The height of the page
 * @returns - Cell buffer containing the footer
 */
export const draw_body = (page: string, width: number, height: number): CellBuffer => {
  var cell_buffer: CellBuffer = [];

  var content = parse_markdown(page, width - 4);

  // draw lines until height is reached
  for (var index = 0; index < height; index++) {
    var cell_row: CellString = [];

    cell_row.push({ char: CHAR.L_V });
    cell_row.push({ char: CHAR.S });

    if (index < content.length) {
      // draw content if present
      cell_row.push(...content[index]);
    } else {
      // draw blank line if content is exceeded
      cell_row.push(...create_unary_cell_string(CHAR.S, width - 4));
    }

    cell_row.push({ char: CHAR.S });
    cell_row.push({ char: CHAR.L_V });

    cell_buffer.push(cell_row);
  }

  return cell_buffer;
}
