export type Layout = {
    show_dividers: boolean;
    columns: {                      // list of columns, left to right
        size: number;               // size of the column, as a percentage of the total width
        content: string | string[]; // markdown content of the column
    }[];
}

export type Section = {
    content: string;
}
