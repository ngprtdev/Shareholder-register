<template>
  <div>
    <p v-if="isLoading">Chargement des événements...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="events.length === 0">Il n'existe pas d'évènement à ce jour.</p>
    <ul>
      <EventItem
        v-for="event in events"
        :key="event.id"
        :event="event"
        @edit="openEditForm"
        @viewDetail="handleViewDetail"
      />
    </ul>

    <DetailsCard
      v-if="showDetails && selectedEvent"
      :event="selectedEvent"
      :closeModal="closeDetailsModal"
    />
  </div>
</template>

<script lang="ts">
import { useEventStore } from "../../stores/eventStore.ts";
import EventItem from "./EventItem.vue";
import DetailsCard from "../DetailsCard.vue";
import { Event } from "../../types/event.types";
import { ref, onMounted } from "vue";

export default {
  components: {
    EventItem,
    DetailsCard,
  },
  setup(_, { emit }) {
    const eventStore = useEventStore();
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const showDetails = ref(false);
    const selectedEvent = ref<Event | null>(null);

    const events = eventStore.events;
    const openEditForm = (event: Event) => {
      emit("handleEdit", event);
    };

    const fetchEvents = async () => {
      isLoading.value = true;
      error.value = null;
      try {
        await eventStore.getAllEvents();
      } catch (err) {
        console.error("Erreur lors de la récupération des événements :", err);
        error.value = "Erreur lors de la récupération des événements.";
      } finally {
        isLoading.value = false;
      }
    };

    const handleViewDetail = (event: Event) => {
      selectedEvent.value = event;
      showDetails.value = true;
    };

    const closeDetailsModal = () => {
      showDetails.value = false;
      selectedEvent.value = null;
    };

    onMounted(() => {
      if (!eventStore.isLoaded) {
        fetchEvents();
      }
    });
    return {
      events,
      isLoading,
      error,
      selectedEvent,
      handleViewDetail,
      showDetails,
      closeDetailsModal,
      openEditForm,
    };
  },
};
</script>
