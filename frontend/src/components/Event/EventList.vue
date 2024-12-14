<template>
  <ul>
    <EventItem
      v-for="event in events"
      :key="event.id"
      :event="event"
      @edit="openEditForm"
    />
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useEventStore } from "../../stores/eventStore.ts";
import EventItem from "./EventItem.vue";

export default {
  components: {
    EventItem,
  },
  setup(props, { emit }) {
    const eventStore = useEventStore();

    const events = eventStore.events;
    const openEditForm = (event: Event) => {
      console.log("event in eventList when modified", event);
      emit("handleEdit", event);
      console.log("Modifier l'événement avec l'ID: ", event.id);
    };

    return {
      events,
      openEditForm,
    };
  },
};
</script>
