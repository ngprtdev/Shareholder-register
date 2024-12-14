<template>
  <div class="flex flex-col">
    <strong>DATE</strong>
    <p>{{ event.date }}</p>
  </div>
  <div v-if="event.type === 'CESSION'" class="flex gap-8">
    <div class="flex flex-col">
      <strong>CEDANT</strong>
      <p>{{ event.seller }}</p>
    </div>
    <div class="flex flex-col">
      <strong>CESSIONNAIRE</strong>
      <p>{{ event.transferee }}</p>
    </div>
  </div>
  <div v-else>
    <div class="flex flex-col">
      <strong>BENEFICIAIRE</strong>
      <p>{{ event.contact }}</p>
    </div>
  </div>
  <div class="flex flex-col">
    <strong>EVENEMENT</strong>
    <p v-if="event.type === 'EMISSION'">SOUSCRIPTION</p>
    <p v-if="event.type === 'EXERCICE' && event.stock === 'AGA'">ACQUISITION</p>
    <p v-else-if="event.type === 'EXERCICE'">EXERCICE</p>
    <p v-if="event.type === 'CESSION'">CESSION</p>
  </div>
  <div class="flex flex-col">
    <strong>TYPE</strong>
    <p>{{ event.stock }}</p>
  </div>
  <div class="flex flex-col">
    <strong>QUANTITE</strong>
    <p>{{ event.quantity }}</p>
  </div>
</template>

<script lang="ts">
import { Event } from "../../types/event.types.ts";

export default {
  props: {
    event: Object as PropType<Event>,
  },
};
</script>
