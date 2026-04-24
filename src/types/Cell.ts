export type Cell = {
    row: number;
    col: number;
    value: number | null;
    given: boolean;
    ref: any | null;
};