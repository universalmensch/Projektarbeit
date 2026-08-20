export type SolverEvent =
    | { type: typeof SolverEventTypes.SET; row: number; column: number; value: number }
    | { type: typeof SolverEventTypes.UNSET; row: number; column: number; }
    | { type: typeof SolverEventTypes.TRY; row: number; column: number; value: number }
    | { type: typeof SolverEventTypes.CHECK; row: number; column: number; }
    | { type: typeof SolverEventTypes.UNCHECK; row: number; column: number; }
    | { type: typeof SolverEventTypes.CHECK_CELLS; cells: [row: number, column: number][] }
    | { type: typeof SolverEventTypes.UNCHECK_CELLS; cells: [row: number, column: number][] }
    | { type: typeof SolverEventTypes.DONE };

export const SolverEventTypes = {
    SET: "set",
    UNSET: "unset",
    TRY: "try",
    CHECK: "check",
    UNCHECK: "uncheck",
    DONE: "done",
    CHECK_CELLS: "check_cells",
    UNCHECK_CELLS: "uncheck_cells",
} as const;
