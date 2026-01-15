import React from "react";

import { Cell, CellString, CellBuffer } from "../../types/cells"
import { CellSpan } from "./cell_span"

export const Terminal = (props: {cell_buffer: CellBuffer}) => {
  return (
    <div>
      {props.cell_buffer.map((cell_row: CellString, index: number) => (
        <div>
          {cell_row.map((cell: Cell, index: number) => (
            <CellSpan cell = {cell}/>
          ))}
        </div>
      ))}
    </div>
  );
}