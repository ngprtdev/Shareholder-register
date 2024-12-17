<template>
  <div class="flex flex-col">
    <strong>DATE</strong>
    <p>{{ event?.date.split("T")[0].split("-").reverse().join("-") }}</p>
  </div>
  <div v-if="event?.type === 'TRANSFER'" class="flex gap-8">
    <div class="flex flex-col">
      <strong>CEDANT</strong>
      <p>{{ event?.data.seller }}</p>
    </div>
    <div class="flex flex-col">
      <strong>CESSIONNAIRE</strong>
      <p>{{ event?.data.transferee }}</p>
    </div>
  </div>
  <div v-else>
    <div class="flex flex-col">
      <strong>BENEFICIAIRE</strong>
      <p>{{ event?.data.contact }}</p>
    </div>
  </div>
  <div class="flex flex-col">
    <strong>EVENEMENT</strong>
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

    <p v-if="event.type === 'EXERCISE' && event?.stock === 'AGA'">
      ACQUISITION
    </p>
    <p v-else-if="event?.type === 'EXERCISE'">EXERCICE</p>
    <p v-if="event?.type === 'TRANSFER'">CESSION</p>
  </div>
  <div class="flex flex-col">
    <strong>TYPE</strong>
    <p>{{ event?.stock }}</p>
  </div>
  <div class="flex flex-col">
    <strong>QUANTITE</strong>
    <p>{{ event?.quantity }}</p>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Event } from "../../types/event.types.ts";

export default {
  props: {
    event: Object as PropType<Event>,
  },
};
</script>
