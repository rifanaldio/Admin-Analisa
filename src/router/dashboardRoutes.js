import DashboardLayout from "../layout/DashboardLayout";
// import StartPage from "../views/Dashboard/StartPage";
import usersRoutes from "./userRoutes";
import { inArray } from "@/plugins/Utils";
import Dashboard from "../views/Dashboard";
import { AppConfig } from "@/config/app-config";
import { ALL_SCOPE, CLIENT_SCOPE } from "@/config/project-resolution";

import Ticket from "../views/Ticket.vue";
import User from "../views/User.vue";

const dashboardRoutes = {
  path: "/",
  component: DashboardLayout,
  meta: {
    requestAuthentication: AppConfig.enableAuth,
    hideGlobalSearch: false,
  },
  children: [
    {
      path: "/dashboard",
      name: "dashboard",
      components: {
        default: Dashboard,
      },
      meta: {
        displayTitle: "Sah!ya Dashboard",
        requestAuthentication: AppConfig.enableAuth,
      },
    },

    {
      path: "/ticket",
      name: "ticket",
      components: { default: Ticket },

      meta: {
        displayTitle: "Sah!ya Ticket",
        requestAuthentication: AppConfig.enableAuth,
      },
    },
    {
      path: "/user",
      name: "user",
      components: { default: User },
      meta: {
        displayTitle: "Sah!ya User",
        requestAuthentication: AppConfig.enableAuth,
      },
    },
  ],
};

if (inArray([ALL_SCOPE, CLIENT_SCOPE], AppConfig.projectResolution))
  dashboardRoutes.children.push(...usersRoutes);

export default dashboardRoutes;
