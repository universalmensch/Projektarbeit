<script lang="ts" setup>
import type {NumericSudoku} from "../types/Sudoku.ts";
import {getSudokus} from "./SudokuManager.ts";

const emit = defineEmits<{
  (event: 'sudokuSelected', value: NumericSudoku): void
}>()

const selectSudoku = (sudoku: NumericSudoku) => {
  emit('sudokuSelected', sudoku);
}

let selectedSudoku: NumericSudoku = getSudokus()[0];
selectSudoku(selectedSudoku);
</script>

<template>
  <p>select sudoku</p>
  <select v-model="selectedSudoku" @change="selectSudoku(selectedSudoku)">
    <option
        v-for="sudoku in getSudokus()"
        :key="sudoku.name"
        :value="sudoku"
    >
      {{ sudoku.name }}
    </option>
  </select>
</template>

<style scoped>

</style>