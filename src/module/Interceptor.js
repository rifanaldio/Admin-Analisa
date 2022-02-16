import Vue from "vue";
import VueResource from "vue-resource";
import { AppConfig } from "@/config/app-config";
import { AuthenticationServiceProvider } from "@/module/index";

Vue.use(VueResource);
// Vue.http.options.root= AppConfig.api_url;

const provider = new AuthenticationServiceProvider();
let authToken = null;

/**
 * Hapus global header authorization jika pengguna telah habis sesinya atau melakukan logout.
 */
function removeHeaderAuthorization() {
  if (Vue.http.headers.common["Authorization"])
    delete Vue.http.headers.common["Authorization"];

  authToken = null;
}

/**
 * Set global header authorization jika pengguna telah login.
 *
 * @param {String} token
 */
function setHeaderAuthorization(token) {
  // Vue.http.headers.common['Authorization'] = token;
  authToken = token;
}

Object.defineProperty(Vue.prototype, "removeHeaderAuthorization", {
  value: removeHeaderAuthorization,
  writable: false,
});
Object.defineProperty(Vue.prototype, "setHeaderAuthorization", {
  value: setHeaderAuthorization,
  writable: false,
});
Object.defineProperty(Vue.prototype, "cors-mode", {
  value: AppConfig.http_pre_flight ? "cors" : "no-cors",
  writable: false,
});

/**
 * @param request
 * @param next
 * @return {*}
 */
const interceptorCallback = function (request, next) {
  const crossOrigin = request.url.includes(AppConfig.api_url);
  const headerAuthorizationIsPresent = request.headers.has("Authorization");
  if (headerAuthorizationIsPresent && (!crossOrigin || null === authToken)) {
    // hapus header "Authorization" jika bukan
    // cross-origin dan cross-origin harus berasal dari {AppConfig.api_url}
    return void request.headers.delete("Authorization");
  }

  request.headers.set("Authorization", "Bearer " + authToken);

  // penanganan response yang ada di bawah ini.
  return next(async function (response) {
    const headerAuthorizationIsPresent =
      response.headers.has("Authorization") || response.headers.has("X-Token");
    if (!(response.status === 200 && headerAuthorizationIsPresent))
      return response;

    if (!(await provider.auth())) return response;

    let token =
        (response.headers.get("Authorization") ||
          response.headers.get("X-Token")) + "",
      b;
    token = (b = token.split(" ")).length === 2 ? b[b.length - 1] : null;
    if (null === token) return response;

    return await provider.refreshToken(token).then(() => response);
  });
};

// interceptor untuk menambahkan header Authorization jika permintaan data
// adalah cors origin (lihat AppConfig.api_url) dan menggunakan fungsi yang di sediakan oleh VueResource.
Vue.http.interceptors.push(interceptorCallback);

export { setHeaderAuthorization, removeHeaderAuthorization };
