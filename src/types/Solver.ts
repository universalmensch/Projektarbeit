
export interface Solver {
    name: string;
    solveSteps(board: number[][], steps?: number): void;
}