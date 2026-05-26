import type {NumericSudoku} from "../types/Sudoku.ts";
import {sudoku1} from "./Puzzle.ts";

export const sudokus: NumericSudoku[] =
   [ sudoku1 ]


export function getRandomSudoku() {
    const index = Math.floor(Math.random() * sudokus.length);
    return sudokus[index];
}