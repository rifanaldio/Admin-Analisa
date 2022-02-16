/**
 * Vue extended function
 */
export default {
  install(Vue) {
    Vue.prototype.formatBytes = function (bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    Vue.filter("upperCase", str => {
      return (str + "").toLocaleUpperCase();
    });

    Vue.filter("formatBytes", (bytes, decimals = 2) => {
      return Vue.prototype.formatBytes(bytes, decimals);
    });

    Vue.prototype.iteratorApply =
      Vue.prototype.iteratorApply ||
      function (iterable, callback) {
        for (const element of iterable) {
          callback.apply(null, element);
        }
      };

    /**
     * @param {Object} obj
     * @param {String|Number} key
     * @param val
     */
    Vue.prototype.oReadOnly = function (obj, key, val) {
      return Object.defineProperty(obj, key, {
        configurable: false,
        value: val,
        writable: false
      });
    };

    /**
     * @param {Object} obj
     */
    Vue.prototype.lockObj =
      Vue.prototype.lockObj ||
      function (obj) {
        return Object.seal(obj);
      };

    /**
     * @param {string} prefix
     * @param {boolean} reverse
     * @return {string}
     */
    Vue.prototype.myGuid = function (prefix, reverse = false) {
      let guid = "";
      if (!reverse) {
        guid += prefix;
        do {
          guid += ~~(Math.random() * 1000000).toString(); // "~~" acts like a faster Math.floor() here
        } while (document.getElementById(guid));
      } else {
        do {
          guid += ~~(Math.random() * 1000000).toString(); // "~~" acts like a faster Math.floor() here
        } while (document.getElementById(guid + prefix));
        guid += prefix;
      }

      return guid;
    };

    /**
     * @param src
     * @param cb
     */
    Vue.prototype.loadScript = function (src, cb) {
      const scriptEl = document.createElement("script");
      scriptEl.src = src;
      scriptEl.async = true;
      document.querySelector("head").appendChild(scriptEl);
      scriptEl.addEventListener("load", cb);
    };

    /**
     * @param {string} text
     * @return {string}
     */
    Vue.prototype.toCamelCase = Vue.prototype.toCamelCase || toCamelCase;

    /**
     * @param {String} x
     * @param {Number?} start
     * @param {Number?} length
     * @return {String}
     */
    Vue.prototype.mysubstring =
      Vue.prototype.mysubstring ||
      function (x, start, length) {
        return (x + "").substring(start, length);
      };

    Vue.filter("mysubstring", Vue.prototype.mysubstring);

    /**
     * @param {string} message
     * @param {string[]} _
     */
    Vue.prototype.showErrorMessage =
      Vue.prototype.showErrorMessage ||
      function (message, ..._) {
        let messageClone = message;
        for (let i = 0; i < _.length; i++) {
          const x = _[i];
          messageClone += "\n";
          messageClone += x;
        }

        this.$bvToast.toast(messageClone, {
          toaster: "b-toaster-top-center",
          title: "Error!",
          variant: "danger",
          solid: true,
          appendToast: true
        });
      };

    /**
     * @param {string} message
     * @param {string[]} _
     */
    Vue.prototype.showSuccessMessages =
      Vue.prototype.showSuccessMessages ||
      function (message, ..._) {
        let messageClone = message;
        for (let i = 0; i < _.length; i++) {
          const x = _[i];
          messageClone += "\n";
          messageClone += x;
        }

        this.$bvToast.toast(messageClone, {
          toaster: "b-toaster-top-center",
          title: "Success",
          variant: "success",
          solid: true,
          appendToast: true
        });
      };
  }
};

export const isArray = Array.isArray;

export function toCamelCase(text) {
  // cek jika uppercase semuanya,
  // jika uppercase semuanya langsung buang.
  if (/^[A-Z0-9 ]+$/.test(text)) return text;

  let result = "";
  const title = text.replace(/^[a-z]|[A-Z]/g, (v, i) =>
    i === 0 ? v.toUpperCase() : " " + v.toLowerCase()
  );
  const titles = title.split(/[ _-]+/);

  for (let i = 0; i < titles.length; i++) {
    const splitElement = titles[i] + "";
    result += (splitElement[0] || "").toLocaleUpperCase();
    result += splitElement.substr(1) + " ";
  }

  return result;
}

export function isString(val) {
  return typeof val === "string";
}

export function isBoolean(val) {
  return val === true || val === false;
}

export function isFunction(val) {
  return typeof val === "function";
}

export function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isPlainObject(obj) {
  return (
    isObject(obj) &&
    Object.prototype.getPrototypeOf.call(obj) === Object.prototype
  );
}

// noinspection JSUnusedGlobalSymbols
export function isBlob(obj) {
  return typeof Blob !== "undefined" && obj instanceof Blob;
}

export function isPromiseLike(obj) {
  return (obj && (obj instanceof Promise || (obj.then && isFunction(obj.then)) || (obj + "").toLowerCase().indexOf("[object Promise]") > -1 || (obj + "").includes("async")));
}

export function sleep(milisecods) {
  return new Promise(resolve => {
    return setTimeout(resolve, milisecods);
  });
}

// noinspection JSUnusedGlobalSymbols
export function strToBytes(str) {
  let ch,
    st,
    re = [],
    j = 0;
  for (let i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i);
    if (ch < 127) {
      re[j++] = ch & 0xff;
    } else {
      st = []; // clear stack
      do {
        st.unshift(ch & 0xff); // push byte to stack
        ch = ch >> 8; // shift value down by 1 byte
      } while (ch);
      // add stack contents to result
      // done because chars have "wrong" endianness
      re = re.concat(st);
    }
  }
  // return an array of bytes
  return re;
}

/**
 * @param {Array} arr
 * @param {String[]|String|Number[]|Number} key
 * @return {boolean}
 */
export function inArray(arr, key) {
  if (!Array.isArray(key)) return (arr || []).some(value => value === key);

  for (let i = 0; i < key.length; i++) {
    const keyElement = key[i];
    if (inArray(arr, keyElement)) return true;
  }

  return false;
}

// noinspection JSUnusedGlobalSymbols
export function isFormData(obj) {
  return typeof FormData !== "undefined" && obj instanceof FormData;
}

export function isUndefined(x) {
  return x === undefined || x === null;
}

// noinspection JSUnusedGlobalSymbols
export function isDefined(x) {
  return x !== undefined && x !== null;
}
