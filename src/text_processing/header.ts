import { CellString, CellBuffer } from "../types/cells";
import * as CHAR from "../constants/characters";
import { string_to_cell_string, create_unary_cell_string } from "./cell_strings";

/**
 * Draws a header with a provided width
 * 
 * ┌───────┬────────┬──────────┬──────────────────────────────────┐
 * │ about │ resume │ projects │                                  │
 * ├───────┘        └──────────┴──────────────────────────────────┤
 * 
 * @param pages - The pages to be displayed as tabs
 * @param active_index - The index of the currently active page
 * @param page_callback - Callback used to change page
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the header
 * @returns - Cell buffer containing the header
 */
export const draw_header = (
    pages: string[],
    active_index: number,
    page_callback: Function,
    width: number
): CellBuffer => {
  var cell_buffer: CellBuffer = [];

  cell_buffer.push(draw_header_row_0(pages, width));
  cell_buffer.push(draw_header_row_1(pages, page_callback, width));
  cell_buffer.push(draw_header_row_2(pages, active_index, width));

  return cell_buffer;
}

/**
 * Draws the first line of the header
 * 
 * ┌───────┬────────┬──────────┬──────────────────────────────────┐
 * 
 * @param pages - The pages to be displayed as tabs
 * @param width - The width of the header
 * @returns - Cell string containing the first line of the header
 */
const draw_header_row_0 = (
  pages: string[],
  width: number
): CellString => {
  var cell_row: CellString = [];

  cell_row.push({ char: CHAR.C_UL });

  // pages section
  for (const page of pages) {
    cell_row.push(...create_unary_cell_string(
      { char: CHAR.L_H },
      page.length + 2
    ));

    cell_row.push({ char: CHAR.X_D });
  }

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H },
    calc_pad(pages, width)
  ));

  cell_row.push({ char: CHAR.C_UR });

  return cell_row;
}

/**
 * Draws the second line of the header
 * 
 * │ about │ resume │ projects │                                  │
 * 
 * @param pages - The pages to be displayed as tabs
 * @param page_callback - Callback used to change page
 * @param width - The width of the header
 * @returns - Cell string containing the second line of the header
 */
const draw_header_row_1 = (
  pages: string[],
  page_callback: Function,
  width: number
): CellString => {
  var cell_row: CellString = [];

  cell_row.push({ char: CHAR.L_V });

  // pages section
  for (const page of pages) {
    cell_row.push({ char: CHAR.S });
    cell_row.push(...string_to_cell_string(page, page_callback, page));
    cell_row.push({ char: CHAR.S });
    cell_row.push({ char: CHAR.L_V });
  }

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.S },
    calc_pad(pages, width)
  ));
  
  cell_row.push({ char: CHAR.L_V });

  return cell_row;
}

/**
 * Draws the third line of the header
 * 
 * ├───────┘        └──────────┴──────────────────────────────────┤
 * 
 * @param pages - The pages to be displayed as tabs
 * @param active_index - The index of the currently active page
 * @param width - The width of the header
 * @returns - Cell string containing the third line of the header
 */
const draw_header_row_2 = (
  pages: string[],
  active_index: number,
  width: number
): CellString => {
  var cell_row: CellString = [];
  
  cell_row.push({ char: active_index === 0 ? CHAR.L_V : CHAR.X_R });

  // pages section, accounting for selected page
  pages.forEach((page, index) => {
    cell_row.push(...create_unary_cell_string(
      {
        char: active_index === index
          ? CHAR.S
          : CHAR.L_H
      },
      page.length + 2
    ));

    cell_row.push({ char: active_index === index
      ? CHAR.C_DL
      : active_index === index + 1
        ? CHAR.C_DR
        : CHAR.X_U });
  });

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H },
    calc_pad(pages, width)
  ));

  cell_row.push({ char: CHAR.X_L });

  return cell_row;
}

/**
 * Calculates the number of characters needed to pad header to be provided width
 * 
 * @param pages - The pages to be displayed as tabs
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the header
 * @returns - The number of padding characters required to reach the width
 */
const calc_pad = (
  pages: string[],
  width: number
): number => {
  var pages_width = 0;

  for (const page of pages) {
    pages_width += page.length + 3;
  } 

  return width - (pages_width + 2);
}
