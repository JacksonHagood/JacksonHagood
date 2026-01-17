import { CellString, CellBuffer } from "../types/cells";
import * as CHAR from "../constants/characters";
import { string_to_cell_string, create_unary_cell_string } from "./cell_strings";

/**
 * Draws a footer with a provided width
 * 
 * ├─────────────────────────────────┬─────────────────┬──────────┤
 * │                                 │ email@email.com │ HH:MM:SS │
 * └─────────────────────────────────┴─────────────────┴──────────┘
 * 
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the footer
 * @returns - Cell buffer containing the footer
 */
export const draw_footer = (
    email: string,
    time: string,
    width: number
): CellBuffer => {
  var cell_buffer: CellBuffer = [];

  cell_buffer.push(draw_footer_row_0(email, time, width));
  cell_buffer.push(draw_footer_row_1(email, time, width));
  cell_buffer.push(draw_footer_row_2(email, time, width));

  return cell_buffer;
}

/**
 * Draws the first line of the footer
 * 
 * ├─────────────────────────────────┬─────────────────┬──────────┤
 * 
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the footer
 * @returns - Cell string containing the first line of the footer
 */
const draw_footer_row_0 = (
  email: string,
  time: string,
  width: number
): CellString => {
  var cell_row: CellString = [];

  cell_row.push({ char: CHAR.X_R });

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H },
    calc_pad(email, time, width)
  ));
  
  cell_row.push({ char: CHAR.X_D });
  
  // email section
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H },
    email.length + 2
  ));

  cell_row.push({ char: CHAR.X_D });

  // time section
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H },
    time.length + 2
  ));

  cell_row.push({ char: CHAR.X_L });

  return cell_row;
}

/**
 * Draws the second line of the footer
 * 
 * │                                 │ email@email.com │ HH:MM:SS │
 * 
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the footer
 * @returns - Cell string containing the second line of the footer
 */
const draw_footer_row_1 = (
  email: string,
  time: string,
  width: number
): CellString => {
  var cell_row: CellString = [];

  cell_row.push({ char: CHAR.L_V });

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.S },
    calc_pad(email, time, width)
  ));
  
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
 * ─────────────────────────────────┴─────────────────┴──────────┘
 * 
 * @param email - The email address
 * @param time - The current time
 * @param width - The width of the footer
 * @returns - Cell string containing the third line of the footer
 */
const draw_footer_row_2 = (
  email: string,
  time: string,
  width: number
): CellString => {
  var cell_row: CellString = [];

  cell_row.push({ char: CHAR.C_DL });

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H },
    calc_pad(email, time, width)
  ));
  
  cell_row.push({ char: CHAR.X_U });
  
  // email section
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H },
    email.length + 2
  ));

  cell_row.push({ char: CHAR.X_U });

  // time section
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H },
    time.length + 2
  ));

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
  email: string,
  time: string,
  width: number
): number => {
  return width - (email.length + time.length + 8);
}
