

export function isValid(board: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
        if (board[i][col] === num) return false;
    }

    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;

    for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
            if (board[r][c] === num) return false;
        }
    }

    return true;
}

export const maxSteps = 81;