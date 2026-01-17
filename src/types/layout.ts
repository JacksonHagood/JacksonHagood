export type Layout = {
    columns: {          // list of columns, left to right
        size: number,   // size of the column, as a percentage of the total width
        content: string // markdown content of the column
    }[]
}
