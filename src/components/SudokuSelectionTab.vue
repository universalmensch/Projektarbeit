<script lang="ts" setup>
import type {NumericSudoku} from "../types/Sudoku.ts";
import {addSudoku, getRandomSudoku, getSudokus} from "./SudokuManager.ts";
import {ref} from "vue";

const emit = defineEmits<{
  (event: 'sudokuSelected', value: NumericSudoku): void
}>()

const selectSudoku = (sudoku: NumericSudoku) => {
  emit('sudokuSelected', sudoku);
}

let sudokus = ref(getSudokus());
const selectedSudoku = ref(getSudokus()[0]);
selectSudoku(selectedSudoku.value);

const sudokuName = ref('');
const newSudoku = ref('');
const error = ref<string | null>(null);

const addNewSudoku = () => {
  error.value = null;

  const cleaned = newSudoku.value.replace(/\s/g, "");
  const values = cleaned.split(",").map(Number);

  if (values.length !== 81) {
    error.value = "wrong number of cells";
    return;
  }

  if (values.some(n => !Number.isInteger(n) || n < 0 || n > 9)) {
    error.value = "only values between 0 and 9 are possible";
    return;
  }

  let Sudoku = {
    name: sudokuName.value,
    cells: Array.from({length: 9}, (_, row) =>
        values.slice(row * 9, row * 9 + 9)
    )
  };

  addSudoku(Sudoku)
  sudokus.value = getSudokus();
}

const selectRandom = () => {
  selectedSudoku.value = getRandomSudoku()
  emit('sudokuSelected', selectedSudoku.value);
}
</script>

<template>
  <h1 style="margin-top: 20%">select sudoku</h1>
  <select v-model="selectedSudoku" @change="selectSudoku(selectedSudoku)">
    <option
        v-for="sudoku in sudokus"
        :key="sudoku.name"
        :value="sudoku"
    >
      {{ sudoku.name }}
    </option>
  </select>
  <br>
  <button @click="selectRandom">select random</button>
  <h1 style="margin-top: 20%"><b>add sudoku</b></h1>
  <label for="sudokuName">name: </label>
  <br>
  <input
      id="sudokuName"
      v-model="sudokuName"
      type="text"
  />
  <br>
  <p>Numbers comma separated from top to bottom and left to right. Empty cells represented by 0. For example: 3,5,0,0,8
    ...</p>
  <label for="sudoku">sudoku: </label>
  <br>
  <textarea
      id="sudoku"
      v-model="newSudoku"
      cols="18"
      rows="9"
      type="text"
  />
  <br>
  <button @click="addNewSudoku">add</button>
  {{ error }}
</template>

<style scoped>

</style>