import {sudokus} from "./Puzzle.ts";
import type {NumericSudoku} from "../types/Sudoku.ts";

let newSudokus: NumericSudoku[] = [];

export function addSudoku(sudoku: NumericSudoku) {
    newSudokus.push(sudoku)
}

export function getRandomSudoku() {
    const allSudokus = [...sudokus, ...newSudokus]
    const index = Math.floor(Math.random() * (allSudokus.length));
    return allSudokus[index];
}

export function getSudokus() {
    return [...sudokus, ...newSudokus]
}