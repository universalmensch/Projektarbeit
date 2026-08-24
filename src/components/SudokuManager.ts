import {sudokus} from "./Puzzle.ts";
import type {NumericSudoku} from "../types/Sudoku.ts";

let newSudokus: NumericSudoku[] = [];

export function addSudoku(name: string, newSudoku: number[]) {
    const cells: number[][] = [];

    for (let i = 0; i < 81; i += 9) {
        cells.push(newSudoku.slice(i, i + 9));
    }

    newSudokus.push({
        name, cells
    } as NumericSudoku)
}

export function getRandomSudoku() {
    const allSudokus = [...sudokus, ...newSudokus]
    const index = Math.floor(Math.random() * (allSudokus.length));
    return allSudokus[index];
}