import type {SolverEvent} from "./SolverEvent.ts";

export interface Solver {
    name: string;

    solveSteps(board: number[][], steps?: number): SolverEvent[];
}