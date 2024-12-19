<template>
  <header class="bg-gray-800 p-4 text-white sticky top-0">
    <nav>
      <ul class="list-none flex gap-4 m-0 p-0 text-lg">
        <li class="inline">
          <router-link
            to="/events"
            :class="{
              'text-white pointer-events-none font-semibold':
                isSelected('/events'),
              'hover:text-gray-400': !isSelected('/events'),
            }"
          >
            Gestion des Événements
          </router-link>
        </li>
        <li class="inline">
          <router-link
            to="/captable"
            :class="{
              'text-white pointer-events-none font-semibold':
                isSelected('/captable'),
              'hover:text-gray-400': !isSelected('/captable'),
            }"
          >
            Table de Capitalisation
          </router-link>
        </li>
        <li class="inline">
          <router-link
            to="/register"
            :class="{
              'text-white pointer-events-none font-semibold':
                isSelected('/register'),
              'hover:text-gray-400': !isSelected('/register'),
            }"
          >
            Registre d'Actionnaires
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();

    const isSelected = (path: string): boolean => {
      return route.path === path;
    };

    return {
      isSelected,
    };
  },
};
</script>
