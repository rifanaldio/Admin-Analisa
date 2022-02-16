import DashboardLayout from "@/layout/DashboardLayout";
import Dashboard from "../views/Dashboard.vue";
import Ticket from "../views/Ticket.vue";
import User from "../views/User.vue";
// import userRoutes from "./userRoutes";
// import { createRouter, createWebHashHistory } from "vue-router";
//
// import DashboardLayout from "@/layout/DashboardLayout";

// const routes = [
//   {
//     path: "/",
//     redirect: "/dashboard",
//     component: DashboardLayout,
//     children: [
//       {
//         path: "/dashboard",
//         name: "dashboard",
//         components: { default: Dashboard },
//       },
//       {
//         path: "/laporan",
//         name: "laporan",
//         components: { default: Laporan },
//       },
//
//       {
//         path: "/ticket",
//         name: "ticket",
//         components: { default: Ticket },
//       },
//       {
//         path: "/user",
//         name: "user",
//         components: { default: User },
//       },
//       {
//         path: "/details",
//         name: "details",
//         components: { default: Details },
//       },
//     ],
//   },
// ];
//
// const router = createRouter({
//   history: createWebHashHistory(),
//   linkActiveClass: "active",
//   routes,
// });
//
// export default router;
export default [
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
      },

      {
        path: "/ticket",
        name: "ticket",
        component: Ticket,
      },
      {
        path: "/user",
        name: "user",
        component: User,
      },
    ],
  },
];
