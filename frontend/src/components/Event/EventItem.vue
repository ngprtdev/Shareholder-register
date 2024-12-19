<template>
  <tbody class="text-lg text-center font-medium shadow-xl rounded-lg">
    <tr>
      <td class="px-4 py-2 rounded-l-lg">
        <p class="px-4 py-2 font-semibold text-xl">Date</p>

        {{ formattedDate }}
      </td>

      <td class="px-4 py-2">
        <p class="px-4 py-2 font-semibold text-xl">Type</p>

        <p v-if="event.type === 'ISSUANCE'">
          {{
            event.stock === "Actions" || event.stock === "BSA"
              ? "Souscription"
              : "Attribution"
          }}
        </p>
        <p v-else-if="event.type === 'EXERCISE'">
          {{
            event.stock === "BSPCE" || event.stock === "BSA"
              ? "Exercice"
              : "Acquisition"
          }}
        </p>
        <p v-else-if="event.type === 'TRANSFER'">Cession</p>
      </td>

      <td class="px-4 py-2">
        <p class="px-4 py-2 font-semibold text-xl">Nature</p>
        <p>{{ event.stock }}</p>
      </td>

      <td class="px-4 py-2">
        <p class="px-4 py-2 font-semibold text-xl">Actionnaire(s)</p>

        <span v-if="event.type === 'TRANSFER'">
          {{ event.data.seller }} à {{ event.data.transferee }}
        </span>
        <span v-else>{{ event.data.contact }}</span>
      </td>

      <td class="px-4 py-2">
        <p class="px-4 py-2 font-semibold text-xl">Quantité</p>
        <p>{{ event.quantity }}</p>
      </td>

      <td class="px-4 py-2">
        <p class="px-4 py-2 font-semibold text-xl">Prix unitaire</p>

        <p>{{ event.unitPrice }}€</p>
      </td>

      <td class="px-4 py-2 flex flex-col rounded-r-lg border-l-2">
        <p class="px-4 py-2 font-semibold text-xl">Actions</p>
        <div class="flex justify-center items-center gap-4">
          <Button buttonType="secondary" @click="handleViewDetail"
            >Détail</Button
          >
          <Button buttonType="primary" @click="handleEdit">Modifier</Button>
          <Button buttonType="cancel" @click="handleDelete">Supprimer</Button>
        </div>
      </td>
    </tr>
  </tbody>
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
