import React from "react";

import { Cell } from "../../types/cells"

export const CellSpan = (props: {cell: Cell}) => {
  return (
    <span
      style = {{
        ...(props.cell.background_color && {"backgroundColor": props.cell.background_color}),
        ...(props.cell.color && {"backgroundColor": props.cell.color}),
      }}
    >
      {props.cell.char}
    </span>
  );
}