<script lang="ts" setup>
import SudokuTab from "./SudokuTab.vue";
import SolverTab from "./SolverTab.vue";
import SudokuSelectionTab from "./SudokuSelectionTab.vue";
import type {NumericSudoku, Sudoku} from "../types/Sudoku.ts";
import type {Cell} from "../types/Cell.ts";
import {ref} from "vue";
import {getSudokus} from "./SudokuManager.ts";
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

let selectedSudoku: NumericSudoku = getSudokus()[0];
let sudoku = ref<Sudoku>(initSudoku(selectedSudoku));

const resetSudoku = () => {
  setSudoku(selectedSudoku);
}

const setSudoku = (newSudoku: NumericSudoku) => {
  selectedSudoku = newSudoku;
  sudoku.value = initSudoku(newSudoku);
  currentIndex = 0;
  currentEvents = [];
  isPlaying.value = false;
}

const SPEED_SLOW = 200;
const SPEED_NORMAL = 80;
const SPEED_FAST = 15;

let isPlaying = ref(false);
let playSpeed = SPEED_SLOW;
let currentIndex = 0;
let currentEvents: SolverEvent[] = [];

function startSolverEvents(events: SolverEvent[]) {
  if (isPlaying.value) return;

  currentEvents = events;
  currentIndex = 0;
  isPlaying.value = true;

  playSolverEvents();
}

async function playSolverEvents() {
  while (currentIndex < currentEvents.length && isPlaying.value) {
    const event = currentEvents[currentIndex];

    handleSolverEvent(event);
    currentIndex++;

    await new Promise(resolve => setTimeout(resolve, playSpeed));
  }

  isPlaying.value = false;
}

function togglePlaying() {
  if (isPlaying.value) {
    pause();
  } else {
    resume();
  }
}

function pause() {
  isPlaying.value = false;
}

function resume() {
  if (isPlaying.value) return;
  if (currentIndex >= currentEvents.length) return;

  isPlaying.value = true;
  playSolverEvents();
}

function setSpeed(ms: number) {
  playSpeed = ms;
}

function nextEvent() {
  if (isPlaying.value) return;
  if (currentIndex >= currentEvents.length) return;

  const event = currentEvents[currentIndex];

  handleSolverEvent(event);
  currentIndex++;
}

function previousEvent() {
  if (isPlaying.value) return;
  if (currentIndex <= 0) return;

  goToEvent(currentIndex - 1);
}

function goToEvent(index: number) {
  sudoku.value = initSudoku(selectedSudoku);

  for (let i = 0; i < index; i++) {
    handleSolverEvent(currentEvents[i]);
  }

  currentIndex = index;
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
      <SolverTab :sudoku="sudoku" @solverEvents="startSolverEvents($event)"/>
    </v-col>
    <v-col>
      <SudokuTab :sudoku="sudoku"/>
      <div class="solver-controls">
        <button @click="resetSudoku">Reset Board</button>

        <button
            :disabled="isPlaying"
            @click="previousEvent"
        >
          Previous
        </button>

        <button @click="togglePlaying">
          {{ isPlaying ? '⏸' : "▶" }}
        </button>

        <button
            :disabled="isPlaying"
            @click="nextEvent"
        >
          Next
        </button>

        <button @click="setSpeed(SPEED_SLOW)">
          >
        </button>

        <button @click="setSpeed(SPEED_NORMAL)">
          >>
        </button>

        <button @click="setSpeed(SPEED_FAST)">
          >>>
        </button>
      </div>
    </v-col>
    <v-col>
      <SudokuSelectionTab @sudokuSelected="setSudoku($event)"/>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>