/**
 * @param {{dbname:String, version:String, description:String, maxsize:Number}} config
 * @constructor
 */
export function DB(config) {
  "use strict";

  const configDefault = {
    dbname: "app-db",
    version: "1.0.0",
    description: "Client side database",
    maxsize: 2 * 1024 * 1024
  };

  if (typeof config === "object")
    for (const k in config) {
      if (Object.prototype.hasOwnProperty.call(configDefault, k)) {
        configDefault[k] = config[k];
      }
    }

  /** @type {Database|null} connection */
  let connection = null;

  /**
   * @param {any|String} tableName
   * @return {Promise<number>} Jika kembalian adalah <br/>
   *
   *  + <b>-1</b> = itu menandakan ada suatu kesalahan pada parameter yang digunakan atau gagal mengeksekusi query.
   *  + <b>0</b> = Table ditemukan maka.
   *  + <b>1</b> = Table yang dicari tidak ditemukan.
   */
  const checkTable = function (tableName) {
    let errorCode = -1;
    if (connection === null)
      return Promise.resolve(errorCode);

    return new Promise((resolve) => {
      connection.transaction(transaction => {
        transaction.executeSql("SELECT COUNT(*) AS record_master FROM sqlite_master WHERE tbl_name = ? AND type = ?", [tableName, "table"], (tx, resultSet) => {
          errorCode = resultSet.rows.length > 0 && resultSet.rows.item(0)["record_master"] > 0 ? 0 : 1;
          resolve(errorCode);
        }, (tx, err) => {
          errorCode = err.code !== undefined ? err.code : 1;
          resolve(errorCode);
        })
      });
      return errorCode;
    })
  };

  /**
   * Membuat/menyambungkan koneksi ke database. <br/>
   * Catatan
   * ______
   * bahwa fungsi ini perlu di panggil sebelum memproses statement query seperti
   *  + select
   *  + insert
   *  + update
   *  + delete
   *  + truncate
   *  + drop
   *
   * atau fungsi yang disebutkan akan melempar pesan kesalahan karena belum ada koneksi table yang sebelumnya dibuat.
   *
   * @param {String} tableName nama tabel yang akan dilakukan sambungan.
   * @return DB
   * @throws Error jika gagal membuat sambungan koneksi baru ke table.
   */
  this.connect = function (tableName) {
    const connected = this.isConnected();
    if (connected && configDefault.tablename === tableName)
      return this;

    if(connected)
      this.disconnect();

    configDefault.tablename = tableName;

    /* eslint-disable no-debugger */
    let err = null;
    // noinspection JSCheckFunctionSignatures
    connection = openDatabase(configDefault.dbname, configDefault.version, configDefault.description, configDefault.maxsize);
    connection.transaction(function (transaction) {
      transaction.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (storename string(50) unique, valuestore string(256))`, [], null, (tx, error) => {
        err = error;
        return true;
      });
    });

    if (null !== err)
      throw Error(`${err.message} :[${err.code}]`);
    /* eslint-enable no-debugger */

    return this;
  };

  /**
   * Mengetahui apakah database telah tersambung
   * @returns {boolean}
   */
  this.isConnected = () => connection !== null;

  /**
   * Lempar pesan kesalahan jika tidak ada koneksi database yang dapat di baca.
   * @return void
   */
  this.shouldThrowErrorIfNoConnection = () => {
    if (!this.isConnected()) {
      throw new Error("No database connection has been made");
    }
  };

  /**
   * Mengambil record dari dalam databse table.
   * @param {String|Object} key
   * @param {function(err:SQLError):void} errorCallback
   * @return {Promise<any|String>}
   */
  this.select = (key, errorCallback) => {
    this.shouldThrowErrorIfNoConnection();
    return new Promise((resolve, reject) => {
      let data = null;
      const tablename = configDefault.tablename;
      connection.transaction(function (transaction) {
        transaction.executeSql(`SELECT valuestore FROM ${tablename} WHERE storename = ?`, [key], (tx, resultSet) => {
          if (resultSet.rows.length !== 0)
            data = resultSet.rows[0]["valuestore"];

          resolve(data);
        }, (tx, error) => {
          if (typeof errorCallback === "function") {
            errorCallback.apply(null, [error]);
          }else{
            reject(error);
          }
        });
      });
    });
  };

  /**
   * Memperbarui record dari dalam database table.
   * @param {String} key
   * @param {any|String} value
   * @return {Promise<boolean>}
   */
  this.update = async (key, value) => {
    this.shouldThrowErrorIfNoConnection();
    const tablename = configDefault.tablename;
    return await new Promise(resolve => {
      connection.transaction(function (transaction) {
        transaction.executeSql(`UPDATE ${tablename} SET valuestore = ? WHERE storename = ?;`, [value, key], () => {
          resolve(true);
        }, function () {
          resolve(false);
        });
      });
    });
  };

  /**
   * Menghapus record dari dalam database table.
   * @param {String} key
   * @return {Promise<boolean>}
   */
  this.delete = async (key) => {
    this.shouldThrowErrorIfNoConnection();
    const tablename = configDefault.tablename;
    return await new Promise(resolve => {
      connection.transaction(function (transaction) {
        transaction.executeSql(`DELETE FROM ${tablename} WHERE storename = ?;`, [key], () => {
          resolve(true);
        }, () => {
          resolve(false);
        });
      })
    });
  };

  /**
   * Menambahkan record ke dalam database table.
   * @param {String} key
   * @param {any|String} value
   * @return {Promise<boolean>}
   */
  this.insert = async (key, value) => {
    this.shouldThrowErrorIfNoConnection();
    let success = true;
    const tablename = configDefault.tablename;
    const select = await this.select(key, null);
    if (select !== null) {
      success = select === value ? true : this.update(key, value);
    } else {
      success = await new Promise(resolve => {
        connection.transaction(function (transaction) {
          transaction.executeSql(`INSERT INTO ${tablename} (storename, valuestore) VALUES (?, ?)`, [key, value], () => {
            resolve(true);
          }, function () {
            resolve(false);
          });
        })
      });
    }

    return success;
  };

  /**
   * Menghapus semua record yang ada pada table database.
   * @return {Promise<boolean>}
   */
  this.truncate = async () => {
    this.shouldThrowErrorIfNoConnection();
    const tablename = configDefault.tablename;
    let success = await checkTable(tablename) === 0;

    if (success) {
      success = await new Promise(resolve => connection.transaction(tx => tx.executeSql(`DELETE FROM ${tablename};`, [], () => {
       resolve(true);
      }, () => {
        resolve(false);
      })))
    }

    return success;
  };

  /**
   * Menghapus table dari database.
   *
   * @return {Promise<boolean>}
   */
  this.drop = async () => {
    this.shouldThrowErrorIfNoConnection();
    const tablename = configDefault.tablename;
    let success = await checkTable(tablename) === 0;

    if (success) {
      success = await new Promise(resolve => {
        connection.transaction(function (transaction) {
          transaction.executeSql(`DROP TABLE ${tablename};`, [], () => {
            resolve(true);
          }, function () {
            resolve(false)
          });
        })
      });
    }

    return success;
  };

  /**
   * Putuskan sambungan koneksi database.
   * @return void
   */
  this.disconnect = function () {
    configDefault.tablename = null;
    connection = null;
  }
}