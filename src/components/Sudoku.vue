<script setup lang="ts">
import { ref } from 'vue';
import type {Cell} from "../types/Cell.ts";
import {VTextField} from "vuetify/components";

const size = 9;

const switchFocusCell = (e: KeyboardEvent, row: number, col: number) => {

  switch (e.key) {
    case "ArrowUp":
      if (row > 0) row -= 1;
      break;
    case "ArrowDown":
      if (row < 8) row += 1;
      break;
    case "ArrowLeft":
      if (col > 0) col -= 1;
      break;
    case "ArrowRight":
      if (col < 8) col += 1;
      break;
    default:
      return;
  }

  e.preventDefault();
  cells.value[row][col].ref?.focus();
};

const cells = ref<Cell[][]>(
    Array.from({ length: size }, (_, row) =>
        Array.from({ length: size }, (_, col) => ({
          row,
          col,
          value: null,
          given: false,
          ref: null
        })) as Cell[]
    )
);

const setCellValue = (value: string, row: number, col: number) => {
  const numberValue = value.replace(/[^1-9]/g, "");

  const cell = cells.value[row][col];
  if (cell.given) return;
  cell.value = numberValue ? Number(numberValue) : null;
};
</script>

<template>
  <h1 style="margin-top: 20%">Sudoku</h1>
    <div class="sudoku-row">
      <div
          v-for="(row, rowIndex) in cells"
          :key="rowIndex"
          :class="
          { 'border-top-bold': rowIndex % 3 === 0 && rowIndex !== 0}"
      >
        <div class="sudoku-col">
          <div
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              class="sudoku-cell"
              @keydown="switchFocusCell($event, cell.row, cell.col)"
              tabindex="0"
              :class="[
              { 'is-given': cell.given },
              { 'border-left-bold': colIndex % 3 === 0 && colIndex !== 0 },
            ]"
          >
        <span>
          <v-text-field
              :ref="element => cell.ref = element"
              :model-value="cell.value"
              @update:model-value="setCellValue($event, cell.row, cell.col)"
              type="text"
              maxlength="1"
              density="compact"
              hide-details
              variant="plain"
              class="sudoku-input"
          ></v-text-field>
        </span>
          </div>
        </div>

      </div>

    </div>
</template>

<style scoped>

.sudoku-row {
  display: grid;
  grid-template-rows: repeat(9, 50px);
  border: 2px solid black;
}

.sudoku-col {
  display: grid;
  grid-template-columns: repeat(9, 50px);
  height: 100%;
}

.sudoku-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid lightgray;
}

.sudoku-cell.is-given {

}

.border-top-bold {
  border-top: 2px solid darkgrey;
}
.border-left-bold {
  border-left: 2px solid darkgrey;
}
.border-right-bold {
  border-right: 2px solid darkgrey;
}
.border-bottom-bold {
  border-bottom: 2px solid darkgrey;
}

.sudoku-input {
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-bottom: 5px;
}

</style>