import type {Solver} from "../types/Solver.ts";
import {type SolverEvent, SolverEventTypes} from "../types/SolverEvent.ts";
import {maxSteps} from "../components/Utils.ts";

export class ConstraintSolver implements Solver {
    public name = "Constraint Propagation";

    solveSteps(board: number[][], steps = maxSteps): SolverEvent[] {
        const clone = board.map(r => [...r]);
        return this.solve(clone, steps);
    }

    solve(board: number[][], steps: number): SolverEvent[] {
        const candidates = this.initCandidates(board);

        return this.propagate(board, steps, candidates);
    }

    initCandidates(board: number[][]): Set<number>[][] {
        const candidates: Set<number>[][] = [];
        for (let row = 0; row < 9; row++) {
            candidates[row] = [];
            for (let column = 0; column < 9; column++) {
                if (board[row][column] === 0) {
                    candidates[row][column] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                } else {
                    candidates[row][column] = new Set();
                }
            }
        }

        return candidates;
    }

    propagate(board: number[][], steps: number, candidates: Set<number>[][]): SolverEvent[] {
        let solverEvents: SolverEvent[] = [];

        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                if (board[row][column] !== 0) {
                    this.eliminate(row, column, board[row][column], candidates, board, solverEvents, steps)
                }
            }
        }

        solverEvents.push({
            type: SolverEventTypes.DONE
        })

        return solverEvents;
    }

    eliminate(
        row: number,
        column: number,
        value: number,
        candidates: Set<number>[][],
        board: number[][],
        solverEvents: SolverEvent[],
        steps: number
    ) {
        if (steps <= 0) return;

        solverEvents.push({
            type: SolverEventTypes.CHECK,
            row: row,
            column: column,
        })

        this.checkRows(candidates, row, board, value, solverEvents, steps);

        this.checkColumns(candidates, board, column, value, solverEvents, steps);

        this.checkBlock(row, column, candidates, board, value, solverEvents, steps);
    }

    deleteValue(candidates: Set<number>[][], board: number[][], row: number, column: number, value: number, solverEvents: SolverEvent[], steps: number) {
        const currentCandidates = candidates[row][column];
        if (currentCandidates.delete(value)) {
            if (currentCandidates.size === 1) {
                let lastNumber = [...currentCandidates][0];

                board[row][column] = lastNumber;
                candidates[row][column] = new Set();

                solverEvents.push({
                    type: SolverEventTypes.SET,
                    row: row,
                    column: column,
                    value: lastNumber,
                })

                steps -= 1;

                this.eliminate(row, column, lastNumber, candidates, board, solverEvents, steps);
            }
        }
    }

    checkOnlyPlaceForNumber(
        board: number[][],
        candidates: Set<number>[][],
        cells: [number, number][],
        solverEvents: SolverEvent[],
        steps: number
    ) {
        for (let value = 1; value <= 9; value++) {
            let possibleCells: [number, number][] = [];

            let isSet = false;

            for (const [row, column] of cells) {
                if (board[row][column] === value) {
                    isSet = true;
                    break;
                }

                const currentCandidates = candidates[row][column];
                if (board[row][column] === 0 && currentCandidates.has(value)) {
                    possibleCells.push([row, column]);
                }
            }

            if (isSet) {
                continue;
            }

            if (possibleCells.length === 1) {
                const [row, column] = possibleCells[0];

                board[row][column] = value;
                candidates[row][column] = new Set();

                solverEvents.push({
                    type: SolverEventTypes.SET,
                    row: row,
                    column: column,
                    value: value,
                })

                steps -= 1;

                this.eliminate(row, column, value, candidates, board, solverEvents, steps);
            }
        }
    }

    rowCells(row: number): [number, number][] {
        return Array.from({length: 9}, (_, column) => [row, column]);
    }

    columnCells(column: number): [number, number][] {
        return Array.from({length: 9}, (_, row) => [row, column]);
    }

    private checkBlock(row: number, column: number, candidates: Set<number>[][], board: number[][], value: number, solverEvents: SolverEvent[], steps: number) {
        const bottomRow = Math.floor(row / 3) * 3;
        const bottomColumn = Math.floor(column / 3) * 3;
        const cells: [number, number][] = [];

        for (let currentRow = bottomRow; currentRow < bottomRow + 3; currentRow++) {
            for (let currentColumn = bottomColumn; currentColumn < bottomColumn + 3; currentColumn++) {
                this.deleteValue(candidates, board, currentRow, currentColumn, value, solverEvents, steps);
                cells.push([currentRow, currentColumn]);
            }
        }

        this.checkOnlyPlaceForNumber(board, candidates, cells, solverEvents, steps);
    }

    private checkColumns(candidates: Set<number>[][], board: number[][], column: number, value: number, solverEvents: SolverEvent[], steps: number) {
        candidates.forEach((_row, index) => {
            this.deleteValue(candidates, board, index, column, value, solverEvents, steps);
        });

        this.checkOnlyPlaceForNumber(board, candidates, this.columnCells(column), solverEvents, steps);
    }

    private checkRows(candidates: Set<number>[][], row: number, board: number[][], value: number, solverEvents: SolverEvent[], steps: number) {
        candidates[row].forEach((_currentCandidates, index) => {
            this.deleteValue(candidates, board, row, index, value, solverEvents, steps);
        })

        this.checkOnlyPlaceForNumber(board, candidates, this.rowCells(row), solverEvents, steps);
    }
}