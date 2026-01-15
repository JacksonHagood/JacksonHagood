import { CellString, CellBuffer } from "../types/cells";
import * as CHAR from "../constants/characters";
import { create_unary_cell_string } from "./cell_strings";

/**
 * Draws a simple header with a provided width
 * 
 * ┌──────────────────────────────────────────────────────────────┐
 * 
 * @param width - The width of the header
 * @returns   Cell buffer containing the header
 */
export const draw_header = (
    width: number
): CellBuffer => {
  var cell_row: CellString = [];

  cell_row.push({ char: CHAR.C_UL });
  cell_row.push(...create_unary_cell_string(CHAR.L_H, width - 2))
  cell_row.push({ char: CHAR.C_UR });

  return [cell_row];
}
