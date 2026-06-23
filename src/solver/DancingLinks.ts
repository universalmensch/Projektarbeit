import type {Solver} from "../types/Solver.ts";
import {type SolverEvent, SolverEventTypes} from "../types/SolverEvent.ts";
import {maxSteps} from "../components/Utils.ts";

class ValueNode {
    left: ValueNode = this;
    right: ValueNode = this;
    up: ValueNode = this;
    down: ValueNode = this;
    constraintColumn?: ConstraintColumn;

    row: number;
    column: number;
    value: number;

    constructor(constraintColumn?: ConstraintColumn, row = 0, column = 0, value = 0) {
        if (constraintColumn) this.constraintColumn = constraintColumn;

        this.row = row;
        this.column = column;
        this.value = value;
    }
}

class ConstraintColumn extends ValueNode {
    size = 0;
    index: number;

    constructor(index: number) {
        super();
        this.constraintColumn = this;
        this.index = index;
    }
}

type currentSteps = {
    value: number;
}

export class DancingLinksSolver implements Solver {
    public name = "Dancing Links";

    solveSteps(board: number[][], steps = maxSteps): SolverEvent[] {
        const clone = board.map(r => [...r]);
        return this.solve(clone, {value: steps} as currentSteps);
    }

    private solve(board: number[][], steps: currentSteps): SolverEvent[] {
        const header = this.buildConstraintStructure(board);

        let solverEvents: SolverEvent[] = [];
        this.search(header, solverEvents, board, steps);

        solverEvents.push({
            type: SolverEventTypes.DONE
        })

        return solverEvents;
    }

    private buildConstraintStructure(board: number[][]): ConstraintColumn {
        const root = new ConstraintColumn(-1);

        let last = root;
        const columns: ConstraintColumn[] = [];

        // 81 cell constraints, 81 row constraints, 81 column constrains, 81 block constraints -> 324 constraint columns
        for (let index = 0; index < 324; index++) {
            const column = new ConstraintColumn(index);

            last.right = column;
            column.left = last;

            last = column;
            columns.push(column);
        }

        last.right = root;
        root.left = last;


        columns.push(root);
        this.fillConstraintColumns(board, columns);

        return root;
    }

    private addValueDecision(allColumns: ConstraintColumn[], row: number, column: number, value: number) {
        const block = Math.floor(row / 3) * 3 + Math.floor(column / 3);

        const cellConstraint = row * 9 + column;
        const rowConstraint = 81 + row * 9 + (value - 1);
        const columnConstraint = 162 + column * 9 + (value - 1);
        const blockConstraint = 243 + block * 9 + (value - 1);

        const constraintIndices = [cellConstraint, rowConstraint, columnConstraint, blockConstraint];

        let firstValueNode: ValueNode | null = null;
        let previousNode: ValueNode | null = null;

        for (const index of constraintIndices) {
            const constraintColumn = allColumns[index];
            const valueNode = new ValueNode(constraintColumn, row, column, value);

            // add value nodes to constraint column
            valueNode.down = constraintColumn;
            valueNode.up = constraintColumn.up;
            constraintColumn.up.down = valueNode;
            constraintColumn.up = valueNode;
            constraintColumn.size++;

            // link value nodes
            if (!firstValueNode) {
                firstValueNode = valueNode;
            } else {
                valueNode.left = previousNode!;
                valueNode.right = firstValueNode;
                previousNode!.right = valueNode;
                firstValueNode.left = valueNode;
            }

            previousNode = valueNode;
        }
    }

    private fillConstraintColumns(board: number[][], columns: ConstraintColumn[]) {
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                const cellValue = board[row][column];

                for (let value = 1; value <= 9; value++) {

                    if (cellValue !== 0 && cellValue !== value) continue;

                    this.addValueDecision(columns, row, column, value);
                }
            }
        }
    }

    private search(header: ConstraintColumn, solverEvents: SolverEvent[], board: number[][], steps: currentSteps): boolean {
        if (header.right === header || steps.value <= 0) {
            return true;
        }

        let constraintColumn = this.findSmallestColumn(header);

        this.cover(constraintColumn);

        for (let valueNode = constraintColumn.down; valueNode !== constraintColumn; valueNode = valueNode.down) {
            if (board[valueNode.row][valueNode.column] === 0) {
                solverEvents.push({
                    type: SolverEventTypes.TRY,
                    row: valueNode.row,
                    column: valueNode.column,
                    value: valueNode.value,
                })
                steps.value -= 1;
            }

            for (let node = valueNode.right; node !== valueNode; node = node.right) {
                this.cover(node.constraintColumn!);
            }

            if (this.search(header, solverEvents, board, steps)) return true;

            // Backtracking if no solution was found
            if (board[valueNode.row][valueNode.column] === 0) {
                solverEvents.push({
                    type: SolverEventTypes.UNSET,
                    row: valueNode.row,
                    column: valueNode.column,
                })
                steps.value += 1;
            }

            for (let node = valueNode.left; node !== valueNode; node = node.left) {
                this.uncover(node.constraintColumn!);
            }
        }

        this.uncover(constraintColumn);
        return false;
    }

    private cover(constraintColumn: ConstraintColumn) {
        constraintColumn.right.left = constraintColumn.left;
        constraintColumn.left.right = constraintColumn.right;

        for (let valueNode = constraintColumn.down; valueNode !== constraintColumn; valueNode = valueNode.down) {
            for (let valueNodeNeighbour = valueNode.right; valueNodeNeighbour !== valueNode; valueNodeNeighbour = valueNodeNeighbour.right) {
                valueNodeNeighbour.down.up = valueNodeNeighbour.up;
                valueNodeNeighbour.up.down = valueNodeNeighbour.down;
                valueNodeNeighbour.constraintColumn!.size--;
            }
        }
    }

    private uncover(constraintColumn: ConstraintColumn) {
        for (let valueNode = constraintColumn.up; valueNode !== constraintColumn; valueNode = valueNode.up) {
            for (let valueNodeNeighbour = valueNode.left; valueNodeNeighbour !== valueNode; valueNodeNeighbour = valueNodeNeighbour.left) {
                valueNodeNeighbour.constraintColumn!.size++;
                valueNodeNeighbour.down.up = valueNodeNeighbour;
                valueNodeNeighbour.up.down = valueNodeNeighbour;
            }
        }

        constraintColumn.right.left = constraintColumn;
        constraintColumn.left.right = constraintColumn;
    }

    private findSmallestColumn(header: ConstraintColumn) {
        let constraintColumn = header.right as ConstraintColumn;
        for (let nextConstraintColumn = constraintColumn.right as ConstraintColumn; nextConstraintColumn !== header; nextConstraintColumn = nextConstraintColumn.right as ConstraintColumn) {
            if (nextConstraintColumn.size < constraintColumn.size) constraintColumn = nextConstraintColumn;
        }
        return constraintColumn;
    }
}