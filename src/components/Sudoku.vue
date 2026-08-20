<script lang="ts" setup>
import SudokuTab from "./SudokuTab.vue";
import SolverTab from "./SolverTab.vue";
import SudokuSelectionTab from "./SudokuSelectionTab.vue";
import type {NumericSudoku, Sudoku} from "../types/Sudoku.ts";
import type {Cell} from "../types/Cell.ts";
import {ref} from "vue";
import {getRandomSudoku} from "./SudokuManager.ts";
import {type SolverEvent, SolverEventTypes} from "../types/SolverEvent.ts";


const initSudoku = (newSudoku: NumericSudoku): Sudoku => {
  return {
    cells: newSudoku.cells.map((row, rowIndex) =>
        row.map((cell, cellIndex): Cell => ({
              row: rowIndex,
              column: cellIndex,
              value: cell != 0 ? cell : null,
              given: cell != 0,
              try: false,
              check: false,
              ref: null
            })
        ))
  }
}

const sudoku = ref<Sudoku>(
    initSudoku(getRandomSudoku())
);

let isPlaying = false;
let playSpeed = 50;
let currentIndex = 0;

async function playSolverEvents(events: SolverEvent[]) {
  if (isPlaying) return;
  isPlaying = true;

  while (currentIndex < events.length && isPlaying) {
    const event = events[currentIndex];
    handleSolverEvent(event);

    await new Promise(resolve => setTimeout(resolve, playSpeed));
    currentIndex++;
  }

  isPlaying = false;
}

function pause() {
  isPlaying = false;
}

function resume(events: SolverEvent[]) {
  playSolverEvents(events);
}

function setSpeed(ms: number) {
  playSpeed = ms;
}

function handleSolverEvent(solverEvent: SolverEvent) {

  switch (solverEvent.type) {
    case SolverEventTypes.SET:
      sudoku.value.cells[solverEvent.row][solverEvent.column] = {
        ...sudoku.value.cells[solverEvent.row][solverEvent.column],
        value: solverEvent.value,
        try: false,
        check: false
      }
      break;

    case SolverEventTypes.TRY:
      sudoku.value.cells[solverEvent.row][solverEvent.column] = {
        ...sudoku.value.cells[solverEvent.row][solverEvent.column],
        value: solverEvent.value,
        try: true,
        check: false
      }
      break;

    case SolverEventTypes.UNSET:
      sudoku.value.cells[solverEvent.row][solverEvent.column] = {
        ...sudoku.value.cells[solverEvent.row][solverEvent.column],
        value: null,
        try: false,
        check: false
      }
      break;

    case SolverEventTypes.CHECK:
      sudoku.value.cells[solverEvent.row][solverEvent.column] = {
        ...sudoku.value.cells[solverEvent.row][solverEvent.column],
        check: true
      }
      break;

    case SolverEventTypes.UNCHECK:
      sudoku.value.cells[solverEvent.row][solverEvent.column] = {
        ...sudoku.value.cells[solverEvent.row][solverEvent.column],
        check: false
      }
      break;

    case SolverEventTypes.CHECK_CELLS:
      for (const [row, column] of solverEvent.cells) {
        sudoku.value.cells[row][column] = {
          ...sudoku.value.cells[row][column],
          check: true
        }
      }
      break;

    case SolverEventTypes.UNCHECK_CELLS:
      for (const [row, column] of solverEvent.cells) {
        sudoku.value.cells[row][column] = {
          ...sudoku.value.cells[row][column],
          check: false
        }
      }
      break;

    case SolverEventTypes.DONE:
      sudoku.value.cells.forEach(row => {
            row.forEach(cell => {
              cell.try = false;
              cell.check = false;
            })
          }
      )
  }
}

</script>

<template>
  <v-row>
    <v-col>
      <SolverTab :sudoku="sudoku" @solverEvents="playSolverEvents($event)"/>
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