<script lang="ts" setup>

import {SolverManager, solvers} from "./SolverManager.ts";
import type {Sudoku} from "../types/Sudoku.ts";
import type {SolverEvent} from "../types/SolverEvent.ts";
import type {Solver} from "../types/Solver.ts";

const props = defineProps<{
  sudoku: Sudoku;
}>();

const manager: SolverManager = new SolverManager();
let selectedSolver: Solver = solvers[0];

const emit = defineEmits<{
  (event: 'solverEvents', value: SolverEvent[]): void
}>()

const start = () => {
  manager.setSolver(selectedSolver)
  manager.setBoard(props.sudoku);
  emit('solverEvents', manager.solveSteps());
}

</script>

<template>
  <p>select algorithm</p>
  <select v-model="selectedSolver">
    <option
        v-for="solver in solvers"
        :key="solver.name"
        :value="solver"
    >
      {{ solver.name }}
    </option>
  </select>

  <button @click="start">Start Solver</button>
</template>

<style scoped>

</style>