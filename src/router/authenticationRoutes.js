import AuthLayout from "@/views/AuthLayout";
import Login from "../views/Login";
import Logout from "@/views/common/Logout";

export default [
  {
    path: "/login",
    component: AuthLayout,
    meta: {
      requestAuthentication: false,
    },
    children: [
      {
        path: "",
        name: Login.name,
        component: Login,
        meta: {
          requestAuthentication: false,
          noBodyBackground: true,
          hideFooter: true,
        },
      },
    ],
  },
  {
    path: "/logout",
    name: Logout.name,
    component: Logout,
    meta: {
      requestAuthentication: true,
    },
  },
];
