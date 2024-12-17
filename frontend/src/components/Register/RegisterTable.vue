<template>
  <div>
    <ul
      class="grid grid-cols-5 text-center"
      v-for="event in sortedEvents"
      :key="event.id"
    >
      <RegisterItem :event="event" />
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, PropType } from "vue";
import RegisterItem from "./RegisterItem.vue";
import { Event } from "../../types/event.types";

export default {
  components: { RegisterItem },
  props: {
    events: {
      type: Array as PropType<Event[]>,
      required: true,
    },
  },
  setup(props) {
    const sortedEvents = computed(() =>
      props.events
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
    return {
      sortedEvents,
    };
  },
};
</script>
