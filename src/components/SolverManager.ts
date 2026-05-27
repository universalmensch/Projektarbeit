import type {Solver} from "../types/Solver.ts";
import {DancingLinksSolver} from "../solver/DancingLinks.ts";
import {ConstraintSolver} from "../solver/ContrainPropagation.ts";
import {Backtracking} from "../solver/BackTracking.ts";
import type {Sudoku} from "../types/Sudoku.ts";

export const solvers: Solver[] = [
    new Backtracking(),
    ConstraintSolver,
    DancingLinksSolver
];

export class SolverManager {
    private solver: Solver | null = null;
    private board: number[][] | null = null;

    setSolver(solver: Solver) {
        this.solver = solver;
    }

    setBoard(sudoku: Sudoku) {
        this.board = this.sudokuToSolverBoard(sudoku);
    }

    solveSteps(steps?: number){
        if (this.solver === null)
            throw new Error("solver initialization is missing");

        if (this.board === null)
            throw new Error("board initialization is missing");

        return this.solver.solveSteps(this.board, steps)
    }

    sudokuToSolverBoard(sudoku: Sudoku): number[][] {
        return sudoku.cells.map(row =>
            row.map(cell => cell.value ?? 0)
        );
    }
}