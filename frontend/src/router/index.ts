import { createRouter, createWebHistory } from "vue-router";
import EventsView from "../views/EventsView.vue";
import CaptableView from "../views/CaptableView.vue";
import RegisterView from "../views/RegisterView.vue";

const routes = [
  {
    path: "/events",
    name: "events",
    component: EventsView,
  },
  {
    path: "/captable",
    name: "captable",
    component: CaptableView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
