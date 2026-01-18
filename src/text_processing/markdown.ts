import { CellString, CellBuffer } from "../types/cells";
import * as CHAR from "../constants/characters";
import { FONT_RATIO } from "../constants/constants";
import { string_to_cell_string, pad_row } from "./cell_strings";

/**
 * Parses a string in markdown to a 2D array of cells (a cell buffer)
 * 
 * @param markdown_content - The string of markdown content
 * @param width - The desired width of the cell buffer
 * @returns Cell buffer containing the parsed markdown
 */
export const parse_markdown = (markdown_content: string, width: number): CellBuffer => {
  // cell management
  var cell_buffer: CellBuffer = [];
  var cell_row: CellString = [];
  var current_word: CellString = [];

  // image handling
  var is_image: boolean = false;
  var found_image: boolean = false;
  var image_aspect_ratio: string = "";
  var image_name: string = "";

  // link handling
  var is_link: boolean = false;
  var found_link: boolean = false;
  var link_name: string = "";
  var link_address: string = "";

  for (const char of markdown_content) {
    // TODO: detect special lines, such as headings
    // TODO: detect links and images

    // detect image
    if (cell_row.length === 0 && char === "!") {
      // add any remaining words
      if (current_word.length !== 0) {
        cell_row.push(...current_word);
        current_word = [];
        cell_buffer.push(cell_row);
      }
      
      is_image = true;
    }

    // see if image name has not been found yet
    else if (is_image && !found_image) {
      if (char === "(") {
        found_image = true;
      } else if (!["[", "]"].includes(char)) {
        // image name is used to store aspect ratio
        image_aspect_ratio += char;
      }
    }

    // add char to image name
    else if (is_image && found_image) {
      if (char !== ")") {
        image_name += char;
      } else {
        // entire image name has been found, parse image
        cell_buffer.push(...parse_image(image_name, +image_aspect_ratio, width));

        // reset image handling vars
        is_image = false;
        found_image = false;
        image_aspect_ratio = "";
        image_name = "";
      }
    }

    // detect link
    else if (char === "[") {
      // add any remaining words
      if (current_word.length !== 0) {
        cell_row.push(...current_word);
        current_word = [];
        cell_buffer.push(cell_row);
      }
      
      is_link = true;
    }

    else if (is_link && !found_link) {
      if (char === "(") {
        found_link = true;
      } else if (!["[", "]"].includes(char)) {
        link_name += char;
      }
    }

    else if (is_link && found_link) {
      if (char !== ")") {
        link_address += char;
      } else {
        // entire link address has been found, add link
        current_word = string_to_cell_string(link_name, open_link_callback, link_address);

        // reset link handling vars
        is_link = false;
        found_link = false;
        link_name = "";
        link_address = "";
      }
    }

    // start a new line when character detected
    else if (char === "\n") {
      cell_row.push(...current_word);
      current_word = [];

      cell_row = pad_row(cell_row, width);

      cell_buffer.push(cell_row);
      cell_row = [];
    }
    
    // add to current word otherwise
    else {
      current_word.push({ char: char });
    
      // when current word will exceed width, start a new line
      if (cell_row.length + current_word.length >= width) {
        cell_row = pad_row(cell_row, width);
        
        cell_buffer.push(cell_row);
        cell_row = [];
      }
      
      // when current word ends, add it to current line
      if (char === " " && current_word.length > 1) {
        cell_row.push(...current_word);
        current_word = [];
      }
    }
  }

  // add any remaining content
  if (cell_row.length !== 0) {
    if (current_word.length !== 0) {
      cell_row.push(...current_word);
    }
    cell_row = pad_row(cell_row, width);
    cell_buffer.push(cell_row);
  }

  return cell_buffer;
}

/**
 * Parses square image into buffer
 * 
 * @param image_name - Name of image
 * @param aspect_ratio - Aspect ratio of image
 * @param width - Desired width of image
 * @returns - Cell buffer containing image information with desired width
 */
export const parse_image = (image_name: string, aspect_ratio: number, width: number): CellBuffer => {
  // calculate aspect ratio of the image
  var cell_buffer: CellBuffer = [];

  // add square image to buffer
  for (var row = 0; row < Math.floor(width * FONT_RATIO * 1 / aspect_ratio); row++) {
    var cell_row: CellString = [];

    for (var col = 0; col < width; col++) {
      // add cell with image portion
      cell_row.push({
        char: CHAR.S,
        image: image_name,
        image_position: {
          x: col,
          y: row,
          width: width,
          height: width * FONT_RATIO
        }
      });
    }

    cell_buffer.push(cell_row);
  }

  return cell_buffer;
}

/**
 * Callback for opening email
 * 
 * @param tag - Tag of email
 * @param event - Event information (unused)
 */
const open_link_callback = (tag: string, event: any) => {
  window.open(tag, "_blank");
}
