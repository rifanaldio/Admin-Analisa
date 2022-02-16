const resolution_constants = require("./project-resolution");
const sslMode = (typeof location !== "undefined" && location.origin
  ? location.origin
  : "https://"
).startsWith("https://");
const corsMode = ((host) =>
  [
    "192.168.7.101",
    "192.168.7.2",
    "192.168.7.2:8080",
    "192.168.7.2:8081",
  ].indexOf(host) >= 0)(
  typeof location !== "undefined" && location.host ? location.host : "-1"
);

const projectResolution = resolution_constants.CLIENT_SCOPE;
// const projectResolution = resolution_constants.OPERATOR_SCOPE;
// const projectResolution = resolution_constants.ALL_SCOPE;
const env_production = process.env["NODE_ENV"] === "production";

const AppConfig = Object.freeze({
  documentTitle: "Sah Indonesia Jaya",
  /**
   * Ini adalah konfigurasi lingkup penanda bahwa aplikasi dapat dijalankan pada sesi tertentu.
   * Misalnya aplikasi dijalankan pada resolusi client maka hal-hal yang terkait dengan admin operator akan di-nonaktifkan.
   *
   * Jenis yang dapat digunakan meliputi:
   * -------
   *  * all
   *   Aplikasi dapat berjalan pada semua lingkup proses.
   *  * clientwin
   *   Aplikasi berjalan pada lingkup proses client dan proses admin operator tidak tersedia pada lingkup ini
   *  * operator
   *  Aplikasi berjalan pada lingkup proses admin operator dan proses client tidak tersedia pada lingkup ini
   *
   * @typedef {String} projectResolution lihat pada constants isian dari {@link "src/config/project-resolution.js"}
   */
  projectResolution: projectResolution,

  // BASE_URL: resolution_constants.CLIENT_SCOPE === projectResolution ? "/sahya-local/client/" : "/sahya-local/admin/",
  BASE_URL: "/",

  /**
   * @type {boolean} production
   * Jika aplikasi berjalan pada mode produksi (<b>false</b>) atau debugging (<b>true</b>)  <br/>
   * (ini memang sudah ditentukan oleh Vue dan teridentifikasi apakah aplikasi berada di lingkungan produksi atau debugging tapi ini hanya untuk memastikan saja)
   */
  production: env_production,

  /**
   * @type {string} api_url
   * nama domain atau ip tempat resource diambil.
   */
  // api_url: "https://192.168.7.101/sahya-api/",
  api_url: ((servIp) =>
    Object.values({
      scheme: sslMode ? "https://" : "http://",
      host: env_production ? servIp : "192.168.7.150",
      path: "/sahya-api/",
    }).join(""))(
    typeof location !== "undefined" && location.host
      ? location.host
      : "192.168.7.150"
  ),

  /**
   * @type {boolean} http_pre_flight
   * ganti ke <b>true</b> jika permintaan seperti login, pengambilan data table dsb berasal dari domain yang berbeda.
   * dan <b>false</b> jika sama. misalnya hosting dari aplikasi front-end ini berada di domain aaa.com dan domain back-end berasal dari bbb.com maka ini
   * adalah cross-origin atau nilai dari httpPreFlight harusnya menjadi <b>true</b> atau akan menimbulkan pesan kesalahan saat permintaan fetch berlangsung.
   */
  // http_pre_flight: !(location.host || "").includes("192.168.7.101"),
  http_pre_flight: corsMode,

  /**
   * Url yang digunakan untuk mengakses rute verifikasi video
   */
  meeting_url: "https://meeting.cs-indonesia.id/",

  /**
   * @type {boolean} ssl_mode
   * jika aplikasi menggunakan model mode scheme https (untuk aplikasi hosting vue ini).
   */
  ssl_mode: sslMode,
  // ssl_mode: true,

  /**
   * @see https://www.bigdatacloud.com/customer/account/index
   */
  big_data_api_key: "23bc773c39794904b833e8891f9c2967",

  /**
   * @type {{minutes:Number, hours:Number, days:Number, months:Number, years:Number}} sessionExp
   */
  sessionExp: (() =>
    Object.freeze({
      minutes: 0,
      hours: 0,
      days: 1,
      months: 0,
      years: 0,
    }))(),

  enableAuth: false,
});

// jangan dirubah metode pengeksporan variable. karena dengan begini code completion dari
// editor jetbrain dapat mendeteksi properti yang ditampung dalam variable.
module.exports = { AppConfig };
