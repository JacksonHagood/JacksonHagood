import { CellString, Cell } from "../types/cells";
import * as CHAR from "../constants/characters";

/**
 * Converts a regular string to a cell string
 * 
 * @param string - The string to convert
 * @returns - Cell string of the string
 */
export const string_to_cell_string = (string: string, callback?: Function, tag?: string): CellString => {
  var cell_string: CellString = [];

  for (const char of string) {
    cell_string.push({
      char: char,
      ...(callback && {action: callback}),
      ...(tag && {tag: tag})
    });
  }

  return cell_string;
}

/**
 * 
 * Creates a cell string containing a single character repeated a number of times
 * 
 * @param char - The character to repeat
 * @param width - The number of types to repeat the character
 * @returns - Cell string containing the character repeated
 */
export const create_unary_cell_string = (cell: Cell, width: number): CellString => {
  var cell_string: CellString = []

  for (var i = 0; i < width; i++) {
    cell_string.push(cell);
  }

  return cell_string;
}

/**
 * Pads a cell string with spaces to reach a certain width
 * 
 * @param cell_string - The cell string to pad
 * @param width - The desired width of the cell string
 * @param cahr - The character to pad with (the space character by default)
 * @returns The cell string padded with spaces
 */
export const pad_row = (cell_string: CellString, width: number, cell: Cell = { char: CHAR.S }): CellString => {
  cell_string.push(...create_unary_cell_string(cell, width - cell_string.length));

  return cell_string;
}
