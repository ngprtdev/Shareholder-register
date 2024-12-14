<template>
  <tr
    class="grid grid-cols-7 text-center"
    v-for="row in captable"
    :key="row.contact"
  >
    <td>{{ row.contact }}</td>
    <td>{{ row.actions }}</td>
    <td>{{ row.BSA }}</td>
    <td>{{ row.BSPCE }}</td>
    <td>{{ row.AGA }}</td>
    <td>{{ row.FDPercentage.toFixed(2) }}%</td>
    <td>{{ row.NFDPercentage.toFixed(2) }}%</td>
  </tr>
</template>

<script lang="ts">
export default {
  props: {
    captable: {
      type: Array,
      required: true,
    },
  },
};
</script>
