import React, { JSX } from "react";

import { Cell } from "../types/cells";

/**
 * Cell span react component
 * 
 * @param props - Props of component, containing the cell information
 * @returns - JSX for the component
 */
export const CellSpan = (props: {cell: Cell}): JSX.Element => {
  return (
    <span
      style = {{
        ...(props.cell.background_color && {"backgroundColor": props.cell.background_color}),
        ...(props.cell.color && {"backgroundColor": props.cell.color}),
        ...(props.cell.image && {
          "backgroundImage": `url("images/${props.cell.image}")`,
          "backgroundSize": props.cell.image_position 
            ? `${props.cell.image_position.width * 100}% ${props.cell.image_position.height * 100}%`
            : "cover",
          "backgroundRepeat": "no-repeat",
          "backgroundPosition": props.cell.image_position
            ? `${props.cell.image_position.width > 1 ? (props.cell.image_position.x / (props.cell.image_position.width - 1)) * 100 : 0}% ${props.cell.image_position.height > 1 ? (props.cell.image_position.y / (props.cell.image_position.height - 1)) * 100 : 0}%`
            : "center"
        })
      }}
      onClick = {props.cell.action ? props.cell.action.bind(null, props.cell.tag) : undefined}
      className = {props.cell.action ? "Clickable" : undefined}
    >
      {props.cell.char}
    </span>
  );
}
