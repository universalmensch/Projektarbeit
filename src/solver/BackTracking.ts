import type {Solver} from "../types/Solver.ts";
import {isValid, maxSteps} from "../components/Utils.ts";
import {type SolverEvent, SolverEventTypes} from "../types/SolverEvent.ts";

export class Backtracking implements Solver {
    public name = "Backtracking";

    solveSteps(board: number[][], steps = maxSteps): SolverEvent[] {
        const clone = board.map(r => [...r]);
        return this.solve(clone, steps);
    }

    solve(board: number[][], steps: number): SolverEvent[] {
        let result: SolverEvent[] = [];

        const empties: [number, number][] = this.getEmpties(board);
        const nextNumberValue = new Array(empties.length).fill(1);

        let index = 0;

        while (index >= 0 && index < empties.length) {
            const [row, column] = empties[index];
            let placed = false;

            for (let numberTry: number = nextNumberValue[index]; numberTry <= 9; numberTry++) {
                if (isValid(board, row, column, numberTry)) {

                    result.push({
                        type: SolverEventTypes.TRY,
                        row: row,
                        column: column,
                        value: numberTry
                    })

                    board[row][column] = numberTry;
                    nextNumberValue[index] = numberTry + 1;
                    placed = true;
                    steps -= 1;

                    if (steps <= 0) return result;

                    index++;
                    break;
                }
            }

            if (!placed) {
                if (board[row][column] !== 0) {
                    result.push({
                        type: SolverEventTypes.UNSET,
                        row: row,
                        column: column
                    })
                }

                nextNumberValue[index] = 1;
                board[row][column] = 0;
                steps += 1;

                index--;
            }
        }

        result.push({
            type: SolverEventTypes.DONE
        })

        return result;
    }

    findEmpty(board: number[][]) {
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                if (board[row][column] === 0) return [row, column];
            }
        }
        return null;
    }

    private getEmpties(board: number[][]) {
        let empties: [number, number][] = [];
        board.forEach((row, rowIndex) =>
            row.forEach((column, columnIndex) => {
                if (column === 0)
                    empties.push([rowIndex, columnIndex])
            }));
        return empties;
    }
}