import type {Cell} from "./Cell.ts";

export type Sudoku = {
    cells: Cell[][];
};

export type NumericSudoku = {
    name: string;
    cells: number[][];
}