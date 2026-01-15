import React from "react";

import { Cell } from "../../types/cells"

export const CellSpan = (props: {cell: Cell}) => {
  return (
    <span
      style = {{
        ...(props.cell.background_color && {"backgroundColor": props.cell.background_color}),
        ...(props.cell.color && {"backgroundColor": props.cell.color}),
      }}
      onClick = {props.cell.action ? props.cell.action.bind(null, props.cell.tag) : undefined}
      className = {props.cell.action ? "Clickable" : undefined}
    >
      {props.cell.char}
    </span>
  );
}