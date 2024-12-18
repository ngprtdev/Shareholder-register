<template>
  <tr class="shadow-lg rounded-lg space-y-4">
    <td class="px-4 py-2 rounded-l-lg">
      {{ formattedDate }}
    </td>

    <td class="px-4 py-2">
      <strong v-if="event.type === 'ISSUANCE'">
        {{
          event.stock === "Actions" || event.stock === "BSA"
            ? "Souscription"
            : "Attribution"
        }}
      </strong>
      <strong v-else-if="event.type === 'EXERCISE'">Exercice/Conversion</strong>
      <strong v-else-if="event.type === 'TRANSFER'">Cession</strong>
    </td>

    <td class="px-4 py-2">{{ event.stock }}</td>

    <td class="px-4 py-2">
      <span v-if="event.type === 'TRANSFER'">
        {{ event.data.seller }} à {{ event.data.transferee }}
      </span>
      <span v-else>{{ event.data.contact }}</span>
    </td>

    <td class="px-4 py-2">{{ event.quantity }}</td>

    <td class="px-4 py-2">{{ event.unitPrice }}€</td>

    <td
      class="px-4 py-2 flex justify-center items-center gap-4 rounded-r-lg border-l-2"
    >
      <Button buttonType="secondary" @click="handleViewDetail">Détail</Button>
      <Button buttonType="primary" @click="handleEdit">Modifier</Button>
      <Button buttonType="cancel" @click="handleDelete">Supprimer</Button>
    </td>
  </tr>
</template>

<script lang="ts">
import { PropType, computed } from "vue";
import { Event } from "../../types/event.types";
import Button from "../Button.vue";

export default {
  components: { Button },
  props: {
    event: {
      type: Object as PropType<Event>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const formattedDate = computed(() =>
      props.event.date.split("T")[0].split("-").reverse().join("-")
    );

    const handleViewDetail = () => {
      emit("viewDetail", props.event);
    };

    const handleEdit = () => {
      emit("edit", props.event);
    };

    const handleDelete = () => {
      emit("delete", props.event.id);
    };

    return {
      formattedDate,
      handleViewDetail,
      handleEdit,
      handleDelete,
    };
  },
};
</script>
