<template>
  <tr
    v-for="row in sortedCaptable"
    :key="row.contact"
    class="grid grid-cols-7 text-center border-b border-2 py-2"
  >
    <td class="px-4 py-2">{{ row.contact }}</td>
    <td class="px-4 py-2">{{ getTitleQuantity(row, "Actions") }}</td>
    <td class="px-4 py-2">{{ getTitleQuantity(row, "BSA") }}</td>
    <td class="px-4 py-2">{{ getTitleQuantity(row, "BSPCE") }}</td>
    <td class="px-4 py-2">{{ getTitleQuantity(row, "AGA") }}</td>
    <td class="px-4 py-2">{{ row.FDQuantity.toFixed(2) }}%</td>
    <td class="px-4 py-2">{{ row.NFDQuantity.toFixed(2) }}%</td>
  </tr>
  <tr class="grid grid-cols-7 text-center bg-gray-200 font-bold">
    <td class="px-4 py-2 border">Total</td>
    <td class="px-4 py-2 border">{{ totalByTitle("Actions") }}</td>
    <td class="px-4 py-2 border">{{ totalByTitle("BSA") }}</td>
    <td class="px-4 py-2 border">{{ totalByTitle("BSPCE") }}</td>
    <td class="px-4 py-2 border">{{ totalByTitle("AGA") }}</td>
    <td class="px-4 py-2 border">-</td>
    <td class="px-4 py-2 border">-</td>
  </tr>
</template>

<script lang="ts">
import { computed, PropType } from "vue";
import { CaptableRow } from "../../types/captableRow";

export default {
  props: {
    captable: {
      type: Array as PropType<CaptableRow[]>,
      required: true,
    },
  },
  setup(props) {
    const getLastName = (contact: string): string => {
      const parts = contact.split(" ");
      return parts.length > 1 ? parts[parts.length - 1] : contact;
    };

    const sortedCaptable = computed(() => {
      return [...props.captable].sort((a, b) => {
        const lastNameA = getLastName(a.contact).toLowerCase();
        const lastNameB = getLastName(b.contact).toLowerCase();
        return lastNameA.localeCompare(lastNameB);
      });
    });

    const getTitleQuantity = (row: any, title: string) => {
      const titleObj = row.titles.find((t: any) => t.name === title);
      return titleObj ? titleObj.quantity : 0;
    };

    const totalByTitle = (title: string) => {
      return props.captable.reduce((total, row) => {
        const titleObj = row.titles.find((t: any) => t.name === title);
        return total + (titleObj ? titleObj.quantity : 0);
      }, 0);
    };

    return {
      sortedCaptable,
      getTitleQuantity,
      totalByTitle,
    };
  },
};
</script>
