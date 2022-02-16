/**
 * Ini adalah konfigurasi lingkup penanda bahwa aplikasi dapat dijalankan pada sesi tertentu.
 * Misalnya aplikasi dijalankan pada resolusi client maka hal-hal yang terkait dengan admin operator akan di-nonaktifkan.
 *
 *  * client
 *   Aplikasi berjalan pada lingkup proses client dan proses admin operator tidak tersedia pada lingkup ini
 *
 * @type {String} CLIENT_SCOPE
 */
/*export */const CLIENT_SCOPE = "client";
/**
 * Ini adalah konfigurasi lingkup penanda bahwa aplikasi dapat dijalankan pada sesi tertentu.
 * Misalnya aplikasi dijalankan pada resolusi client maka hal-hal yang terkait dengan admin operator akan di-nonaktifkan.
 *
 *  * operator
 *  Aplikasi berjalan pada lingkup proses admin operator dan proses client tidak tersedia pada lingkup ini
 *
 * @type {String} OPERATOR_SCOPE
 */
/*export */const OPERATOR_SCOPE = "operator";
/**
 * Ini adalah konfigurasi lingkup penanda bahwa aplikasi dapat dijalankan pada sesi tertentu.
 * Misalnya aplikasi dijalankan pada resolusi client maka hal-hal yang terkait dengan admin operator akan di-nonaktifkan.
 *
 *  * all
 *   Aplikasi dapat berjalan pada semua lingkup proses.
 *
 * @type {String} ALL_SCOPE
 */
/*export */const ALL_SCOPE = "all";

module.exports = {
  ALL_SCOPE,
  CLIENT_SCOPE,
  OPERATOR_SCOPE,
};