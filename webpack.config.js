const path = require("path");

const config = {
  runtimeCompiler: true,
  css: {
    modules: true
  },
  configureWebpack: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
    rules: {
      exclude: [
        path.resolve(__dirname, "static")
      ]
    }
  }
};

module.exports = config;