/* eslint-disable */

export class CryptoInsecureContext {

  static #chrsz = 8;
  static #hexcase = 0;
  static #hex_tab = CryptoInsecureContext.#hexcase ? '0123456789ABCDEF' : '0123456789abcdef';

  constructor() {}

  static #textToChars(text) {
    return text.split("").map((c) => c.charCodeAt(0));
  }

  static #byteHex(n) {
    return ("0" + Number(n).toString(16)).substr(-2);
  }

  static #_safeAdd(x, y) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /**
   * @return {number}
   */
  static #_sigma(X, n) {
    return (X >>> n) | (X << (32 - n));
  }

  /**
   * @param X
   * @param n
   * @return {*}
   * @constructor
   */
  static #_round(X, n) {
    return (X >>> n);
  }

  /**
   * @return {number}
   */
  static #Ch(x, y, z) {
    return ((x & y) ^ ((~x) & z));
  }

  /**
   * @return {number}
   */
  static #Maj(x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z));
  }

  /**
   * @return {number}
   */
  static #Sigma0256(x) {
    return (CryptoInsecureContext.#_sigma(x, 2) ^ CryptoInsecureContext.#_sigma(x, 13) ^ CryptoInsecureContext.#_sigma(x, 22));
  }

  /**
   * @return {number}
   */
  static #Sigma1256(x) {
    return (CryptoInsecureContext.#_sigma(x, 6) ^ CryptoInsecureContext.#_sigma(x, 11) ^ CryptoInsecureContext.#_sigma(x, 25));
  }

  /**
   * @return {number}
   */
  static #Gamma0256(x) {
    return (CryptoInsecureContext.#_sigma(x, 7) ^ CryptoInsecureContext.#_sigma(x, 18) ^ CryptoInsecureContext.#_round(x, 3));
  }

  /**
   * @return {number}
   */
  static #Gamma1256(x) {
    return (CryptoInsecureContext.#_sigma(x, 17) ^ CryptoInsecureContext.#_sigma(x, 19) ^ CryptoInsecureContext.#_round(x, 10));
  }

  /**
   * @param m
   * @param l
   * @return {number[]}
   */
  static #core_sha256(m, l) {
    const K = [
      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98,
      0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
      0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8,
      0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
      0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819,
      0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
      0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7,
      0xC67178F2
    ];
    const HASH = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
    const W = new Array(64);
    let a, b, c, d, e, f, g, h, i, j;
    let T1, T2;

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for (i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (j = 0; j < 64; j++) {
        if (j < 16)
          W[j] = m[j + i];
        else
          W[j] = CryptoInsecureContext.#_safeAdd(CryptoInsecureContext.#_safeAdd(CryptoInsecureContext.#_safeAdd(CryptoInsecureContext.#Gamma1256(W[j - 2]), W[j - 7]), CryptoInsecureContext.#Gamma0256(W[j - 15])), W[j - 16]);

        T1 = CryptoInsecureContext.#_safeAdd(CryptoInsecureContext.#_safeAdd(CryptoInsecureContext.#_safeAdd(CryptoInsecureContext.#_safeAdd(h, CryptoInsecureContext.#Sigma1256(e)), CryptoInsecureContext.#Ch(e, f, g)), K[j]), W[j]);
        T2 = CryptoInsecureContext.#_safeAdd(CryptoInsecureContext.#Sigma0256(a), CryptoInsecureContext.#Maj(a, b, c));

        h = g;
        g = f;
        f = e;
        e = CryptoInsecureContext.#_safeAdd(d, T1);
        d = c;
        c = b;
        b = a;
        a = CryptoInsecureContext.#_safeAdd(T1, T2);
      }

      HASH[0] = CryptoInsecureContext.#_safeAdd(a, HASH[0]);
      HASH[1] = CryptoInsecureContext.#_safeAdd(b, HASH[1]);
      HASH[2] = CryptoInsecureContext.#_safeAdd(c, HASH[2]);
      HASH[3] = CryptoInsecureContext.#_safeAdd(d, HASH[3]);
      HASH[4] = CryptoInsecureContext.#_safeAdd(e, HASH[4]);
      HASH[5] = CryptoInsecureContext.#_safeAdd(f, HASH[5]);
      HASH[6] = CryptoInsecureContext.#_safeAdd(g, HASH[6]);
      HASH[7] = CryptoInsecureContext.#_safeAdd(h, HASH[7]);
    }
    return HASH;
  }

  static #str2binb(str) {
    const bin = Array();
    const mask = (1 << CryptoInsecureContext.#chrsz) - 1;

    for (let i = 0; i < str.length * CryptoInsecureContext.#chrsz; i += CryptoInsecureContext.#chrsz)
      bin[i >> 5] |= (str.charCodeAt(i / CryptoInsecureContext.#chrsz) & mask) << (24 - i % 32);

    return bin;
  }

  /**
   * @return {string}
   */
  static #Utf8Encode(str) {
    str = str.replace(/\r\n/g, '\n');
    let utftext = '';

    for (let n = 0; n < str.length; n++) {
      const ch = str.charCodeAt(n);
      if (ch < 128) {
        utftext += String.fromCharCode(ch);
      } else if ((ch > 127) && (ch < 2048)) {
        utftext += String.fromCharCode((ch >> 6) | 192);
        utftext += String.fromCharCode((ch & 63) | 128);
      } else {
        utftext += String.fromCharCode((ch >> 12) | 224);
        utftext += String.fromCharCode(((ch >> 6) & 63) | 128);
        utftext += String.fromCharCode((ch & 63) | 128);
      }
    }

    return utftext;
  }

  static #binb2hex(binarray) {
    let str = '';
    for (let i = 0; i < binarray.length * 4; i++)
      str += CryptoInsecureContext.#hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + CryptoInsecureContext.#hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);

    return str;
  }


  /**
   * Original code by Angel Marin, Paul Johnston
   * ----
   * Secure Hash Algorithm (SHA256)
   * {@link http://www.webtoolkit.info/}
   *
   * @param {string} text
   * @return {string}
   **/
  static SHA256(text) {
    const seed = CryptoInsecureContext.#Utf8Encode(text + "");
    const m = CryptoInsecureContext.#str2binb(seed);
    const l = seed.length * CryptoInsecureContext.#chrsz;

    return CryptoInsecureContext.#binb2hex(CryptoInsecureContext.#core_sha256(m, l));
  }

  /**
   * @param {string} salt the cipher string.
   * @param {string} text the text data being encoded.
   * @return {string}
   */
  crypt(salt, text) {
    return text.split("")
      .map(CryptoInsecureContext.#textToChars)
      .map((code) => CryptoInsecureContext.#textToChars(salt).reduce((a, b) => a ^ b, code))
      .map(CryptoInsecureContext.#byteHex)
      .join("");
  }

  /**
   * @param {string} salt the cipher string.
   * @param {string} encoded the encoded data.
   * @return {string}
   */
  decrypt(salt, encoded) {
    return encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map((code) => CryptoInsecureContext.#textToChars(salt).reduce((a, b) => a ^ b, code))
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  }
}