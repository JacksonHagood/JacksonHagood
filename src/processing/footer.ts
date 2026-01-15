import { CellString, CellBuffer } from "../types/cells";
import * as CHAR from "../constants/characters";
import { string_to_cell_string, create_unary_cell_string } from "./cell_strings";

/**
 * Draws a footer with a provided width
 * 
 * ├───────┐        ┌──────────┬─────┬─────────────────┬──────────┤
 * │ about │ resume │ projects │     │ email@email.com │ HH:MM:DD │
 * └───────┴────────┴──────────┴─────┴─────────────────┴──────────┘
 * 
 * @param pages - The pages to be displayed as tabs
 * @param active_index - The index of the currently active page
 * @param page_callback - Callback used to change page
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the footer
 * @returns - Cell buffer containing the footer
 */
export const draw_footer = (
    pages: string[],
    active_index: number,
    page_callback: Function,
    email: string,
    time: string,
    width: number
): CellBuffer => {
  var cell_buffer: CellBuffer = [];

  cell_buffer.push(draw_footer_row_0(pages, active_index, email, time, width));
  cell_buffer.push(draw_footer_row_1(pages, page_callback, email, time, width));
  cell_buffer.push(draw_footer_row_2(pages, email, time, width));

  return cell_buffer;
}

/**
 * Draws the first line of the footer
 * 
 * ├───────┐        ┌──────────┬─────┬─────────────────┬──────────┤
 * 
 * @param pages - The pages to be displayed as tabs
 * @param active_index - The index of the currently active page
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the footer
 * @returns - Cell string containing the first line of the footer
 */
const draw_footer_row_0 = (
  pages: string[],
  active_index: number,
  email: string,
  time: string,
  width: number
): CellString => {
  var cell_row: CellString = [];

  cell_row.push({ char: active_index === 0 ? CHAR.L_V : CHAR.X_R });

  // pages section, accounting for selected page
  pages.forEach((page, index) => {
    cell_row.push(...create_unary_cell_string(
      active_index === index
        ? CHAR.S
        : CHAR.L_H,
      page.length + 2
    ))

    cell_row.push({ char: active_index === index
      ? CHAR.C_UL
      : active_index === index + 1
        ? CHAR.C_UR
        : CHAR.X_D });
  });

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    CHAR.L_H,
    calc_pad(pages, email, time, width)
  ))
  
  cell_row.push({ char: CHAR.X_D });
  
  // email section
  cell_row.push(...create_unary_cell_string(
    CHAR.L_H,
    email.length + 2
  ))

  cell_row.push({ char: CHAR.X_D });

  // time section
  cell_row.push(...create_unary_cell_string(
    CHAR.L_H,
    time.length + 2
  ))

  cell_row.push({ char: CHAR.X_L });

  return cell_row;
}

/**
 * Draws the second line of the footer
 * 
 * │ about │ resume │ projects │     │ email@email.com │ HH:MM:DD │
 * 
 * @param pages - The pages to be displayed as tabs
 * @param page_callback - Callback used to change page
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the footer
 * @returns - Cell string containing the second line of the footer
 */
const draw_footer_row_1 = (
  pages: string[],
  page_callback: Function,
  email: string,
  time: string,
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
    CHAR.S,
    calc_pad(pages, email, time, width)
  ))
  
  cell_row.push({ char: CHAR.L_V });
  
  // email section
  cell_row.push({ char: CHAR.S });
  cell_row.push(...string_to_cell_string(email));
  cell_row.push({ char: CHAR.S });

  cell_row.push({ char: CHAR.L_V });

  // time section
  cell_row.push({ char: CHAR.S });
  cell_row.push(...string_to_cell_string(time));
  cell_row.push({ char: CHAR.S });

  cell_row.push({ char: CHAR.L_V });

  return cell_row;
}

/**
 * Draws the third line of the footer
 * 
 * └───────┴────────┴──────────┴─────┴─────────────────┴──────────┘
 * 
 * @param pages - The pages to be displayed as tabs
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the footer
 * @returns - Cell string containing the third line of the footer
 */
const draw_footer_row_2 = (
  pages: string[],
  email: string,
  time: string,
  width: number
): CellString => {
  var cell_row: CellString = [];

  cell_row.push({ char: CHAR.C_DL });

  // pages section
  for (const page of pages) {
    cell_row.push(...create_unary_cell_string(
      CHAR.L_H,
      page.length + 2
    ))

    cell_row.push({ char: CHAR.X_U });
  }

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    CHAR.L_H,
    calc_pad(pages, email, time, width)
  ))
  
  cell_row.push({ char: CHAR.X_U });
  
  // email section
  cell_row.push(...create_unary_cell_string(
    CHAR.L_H,
    email.length + 2
  ))

  cell_row.push({ char: CHAR.X_U });

  // time section
  cell_row.push(...create_unary_cell_string(
    CHAR.L_H,
    time.length + 2
  ))

  cell_row.push({ char: CHAR.C_DR });

  return cell_row;
}

/**
 * Calculates the number of characters needed to pad footer to be provided width
 * 
 * @param pages - The pages to be displayed as tabs
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the footer
 * @returns - The number of padding characters required to reach the width
 */
const calc_pad = (
  pages: string[],
  email: string,
  time: string,
  width: number
): number => {
  var pages_width = 0;

  for (const page of pages) {
    pages_width += page.length + 3;
  } 

  return width - (pages_width + email.length + time.length + 8);
}
