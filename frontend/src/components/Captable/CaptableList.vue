<template>
  <tr
    v-for="row in captable"
    :key="row.contact"
    class="grid grid-cols-7 text-center border-b"
  >
    <td class="px-4 py-2 border">{{ row.contact }}</td>
    <td class="px-4 py-2 border">{{ getTitleQuantity(row, "Actions") }}</td>
    <td class="px-4 py-2 border">{{ getTitleQuantity(row, "BSA") }}</td>
    <td class="px-4 py-2 border">{{ getTitleQuantity(row, "BSPCE") }}</td>
    <td class="px-4 py-2 border">{{ getTitleQuantity(row, "AGA") }}</td>
    <td class="px-4 py-2 border">{{ row.FDQuantity.toFixed(2) }}%</td>
    <td class="px-4 py-2 border">{{ row.NFDQuantity.toFixed(2) }}%</td>
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
