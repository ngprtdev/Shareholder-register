<template>
  <header class="bg-gray-800 p-4 text-white sticky top-0">
    <nav>
      <ul class="list-none flex gap-4 m-0 p-0">
        <li class="inline">
          <router-link to="/events" class="text-white hover:text-gray-400"
            >Gestion des Événements</router-link
          >
        </li>
        <li class="inline">
          <router-link to="/captable" class="text-white hover:text-gray-400"
            >Table de Capitalisation</router-link
          >
        </li>
        <li class="inline">
          <router-link to="/register" class="text-white hover:text-gray-400"
            >Registre d'Actionnaires</router-link
          >
        </li>
      </ul>
    </nav>
  </header>
</template>
