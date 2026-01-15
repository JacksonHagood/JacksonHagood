// cell is a single character in the terminal
export type Cell = {
  char: string;
  background_color?: string;
  color?: string;
}

// cell string is an array of cells
export type CellString = Cell[]

// cell buffer is a 2d matrix of cells
export type CellBuffer = Cell[][]
