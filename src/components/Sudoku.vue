<script setup lang="ts">
import SudokuTab from "./SudokuTab.vue";
import SolverTab from "./SolverTab.vue";
import SudokuSelectionTab from "./SudokuSelectionTab.vue";
import type {NumericSudoku, Sudoku} from "../types/Sudoku.ts";
import type {Cell} from "../types/Cell.ts";
import {ref} from "vue";
import {getRandomSudoku} from "./SudokuManager.ts";
import {SolverEventTypes} from "../types/SolverEvent.ts";
import {eventBus} from "./EventBus.ts";


const initSudoku = (newSudoku: NumericSudoku): Sudoku => {
  return {
    cells: newSudoku.cells.map((row, rowIndex) =>
        row.map((cell, cellIndex): Cell => ({
              row: rowIndex,
              col: cellIndex,
              value: cell != 0 ? cell : null,
              given: cell != 0,
              try: false,
              ref: null
            })
        ))
  }
}

const sudoku = ref<Sudoku>(
    initSudoku(getRandomSudoku())
);

eventBus.on(SolverEventTypes.SET, e => {
  sudoku.value.cells[e.row][e.column] = {
    ...sudoku.value.cells[e.row][e.column],
    value: e.value,
  };
});


</script>

<template>
  <v-row>
    <v-col>
      <SolverTab :sudoku=sudoku

      ></SolverTab>
    </v-col>
    <v-col>
      <SudokuTab :sudoku="sudoku"></SudokuTab>
    </v-col>
    <v-col>
      <SudokuSelectionTab></SudokuSelectionTab>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>