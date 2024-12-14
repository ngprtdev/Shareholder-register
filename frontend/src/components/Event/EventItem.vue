<template>
  <li class="flex gap-4">
    <div class="flex gap-4" v-if="event.type === 'EMISSION'">
      <p>{{ event.date }}</p>
      <strong>Émission</strong> {{ event.stock }} - {{ event.contact }} -
      {{ event.quantity }} unités à {{ event.unitPrice }}€
    </div>
    <div class="flex gap-4" v-else-if="event.type === 'EXERCICE'">
      <p>{{ event.date }}</p>
      <strong>Exercice/Conversion</strong>: {{ event.stock }} -
      {{ event.contact }} - {{ event.quantity }} unités à {{ event.unitPrice }}€
    </div>
    <div class="flex gap-4" v-else-if="event.type === 'CESSION'">
      <p>{{ event.date }}</p>
      <strong>Cession</strong>: {{ event.stock }} - {{ event.quantity }} unités
      de {{ event.seller }} à {{ event.transferee }}
    </div>
    <button @click="handleEdit">Modifier</button>
    <button @click="handleDelete">Supprimer</button>
  </li>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Event } from "../../types/event.types";
import { useEventStore } from "../../stores/eventStore";

export default {
  props: {
    event: Object as PropType<Event>,
  },
  setup(props, { emit }) {
    const eventStore = useEventStore();

    const handleDelete = () => {
      eventStore.deleteEvent(props.event.id);
    };

    const handleEdit = () => {
      emit("edit", props.event);
    };

    return {
      handleDelete,
      handleEdit,
    };
  },
};
</script>
