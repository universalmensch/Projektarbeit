
export interface Solver {
    name: string;
    solve(board: number[][]): void;
    solveSteps(board: number[][], steps: number): void;
}