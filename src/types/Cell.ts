export type Cell = {
    row: number;
    column: number;
    value: number | null;
    given: boolean;
    try: boolean;
    check: boolean;
    ref: any | null;
};