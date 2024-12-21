<template>
  <tr class="text-center border-b border-2">
    <td class="px-4 py-4">
      {{ event?.date.split("T")[0].split("-").reverse().join("-") }}
    </td>

    <td class="px-4 py-2">
      <p
        v-if="
          event?.eventType === 'ISSUANCE' &&
          event?.stock !== 'BSPCE' &&
          event?.stock !== 'AGA'
        "
      >
        SOUSCRIPTION
      </p>
      <p v-else-if="event?.eventType === 'ISSUANCE'">ATTRIBUTION</p>
      <p v-if="event?.eventType === 'EXERCISE' && event?.stock === 'AGA'">
        ACQUISITION
      </p>
      <p v-else-if="event?.eventType === 'EXERCISE'">EXERCICE</p>
      <p v-if="event?.eventType === 'TRANSFER'">CESSION</p>
    </td>

    <td class="px-4 py-2">
      <div class="flex justify-center gap-2">
        <div>{{ event?.debtor ? event?.debtor : "-" }}</div>
      </div>
    </td>

    <td class="px-4 py-2">
      <div class="flex justify-center gap-2">
        <div>{{ event?.creditor ? event?.creditor : "-" }}</div>
      </div>
    </td>

    <td class="px-4 py-2">{{ event?.stock }}</td>

    <td class="px-4 py-2">{{ event?.quantity }}</td>
  </tr>
</template>

<script lang="ts">
import { PropType } from "vue";
import { RegisterRow } from "../../types/registerRow";

export default {
  props: {
    event: Object as PropType<RegisterRow>,
  },
};
</script>
