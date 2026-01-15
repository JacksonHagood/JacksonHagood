import { CellString, CellBuffer } from "../types/cells";
import * as CHAR from "../constants/characters";

export const parse_markdown = (markdown_content: string, width: number): CellBuffer => {
  var cell_buffer: CellBuffer = [];
  var cell_row: CellString = [];
  var current_word: CellString = [];

  for (const char of markdown_content) {
    // start a new line when character detected
    if (char === "\n") {
      cell_row.push(...current_word)
      current_word = []

      while (cell_row.length < width) {
        console.log("a")
        cell_row.push(
          {
            char: CHAR.S
          }
        )
      }
      
      cell_buffer.push(cell_row);
      cell_row = [];
    } else {
      current_word.push(
        {
          char: char
        }
      );
    
      // when current word will exceed width, start a new line
      if (cell_row.length + current_word.length >= width) {
        while (cell_row.length < width) {
          console.log("a")
          cell_row.push(
            {
              char: " "
            }
          )
        }
        
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

  return cell_buffer;
}
