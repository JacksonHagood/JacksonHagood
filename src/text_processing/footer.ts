import { CellString, CellBuffer } from "../types/cells";
import * as CHAR from "../constants/characters";
import * as TAG from "../constants/tags";
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

  cell_row.push({ char: CHAR.X_R, tag: TAG.FRAME });

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H, tag: TAG.FRAME },
    calc_pad(email, time, width)
  ));
  
  cell_row.push({ char: CHAR.X_D, tag: TAG.FRAME });
  
  // email section
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H, tag: TAG.FRAME },
    email.length + 2
  ));

  cell_row.push({ char: CHAR.X_D, tag: TAG.FRAME });

  // time section
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H, tag: TAG.FRAME },
    time.length + 2
  ));

  cell_row.push({ char: CHAR.X_L, tag: TAG.FRAME });

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

  cell_row.push({ char: CHAR.L_V, tag: TAG.FRAME });

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.S },
    calc_pad(email, time, width)
  ));
  
  cell_row.push({ char: CHAR.L_V, tag: TAG.FRAME });
  
  // email section
  cell_row.push({ char: CHAR.S });
  cell_row.push(...string_to_cell_string(email, open_email_callback, email));
  cell_row.push({ char: CHAR.S });

  cell_row.push({ char: CHAR.L_V, tag: TAG.FRAME });

  // time section
  cell_row.push({ char: CHAR.S });
  cell_row.push(...string_to_cell_string(time));
  cell_row.push({ char: CHAR.S });

  cell_row.push({ char: CHAR.L_V, tag: TAG.FRAME });

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

  cell_row.push({ char: CHAR.C_DL, tag: TAG.FRAME });

  // fill middle of row
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H, tag: TAG.FRAME },
    calc_pad(email, time, width)
  ));
  
  cell_row.push({ char: CHAR.X_U, tag: TAG.FRAME });
  
  // email section
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H, tag: TAG.FRAME },
    email.length + 2
  ));

  cell_row.push({ char: CHAR.X_U, tag: TAG.FRAME });

  // time section
  cell_row.push(...create_unary_cell_string(
    { char: CHAR.L_H, tag: TAG.FRAME },
    time.length + 2
  ));

  cell_row.push({ char: CHAR.C_DR, tag: TAG.FRAME });

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

/**
 * Callback for opening email
 * 
 * @param tag - Tag of email
 * @param event - Event information (unused)
 */
const open_email_callback = (tag: string, event: any) => {
  window.location.href = `mailto:${encodeURIComponent(tag)}}`
}

