/* eslint-disable */
import { DB } from "./DB";
import { AppConfig } from "@/config/app-config";
import * as jwt from "jsonwebtoken";
import { CryptoInsecureContext } from "./CryptoInsecureContext";
import { inArray, isObject } from "@/plugins/Utils";
import { ALL_SCOPE, OPERATOR_SCOPE } from "@/config/project-resolution";

export default class AuthenticationServiceProvider {
  /**
   * @type {CryptoInsecureContext}
   * @private
   */
  static #_cryptoInsecureContext = new CryptoInsecureContext();
  /**
   * @type {String|null}
   * @private
   */
  #authCredentials = null;
  /**
   * @type {String}
   * @private
   */
  #baseurl = AppConfig.api_url || "/";
  /**
   * @type {boolean}
   * @private
   */
  #isCorsMode = AppConfig.http_pre_flight;
  /**
   * @type {String|null} authCredentials
   * @private
   * */
  #key = "credentials";
  /**
   * Field yang menandakan bahwa sesi login telah habis.
   * @type {boolean} sessionEnded
   * @private
   */
  #sessionEnded = false;
  #_tableName = "users";
  /**
   * @type {DB} _adapter
   */
  #_adapter;

  constructor() {
    const resolution = AppConfig.projectResolution;
    const operator_scope = inArray([ALL_SCOPE, OPERATOR_SCOPE], resolution);
    this.#_adapter = new DB({
      dbname: operator_scope
        ? "authentication_service_a"
        : "authentication_service_client",
      maxsize: 2 * 1024,
      description: "penanganan token dalam client database",
      version: "1.0.1",
    });
  }

  /**
   * @type {{region: string, ip: string, grant_admin: boolean, note: string, full_name: string, updated_at: string, mobile: string|null, active: boolean, created_at: string, id: string, email: string, username: string}} _userdata
   * @private
   */
  #_userdata;

  /**
   * @return {{region: string, ip: string, grant_admin: boolean, note: string, full_name: string, updated_at: string, mobile: (string|null), active: boolean, created_at: string, id: string, email: string, username: string}}
   */
  get userdata() {
    return this.#_userdata;
  }

  // noinspection JSValidateTypes
  /**
   * @param {any} value
   */
  set #userdata(value) {
    this.#_userdata = Object.freeze(value);
  }

  /**
   * @return {boolean}
   */
  get runAdmin() {
    return isObject(this.#_userdata) && true === this.#_userdata.grant_admin;
  }

  /**
   * @return {boolean}
   */
  get isLabel() {
    return isObject(this.#_userdata) && 7 === this.#_userdata["roleId"];
  }

  /**
   * @return {boolean}
   */
  get isPublishing() {
    return isObject(this.#_userdata) && 6 === this.#_userdata["roleId"];
  }

  /**
   * @return {boolean}
   */
  get isArtist() {
    return isObject(this.#_userdata) && 3 === this.#_userdata["roleId"];
  }

  /**
   * @return {boolean}
   */
  get isUser() {
    return this.isLabel && this.isPublishing;
  }

  /**
   * @return {boolean}
   */
  get isSessionEnded() {
    return this.#sessionEnded;
  }

  /**
   * @param message
   * @param _
   */
  static #logError(message, ..._) {
    if (AppConfig.production === false) console.error(message, _);
  }

  /**
   * @return {string}
   */
  static #getChiperKey() {
    const n = navigator;
    return JSON.stringify([n.name, n.version, n.userAgent, n.vendor]);
  }

  /**
   * Check that a JWT has not expired.
   */
  static checkExpiration(token) {
    try {
      const header = jwt.decode(token);
      const now = Math.floor(Date.now() / 1000);
      return header && header.exp > now;
    } catch (e) {
      return false;
    }
  }

  /**
   * get client-info
   * @return {Promise<any>}
   */
  static async #clientInfo() {
    // const request = new Request(`https://api.bigdatacloud.net/data/ip-geolocation-with-confidence?key=${AppConfig.big_data_api_key}`, {
    const request = new Request("https://api.db-ip.com/v2/free/self", {
      method: "GET",
      redirect: "follow",
      mode: "cors",
    });

    const response = await fetch(request).catch(function (reason) {
      return reason;
    });

    return response.json();
  }

  /**
   * @return {Promise<boolean>}
   */
  async auth() {
    const connection = this.#_adapter.connect(this.#_tableName);
    try {
      this.#sessionEnded = false;

      /* eslint-disable no-debugger */
      /** @type {String} authToken */
      const authToken = await connection.select(this.#key, (sqlError) =>
        AuthenticationServiceProvider.#logError(sqlError.message)
      );
      this.#authCredentials = authToken;
      let loggedIn = authToken !== null;
      if (!loggedIn) return loggedIn;

      const credentials = JSON.parse(
        AuthenticationServiceProvider.#_cryptoInsecureContext.decrypt(
          AuthenticationServiceProvider.#getChiperKey(),
          authToken
        )
      );
      this.#authCredentials = credentials["access_token"];
      if (!this.#authCredentials) {
        AuthenticationServiceProvider.#logError("Invalid Token");
        // saat invalid token seharusnya token di hapus dari database.
        return await this.#detachUser().then(() => false);
      }

      // noinspection JSValidateTypes
      this.#userdata = credentials["profil"] || {};
      if (AuthenticationServiceProvider.checkExpiration(this.#authCredentials))
        return loggedIn;

      AuthenticationServiceProvider.#logError("Token Expired");

      this.#sessionEnded = true;
    } catch (e) {
      AuthenticationServiceProvider.#logError(e);
    } finally {
      if (this.#_adapter.isConnected()) {
        this.#_adapter.disconnect();
      }
    }
    /* eslint-enable no-debugger */
    return false;
  }

  /**
   * @return {Promise<string|null>}
   */
  async getToken() {
    // jika token belum terpanggil oleh fungsi external, maka pengguna yang
    // akan logout harus di proses authentikasi terlebih dahulu untuk mendapatkan token.
    if (!this.#authCredentials) if (!(await this.auth())) return null;

    return this.#authCredentials;
  }

  /**
   * @return {String}
   */
  getTokenSync() {
    return this.#authCredentials;
  }

  /**
   * @param {{access_token:String,profil:{grant_admin: boolean, note: string, full_name: string, updated_at: string, mobile: string, active: boolean, created_at: string, id: string, email: string, username: string}}} token_data
   * @return {{access_token:String,profil:{grant_admin: boolean, note: string, full_name: string, updated_at: string, mobile: string, active: boolean, created_at: string, id: string, email: string, username: string}}|boolean}
   */
  async refresh(token_data) {
    const connection = this.#_adapter.connect(this.#_tableName);
    try {
      const token = AuthenticationServiceProvider.#_cryptoInsecureContext.crypt(
        AuthenticationServiceProvider.#getChiperKey(),
        JSON.stringify(token_data)
      );
      if (await connection.insert(this.#key, token)) {
        this.#authCredentials = token_data.access_token;
        this.#userdata = token_data["profil"] || {};
      }
    } catch (e) {
      AuthenticationServiceProvider.#logError(e);
      return false;
    } finally {
      if (this.#_adapter.isConnected()) this.#_adapter.disconnect();
    }

    return token_data;
  }

  /**
   * @param {string} token
   * @return {Promise<string|null>}
   */
  async refreshToken(token) {
    const connection = this.#_adapter.connect(this.#_tableName);
    try {
      const authToken = await connection.select(this.#key, (sqlError) =>
        AuthenticationServiceProvider.#logError(sqlError.message)
      );
      if ((this.#authCredentials = authToken) === null) return null;

      const credentials = JSON.parse(
        AuthenticationServiceProvider.#_cryptoInsecureContext.decrypt(
          AuthenticationServiceProvider.#getChiperKey(),
          authToken
        )
      );
      this.#authCredentials = credentials["access_token"];
      this.#userdata = credentials["profil"] || {};

      const refreshed = await this.refresh({
        access_token: token,
        profil: this.userdata,
      });
      if (!refreshed) return null;

      this.#authCredentials = token;
    } catch (e) {
      AuthenticationServiceProvider.#logError(e);
      return null;
    } finally {
      if (this.#_adapter.isConnected()) this.#_adapter.disconnect();
    }

    return this.#authCredentials;
  }

  /**
   * @return {Promise<{status: number, statusText: string, ok: boolean}>}
   */
  async logout() {
    const resolution = AppConfig.projectResolution;
    // operator enggak pakai logout, jadi langsung hapus saja akses tokennya.
    if (inArray([ALL_SCOPE, OPERATOR_SCOPE], resolution)) {
      return await this.#detachUser().then((tokenDeleted) => {
        if (!tokenDeleted)
          return Promise.reject({
            status: -2,
            statusText: "Error processing user session",
            ok: false,
          });

        return Promise.resolve({ status: 0, statusText: "OK", ok: true });
      });
    }

    let tokenDeleted = false;
    try {
      // logout dulu ke api
      const postdata = JSON.stringify({
        ip: this.userdata.ip,
        region: this.userdata.region,
      });

      const requestHeaders = new Headers();
      requestHeaders.append("Content-Type", "application/json");

      // noinspection JSCheckFunctionSignatures
      const requestOptions = {
        method: "POST",
        headers: requestHeaders,
        body: postdata,
        redirect: "follow",
      };

      // jangan di hapus!!.
      if (this.#isCorsMode) requestOptions.mode = "cors";

      const request = new Request(
        `${this.#baseurl}users/logout`,
        requestOptions
      );
      // jika token belum terpanggil oleh fungsi external, maka pengguna yang
      // akan logout harus di proses authentikasi terlebih dahulu untuk mendapatkan token.
      request.headers.set("Authorization", "Bearer " + (await this.getToken()));
      const response = await fetch(request).catch(function (reason) {
        return reason;
      });
      /* eslint-disable no-debugger */

      // jika error terjadi seharusnya (jika error 500 internal server error)
      // disini akan ada balikan berupa string.
      if (typeof response === "string")
        return Promise.reject({ status: -1, statusText: response, ok: false });

      // cek respon http
      if (!response)
        return Promise.reject({
          status: -1,
          statusText: "Error undefined response variable",
          ok: false,
        });

      if (true !== response.ok)
        return Promise.reject({
          status: response.status,
          statusText: response.statusText,
          ok: false,
        });

      // cek balikan dari API server.
      const promiseJson = await response.json();
      if (
        promiseJson.statusCode !== 200 &&
        Object.prototype.hasOwnProperty.call(promiseJson, "error")
      )
        return Promise.reject({
          status: promiseJson.error.type,
          statusText: promiseJson.error.description,
          ok: false,
        });

      // lalu hapus token pada sesi lokal
      tokenDeleted = await this.#detachUser();
    } catch (e) {
      AuthenticationServiceProvider.#logError(e);
    }
    if (!tokenDeleted)
      return Promise.reject({
        status: -2,
        statusText: "Error processing user session",
        ok: false,
      });

    return Promise.resolve({ status: 0, statusText: "OK", ok: true });
  }

  /**
   * @param {string} username
   * @param {string} password
   * @return {Promise<{status:string|number,statusText:string}>}
   */
  async login(username, password) {
    const clientInfo = await AuthenticationServiceProvider.#clientInfo();

    const clientData = {
      ip: clientInfo.ipAddress,
      continentName: clientInfo.continentName,
      countryName: clientInfo.countryName,
      stateProv: clientInfo.stateProv,
      region: `${clientInfo.continentName}/${clientInfo.stateProv} (${clientInfo.countryName})`,
    };
    const postdata = JSON.stringify({
      username: username,
      password: password,
      ...clientData,
    });
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");

    // noinspection JSCheckFunctionSignatures
    const loginUrl = `${this.#baseurl}auth/api-auth`;
    const request = new Request(loginUrl, {
      method: "POST",
      headers: requestHeaders,
      body: postdata,
      redirect: "follow",
      mode: this.#isCorsMode ? "cors" : "no-cors",
    });
    const response = await fetch(request).catch(function (reason) {
      return reason;
    });
    /* eslint-disable no-debugger */

    // jika error terjadi seharusnya (jika error 500 internal server error)
    // disini akan ada balikan berupa string.
    if (typeof response === "string")
      return Promise.reject({ status: -1, statusText: response, ok: false });

    // cek respon http
    if (!response)
      return Promise.reject({
        status: -1,
        statusText: "Error undefined response variable",
        ok: false,
      });

    if (true !== response.ok)
      return Promise.reject({
        status: response.status,
        statusText: response.statusText,
        ok: false,
      });

    // cek balikan dari API server.
    const promiseJson = await response.json();
    if (
      promiseJson.statusCode !== 200 &&
      Object.prototype.hasOwnProperty.call(promiseJson, "error")
    )
      return Promise.reject({
        status: promiseJson.error.type,
        statusText: promiseJson.error.description,
        ok: false,
      });

    /**
     * @type {{access_token: string, profil: {grant_admin: boolean, note: string, full_name: string, updated_at: string, mobile: string|null, active: boolean, created_at: string, id: string, email: string, username: string}}}
     */
    const csiresponse = promiseJson.data;
    if (
      Object.prototype.hasOwnProperty.call(csiresponse.profil, "active") &&
      !csiresponse.profil.active
    )
      return Promise.reject({
        status: -2,
        statusText: "Error processing user session",
        ok: false,
      });

    csiresponse["profil"] = { ...clientData, ...(csiresponse["profil"] || {}) };
    // noinspection JSCheckFunctionSignatures
    const refreshed = await this.refresh(csiresponse);
    if (!refreshed)
      return Promise.reject({
        status: -2,
        statusText: "Error processing user session",
        ok: false,
      });

    return Promise.resolve({
      status: 0,
      statusText: "OK",
      ok: true,
      data: csiresponse.profil,
    });
    /* eslint-enable no-debugger */
  }

  /**
   * Digunakan untuk menghapus token dari database.
   * @return {Promise<boolean>}
   */
  async #detachUser() {
    let tokenDeleted = false;
    try {
      const connection = this.#_adapter.connect(this.#_tableName);
      tokenDeleted = await connection.delete(this.#key);
      if (tokenDeleted) {
        this.#authCredentials = null;
        this.#userdata = null;
      }
    } catch (e) {
      AuthenticationServiceProvider.#logError(e);
    } finally {
      if (this.#_adapter.isConnected()) this.#_adapter.disconnect();
    }
    return tokenDeleted;
  }
}
