// cell is a single character in the terminal
export type Cell = {
  char: string;              // character in cell
  background_color?: string; // optional background of cell
  color?: string;            // optional font color of cell
  action?: any;              // optional action to execute on cell click
  tag?: string;              // optional tag, passed to action on cell click
  image?: string;            // optional image to render in cell
  image_position?: {         // optional information on how to render the cell image
    x: number;               // x position of cell in image region
    y: number;               // y position of cell in image region
    width: number;           // image region width, in cells
    height: number;          // image region height, in cells
  }
}

// cell string is an array of cells
export type CellString = Cell[];

// cell buffer is a 2d matrix of cells
export type CellBuffer = Cell[][];
