<script setup lang="ts">

import Section from "./Section.vue";
</script>

<template>
  <h1>Hello World</h1>

  <v-container>
    <v-row>
      <v-col>
        <Section/>
      </v-col>
    </v-row>

  </v-container>

</template>

<style scoped>
table {
  border: 2px solid black;
}

td {
  border: 1px solid black;
}

.td-side {
  border-right: 2px solid black;
}

.td-bottom {
  border-bottom: 2px solid black;
}

div {
  width: 100%;
}
</style>