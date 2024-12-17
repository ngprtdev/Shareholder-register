<template>
  <li class="flex gap-4">
    <div class="flex gap-4" v-if="event?.type === 'ISSUANCE'">
      <p>{{ event.date.split("T")[0].split("-").reverse().join("-") }}</p>
      <strong>Souscription</strong> {{ event.stock }} {{ event.data.contact }}
      {{ event.quantity }} {{ event.unitPrice }}€
    </div>
    <div class="flex gap-4" v-else-if="event?.type === 'EXERCISE'">
      <p>{{ event.date.split("T")[0].split("-").reverse().join("-") }}</p>
      <strong>Exercice/Conversion</strong>: {{ event.stock }}
      {{ event.data.contact }} {{ event.quantity }} {{ event.unitPrice }}€
    </div>
    <div class="flex gap-4" v-else-if="event?.type === 'TRANSFER'">
      <p>{{ event.date.split("T")[0].split("-").reverse().join("-") }}</p>
      <strong>Cession</strong> {{ event.stock }} {{ event.quantity }}
      {{ event.data.seller }} {{ event.data.transferee }}
    </div>
    <button @click="handleViewDetail">Voir le détail</button>
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
      if (!props.event) {
        console.error("Aucun événement sélectionné pour suppression.");
        return;
      }

      eventStore.deleteEvent(props.event.id);
    };

    const handleEdit = () => {
      emit("edit", props.event);
    };

    const handleViewDetail = () => {
      emit("viewDetail", props.event);
    };

    return {
      handleDelete,
      handleEdit,
      handleViewDetail,
    };
  },
};
</script>
