export type Cell = {
    row: number;
    col: number;
    value: number | null;
    given: boolean;
    try: boolean;
    ref: any | null;
};