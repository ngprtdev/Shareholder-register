<template>
  <tr class="text-center border-b border-2">
    <td class="px-4 py-4">
      {{ event?.date.split("T")[0].split("-").reverse().join("-") }}
    </td>

    <td class="px-4 py-2">
      <p
        v-if="
          event?.type === 'ISSUANCE' &&
          event?.stock !== 'BSPCE' &&
          event?.stock !== 'AGA'
        "
      >
        SOUSCRIPTION
      </p>
      <p v-else-if="event?.type === 'ISSUANCE'">ATTRIBUTION</p>
      <p v-if="event?.type === 'EXERCISE' && event?.stock === 'AGA'">
        ACQUISITION
      </p>
      <p v-else-if="event?.type === 'EXERCISE'">EXERCICE</p>
      <p v-if="event?.type === 'TRANSFER'">CESSION</p>
    </td>

    <td class="px-4 py-2">
      <div v-if="event?.type === 'TRANSFER'" class="flex justify-center gap-2">
        <div><strong>CÉDANT :</strong> {{ event?.data.seller }}</div>
        <div><strong>CESSIONNAIRE :</strong> {{ event?.data.transferee }}</div>
      </div>
      <div v-else>
        <strong>BÉNÉFICIAIRE :</strong> {{ event?.data.contact }}
      </div>
    </td>

    <td class="px-4 py-2">{{ event?.stock }}</td>

    <td class="px-4 py-2">{{ event?.quantity }}</td>
  </tr>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Event } from "../../types/event.types";

export default {
  props: {
    event: Object as PropType<Event>,
  },
};
</script>
