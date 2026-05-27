import type {Solver} from "../types/Solver.ts";
import {isValid, maxSteps} from "../components/Utils.ts";
import {type SolverEvent, SolverEventTypes} from "../types/SolverEvent.ts";
import {eventBus} from "../components/EventBus.ts";

export class Backtracking implements Solver {
    public name = "Backtracking";

    solveSteps(board: number[][], steps = maxSteps): void {
        const clone = board.map(r => [...r]);
        this.solve(clone, steps);
    }

    solve(board: number[][], steps: number): void {
        const empties: [number, number][] = this.getEmpties(board);

        const nextNumberValue = new Array(empties.length).fill(1);

        let index = 0;

        while (index >= 0 && index < empties.length) {
            const [row, column] = empties[index];
            let placed = false;

            for (let numberTry: number = nextNumberValue[index]; numberTry <= 9; numberTry++) {
                if (isValid(board, row, column, numberTry)) {
                    board[row][column] = numberTry;

                   // emit?.({type: SolverEventTypes.SET, row, col: column, value: numberTry});
                    nextNumberValue[index] = numberTry + 1;
                    placed = true;
                    steps -= 1;
                    console.log(steps);
                    console.log(empties[index]);
                    console.log(numberTry);

                    const event: SolverEvent = {
                        type: SolverEventTypes.SET,
                        row: row,
                        column: column,
                        value: numberTry
                    }

                    eventBus.emit(event);

                    if (steps <= 0) return;

                    index++;
                    break;
                }
            }

            if (!placed) {
                nextNumberValue[index] = 1;
                if (board[row][column] !== 0) {
                   // emit?.({type: SolverEventTypes.UNSET, row, col: column, value: board[row][column]});
                }
                board[row][column] = 0;
                steps += 1;

                index--;
            }
        }

        if (index === empties.length) {
           // emit?.({type: SolverEventTypes.DONE});
        }

        console.log(board)

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

    findEmpty(board: number[][]) {
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                if (board[row][column] === 0) return [row, column];
            }
        }
        return null;
    }


}