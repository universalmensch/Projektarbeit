
<script setup lang="ts">

// TODO möglichkeit solver und option auszuwählen hinzufügen

import {SolverManager, solvers} from "./SolverManager.ts";
import type {Sudoku} from "../types/Sudoku.ts";

const props = defineProps<{
  sudoku: Sudoku;
}>();

let manager: SolverManager = new SolverManager();

manager.setSolver(solvers[0])


const start = () => {
  manager.setBoard(props.sudoku);
  manager.solveSteps();
}

</script>

<template>
  <p>solvert-tab</p>
  <button @click="start">Start Solver</button>/
</template>

<style scoped>

</style>