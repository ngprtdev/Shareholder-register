<template>
  <div>
    <h1>Gestion des Événements</h1>
    <EventList @handleEdit="openEditForm" />
    <button @click="openCreateForm">Créer un événement</button>
    <EventForm
      v-if="showForm"
      @cancel="closeForm"
      @HandleSubmit="submitEvent"
      :event="eventToEdit ? eventToEdit : null"
      :isDisabled="eventToEdit"
    />
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useEventStore } from "../stores/eventStore";
import EventList from "../components/Event/EventList.vue";
import EventForm from "../components/Event/EventForm.vue";

export default {
  components: {
    EventList,
    EventForm,
  },
  setup() {
    const eventStore = useEventStore();
    const showForm = ref(false);
    const eventToEdit = ref<Event | null>(null);

    const openCreateForm = () => {
      showForm.value = true;
    };

    const openEditForm = (event: Event) => {
      console.log("eventtoEdit", eventToEdit);

      eventToEdit.value = event;
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      eventToEdit.value = null;
    };

    const submitEvent = (eventData: Event) => {
      if (eventToEdit.value) {
        eventStore.updateEvent(eventData);
      } else {
        const { seller, transferee, stock, quantity } = eventData;

        if (eventData.type === "CESSION") {
          eventStore.transferShares(
            seller,
            transferee,
            stock,
            quantity,
            eventData
          );
        } else {
          eventStore.addEvent(eventData);
        }
      }
      closeForm();
    };

    return {
      showForm,
      openCreateForm,
      openEditForm,
      eventToEdit,
      closeForm,
      submitEvent,
    };
  },
};
</script>
