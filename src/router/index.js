import Vue from "vue";
import VueRouter from "vue-router";

import {
  inArray,
  isFunction,
  isString,
  isUndefined,
  toCamelCase,
} from "@/plugins/Utils";
import { AppConfig } from "@/config/app-config";

import httpStatus from "./httpStatusRoutes";
// import DashboardLayout from "@/layout/DashboardLayout";
// import Dashboard from "../views/Dashboard.vue";
// import Laporan from "../views/Laporan.vue";
// import Ticket from "../views/Ticket.vue";
// import User from "../views/User.vue";
// import Details from "../views/Details.vue";

import MainPage from "../views/Home.vue";
import LoginPage from "../views/Login.vue";
import authentication from "./authenticationRoutes";
import dashboardRoutes from "./dashboardRoutes";
import Logout from "../views/common/Logout.vue";
import NotFoundPage from "../views/common/NotFoundPage.vue";
import StartPage from "../views/Dashboard/StartPage.vue";

import { AuthenticationServiceProvider } from "@/module/index";
// import { createRouter, createWebHashHistory } from "vue-router";
//
// import DashboardLayout from "@/layout/DashboardLayout";
// import Dashboard from "../views/Dashboard.vue";
// import Laporan from "../views/Laporan.vue";
// import Ticket from "../views/Ticket.vue";
// import User from "../views/User.vue";
// import Details from "../views/Details.vue";
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
const Interceptor = require("@/module/Interceptor");
const provider = new AuthenticationServiceProvider();

Object.defineProperty(Vue.prototype, "$auth", {
  value: provider,
  writable: false,
});

const routes = [
  {
    path: "/",
    component: MainPage,
    meta: {
      requestAuthentication: AppConfig.enableAuth,
      accessRules(userdata, to, from, next) {
        return userdata ? () => next({ name: StartPage.name }) : false;
      },
    },
  },
];

// noinspection JSCheckFunctionSignatures
routes.push(httpStatus);
//routes.push(dashboardRoutes);
routes.push(...authentication);

if (false === AppConfig.production) {
  routes.push(dashboardRoutes);
}

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env["BASE_URL"],
  linkActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash)
      return {
        selector: to.hash,
      };
    return {
      x: 0,
      y: 0,
    };
  },
});

router.beforeEach(processRoute);

async function processRoute(to, from, next) {
  const docTitle = to.meta["displayTitle"];
  if (document)
    document.title =
      !docTitle || !isString(docTitle)
        ? AppConfig.documentTitle || "WebPack App"
        : toCamelCase(docTitle);

  if (!to.meta) return next();

  // ini adalah perenderingan rute terkondisi berdasarkan AppConfig.projectResolution
  const resolutions = to.meta["resolutions"];
  if (resolutions) {
    if (
      Array.isArray(resolutions) &&
      !inArray(resolutions, AppConfig.projectResolution)
    )
      return next({ name: NotFoundPage.name });

    if (isString(resolutions) && AppConfig.projectResolution !== resolutions)
      return next({ name: NotFoundPage.name });

    to.meta.hasResolution = function (res) {
      if (!Array.isArray(res)) res = [res];

      const clonedResolutions = Array.isArray(resolutions)
        ? resolutions
        : [resolutions];
      for (let i = 0; i < res.length; i++) {
        const re = res[i];
        if (inArray(clonedResolutions, re)) return true;
      }

      return false;
    };
  }

  /* eslint-disable no-debugger */
  const authentication = to.meta["requestAuthentication"];
  // Jika properti "requestAuthentication" tidak ditemukan pada definisi rute (meta), ini menandakan bahwa
  // rute dapat diakses secara bebas tanpa keterlibatan proses autentifikasi pengguna terlrbih dahulu
  // maka permintaan akan langsung di arahkan ke halaman yang di inginkan.
  if (isUndefined(authentication)) return next();

  // cek jika path validator adalah boolean langsung.
  let requestAuth = true === authentication;

  // jika path validator bukan boolean langsung,
  // dan berjenis fungsi yang diharuskan mengembalikan boolean.
  if (false === requestAuth && isFunction(authentication))
    requestAuth = authentication.apply(Vue, [to, from, next]);

  // ini adalah akses pertama kali waktu proses login selesai dan halaman diarahkan ke halaman depan
  // pengguna setelah pengguna selesai divalidasi login atau pengguna melakukan proses logout, jadi
  // pengecekan pada database token memerlukan waktu tunggu beberapa saat bagi database untuk
  // menyelesaikan prosesnya.
  const useWaitHandle =
    (from.name === LoginPage.name &&
      to.params &&
      to.params["loggedIn"] === true) ||
    from.name === Logout.name;

  // verifikasi token.
  const authenticated = useWaitHandle
    ? await new Promise((resolve) =>
        setTimeout(async () => resolve(await provider.auth()), 200)
      )
    : await provider.auth();

  // cek jika akses login tidak diperlukan (False) namun properti rute "requestAuthentication"
  // masih ditentukan dengan nilai "False" yang menandakan bahwa rute hanya dapat diakses jika
  // pengguna belum melakukan proses login sebelumnya
  if (false === requestAuth && !authenticated) return next();

  // disini jika dibutuhkan autentikasi login
  if (!authenticated && to.name !== LoginPage.name) {
    // jika autentikasi login tidak berhasil misalnya token tidak sah,
    // atau memang sebelumnya user belum melakukan login.
    return next({
      name: LoginPage.name,
      query: { ended: provider.isSessionEnded },
    });
  }

  let returnNextByUserCallback = false;
  /** @type {Function} accessRules */
  const accessRules = to.meta["accessRules"];
  if (isFunction(accessRules)) {
    const userRules = accessRules.apply(this, [
      provider.userdata,
      to,
      from,
      next,
    ]);

    if (!userRules) return next({ name: NotFoundPage.name });

    if (userRules instanceof Function) {
      next = userRules;
      returnNextByUserCallback = true;
    }
  }

  Interceptor.setHeaderAuthorization(await provider.getToken());
  if (!returnNextByUserCallback) {
    // proteksi agar tidak login ulang jika user telah melakukan login sebelumnya.
    // maka rute dibawah yang disebutkan tidak dapat diakses jika user belum melakukan logout terlebih dahulu.
    if (to.name !== StartPage.name && false === requestAuth)
      // langsung diarahkan ke halaman awal dashboard.
      return next({ name: StartPage.name });
  }

  return next();
  /* eslint-enable no-debugger */
}

export default router;
