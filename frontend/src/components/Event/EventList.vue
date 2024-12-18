<template>
  <div>
    <p v-if="isLoading">Chargement des événements...</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <p v-if="events.length === 0">Il n'existe pas d'événement à ce jour.</p>

    <table class="table-auto border-collapse w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="border px-4 py-2">Date</th>
          <th class="border px-4 py-2">Type</th>
          <th class="border px-4 py-2">Nature</th>
          <th class="border px-4 py-2">Actionnaire(s)</th>
          <th class="border px-4 py-2">Quantité</th>
          <th class="border px-4 py-2">Prix unitaire (€)</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        <EventItem
          v-for="event in events"
          :key="event.id"
          :event="event"
          @edit="openEditForm"
          @delete="handleDelete"
          @viewDetail="handleViewDetail"
        />
      </tbody>
    </table>

    <DetailsCard
      v-if="showDetails && selectedEvent"
      :event="selectedEvent"
      :closeModal="closeDetailsModal"
    />
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useEventStore } from "../../stores/eventStore";
import DetailsCard from "../DetailsCard.vue";
import EventItem from "./EventItem.vue";
import { Event } from "../../types/event.types";

export default {
  components: { EventItem, DetailsCard },
  setup(_, { emit }) {
    const eventStore = useEventStore();
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const showDetails = ref(false);
    const selectedEvent = ref<Event | null>(null);

    const events = eventStore.events;

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

    const openEditForm = (event: Event) => {
      emit("handleEdit", event);
    };

    const handleDelete = (id: string) => {
      eventStore.deleteEvent(id);
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
      handleDelete,
      handleViewDetail,
      showDetails,
      selectedEvent,
      closeDetailsModal,
      openEditForm,
    };
  },
};
</script>
