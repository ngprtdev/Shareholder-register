<template>
  <tr
    class="grid grid-cols-7 text-center"
    v-for="row in captable"
    :key="row.contact"
  >
    <td>{{ row.contact }}</td>
    <td>{{ getTitleQuantity(row, "Actions") }}</td>
    <td>{{ getTitleQuantity(row, "BSA") }}</td>
    <td>{{ getTitleQuantity(row, "BSPCE") }}</td>
    <td>{{ getTitleQuantity(row, "AGA") }}</td>
    <td>{{ row.FDQuantity.toFixed(2) }}%</td>
    <td>{{ row.NFDQuantity.toFixed(2) }}%</td>
  </tr>
</template>

<script lang="ts">
import { PropType } from "vue";
import { CaptableRow } from "../../types/captableRow";
export default {
  props: {
    captable: {
      type: Array as PropType<CaptableRow[]>,
      required: true,
    },
  },

  setup() {
    const getTitleQuantity = (row: any, title: string) => {
      const titleObj = row.titles.find((t: any) => t.name === title);
      return titleObj ? titleObj.quantity : 0;
    };

    return {
      getTitleQuantity,
    };
  },
};
</script>
