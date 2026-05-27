
export type SolverEvent =
    | { type: typeof SolverEventTypes.SET; row: number; column: number; value: number }
    | { type: typeof SolverEventTypes.UNSET; row: number; column: number; }
    | { type: typeof SolverEventTypes.TRY; row: number; column: number; value: number }
    | { type: typeof SolverEventTypes.CHECK; row: number; column: number; }
    | { type: typeof SolverEventTypes.DONE };

export const SolverEventTypes = {
    SET: "set",
    UNSET: "unset",
    TRY: "try",
    CHECK: "check",
    DONE: "done"
} as const;
