const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://stageapi.monkcommerce.app",
      changeOrigin: true,
      pathRewrite: { "^/api": "" }, // Rewrite /api to nothing in the actual call
    })
  );
};
