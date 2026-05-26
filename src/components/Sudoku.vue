<script setup lang="ts">
import SudokuTab from "./SudokuTab.vue";
import SolverTab from "./SolverTab.vue";
import SudokuSelectionTab from "./SudokuSelectionTab.vue";
</script>

<template>
  <v-row>
    <v-col>
      <SolverTab></SolverTab>
    </v-col>
    <v-col>
      <SudokuTab></SudokuTab>
    </v-col>
    <v-col>
      <SudokuSelectionTab></SudokuSelectionTab>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>