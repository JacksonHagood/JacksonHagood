import { CellString, CellBuffer } from "../types/cells";
import { pad_row } from "./cell_strings";

/**
 * Parses a string in markdown to a 2D array of cells (a cell buffer)
 * 
 * @param markdown_content - The string of markdown content
 * @param width - The desired width of the cell buffer
 * @returns Cell buffer containing the parsed markdown
 */
export const parse_markdown = (markdown_content: string, width: number): CellBuffer => {
  var cell_buffer: CellBuffer = [];
  var cell_row: CellString = [];
  var current_word: CellString = [];

  for (const char of markdown_content) {
    // TODO: detect special lines, such as headings
    // TODO: detect links and images

    // start a new line when character detected
    if (char === "\n") {
      cell_row.push(...current_word)
      current_word = []

      cell_row = pad_row(cell_row, width);

      cell_buffer.push(cell_row);
      cell_row = [];
    } else {
      current_word.push({ char: char });
    
      // when current word will exceed width, start a new line
      if (cell_row.length + current_word.length >= width) {
        cell_row = pad_row(cell_row, width);
        
        cell_buffer.push(cell_row);
        cell_row = [];
      }
      
      // when current word ends, add it to current line
      if (char === " " && current_word.length > 1) {
        cell_row.push(...current_word)
        current_word = []
      }
    }
  }

  // add any remaining content
  if (cell_row.length !== 0) {
    if (current_word.length !== 0) {
      cell_row.push(...current_word)
    }
    cell_row = pad_row(cell_row, width);
    cell_buffer.push(cell_row);
  }

  return cell_buffer;
}
